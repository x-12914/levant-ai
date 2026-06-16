# Deploying Levant AI on a shared VPS (bare-metal, venv + systemd)

This app is designed to run **alongside other applications** on a single VPS
without disrupting them. Isolation is enforced by OS-level guardrails, not
containers. Read this top to bottom before the first deploy.

> **This deployment's confirmed setup:**
> - OS: **Ubuntu 22.04**
> - Reverse proxy: **existing nginx** (we add one vhost and reload — never restart)
> - Name + TLS: **DuckDNS hostname + `certbot --nginx`** (step 7)
> - Database: **dedicated DB + role on your existing Postgres** (step 5)
> - RAM: **conservative systemd caps** (320M AI + 256M gateway ≈ 0.58 GB total),
>   chosen because the box showed 1.5 GiB available with swap already full

## 1. Dedicated unprivileged user

```bash
sudo useradd --system --create-home --shell /bin/bash levant
sudo mkdir -p /opt/levant
sudo chown -R levant:levant /opt/levant
```

Everything below runs as `levant`. It has no access to the other apps.

## 2. Lay down the code

```bash
# from your build machine / CI, sync the repo (minus node_modules) to:
#   /opt/levant/services/ai
#   /opt/levant/services/gateway
#   /opt/levant/web        <- built SPA (apps/web `npm run build` -> dist/)
```

## 3. Python AI service (self-contained venv)

```bash
cd /opt/levant/services/ai
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env && nano .env     # set ANTHROPIC_API_KEY, SECRETS_MASTER_KEY
chmod 600 .env
```

No system-wide pip installs — the venv keeps our deps off the host so the other
apps' Python environments never change.

## 4. Node gateway (project-local runtime)

```bash
# install Node via nvm AS THE levant USER (no global/system Node change)
sudo -iu levant bash -lc '
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
  source ~/.nvm/nvm.sh && nvm install 22 && nvm use 22'

cd /opt/levant/services/gateway
sudo -iu levant bash -lc 'cd /opt/levant/services/gateway && npm ci && npm run build'
cp .env.example .env && nano .env && chmod 600 .env
```

Update the `ExecStart` node path in `levant-gateway.service` to match the
nvm version you installed.

## 5. Database — dedicated DB + role on your existing Postgres

You already run Postgres, so we add an isolated database and a least-privilege
role to it. This does not touch your other apps' databases.

```bash
sudo -u postgres psql <<'SQL'
CREATE ROLE levant LOGIN PASSWORD 'CHANGE_ME_STRONG';
CREATE DATABASE levant OWNER levant;
\c levant
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO levant;
SQL
```

Then put the connection string in both `.env` files:
`DATABASE_URL=postgresql://levant:CHANGE_ME_STRONG@127.0.0.1:5432/levant`

The `levant` role can only see its own database — it has no rights over the
databases your other apps use.

**Redis** (optional, for caching/pub-sub later): if you already run Redis, use a
dedicated logical index — `REDIS_URL=redis://127.0.0.1:6379/3`. If not, skip it
for now; nothing in v1 requires it yet.

## 6. systemd services (with resource caps)

**First, check your RAM headroom** so the caps are safe:

```bash
free -h                 # look at the "available" column
systemd-cgtop -1 -m     # what the other apps/Postgres currently use (press q)
```

The shipped caps total **~0.58 GB** (`MemoryMax=320M` AI + `256M` gateway) —
already lowered for this box, which reported **1.5 GiB available with swap full**.
Reference if your numbers change:

- **`available` ≥ ~1.5 GB** → the shipped 320M/256M is safe; you may raise to
  512M/384M once you've watched real usage.
- **`available` 0.8–1.5 GB** → keep 320M/256M (current setting).
- **`available` < 0.8 GB** → too tight; add swap headroom or don't co-locate.

> Your swap is currently 100% used — worth a look (`swapon --show`, `htop`).
> The low caps keep Levant AI from making that worse, but a box that's already
> swapping hard will feel slow regardless of what we add.

Then install and start:

```bash
sudo cp deploy/systemd/levant-ai.service      /etc/systemd/system/
sudo cp deploy/systemd/levant-gateway.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now levant-ai levant-gateway
systemctl status levant-ai levant-gateway
```

`MemoryMax`, `CPUQuota`, `TasksMax`, `Nice`, and `IOWeight` are the guardrails
that guarantee Levant AI cannot starve Postgres or your other apps. Start low;
raise only after watching real usage (`systemctl status` shows live memory).

## 7. Name + TLS (DuckDNS + certbot) and the nginx vhost

1. **Point a DuckDNS hostname at the VPS** — in the DuckDNS dashboard set your
   subdomain (e.g. `yourname`) to the server's public IP. Confirm:
   `dig +short yourname.duckdns.org` returns that IP.
   *(No-signup alternative: skip DuckDNS and use `<vps-ip>.nip.io` as the name.)*

2. **Install the vhost** (HTTP only — certbot adds TLS next):

   ```bash
   sudo cp deploy/nginx/levant.conf /etc/nginx/sites-available/levant
   # set server_name to your DuckDNS host:
   sudo sed -i 's/<yourname>.duckdns.org/yourname.duckdns.org/' \
     /etc/nginx/sites-available/levant
   sudo ln -s /etc/nginx/sites-available/levant /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx     # reload, never restart
   ```

3. **Get the certificate** — certbot edits this vhost in place to add the 443
   block and an HTTP→HTTPS redirect:

   ```bash
   sudo apt-get install -y certbot python3-certbot-nginx   # if not already present
   sudo certbot --nginx -d yourname.duckdns.org
   ```

Both services bind to `127.0.0.1` only — nginx is the sole public face. Auto-renewal
is handled by certbot's systemd timer (`systemctl status certbot.timer`).

## 8. Log rotation (don't fill the disk)

```
# /etc/logrotate.d/levant
/opt/levant/**/logs/*.log {
  daily
  rotate 7
  compress
  missingok
  notifempty
  copytruncate
}
```

## Updating

```bash
# sync new code, then:
cd /opt/levant/services/ai && .venv/bin/pip install -r requirements.txt
cd /opt/levant/services/gateway && sudo -iu levant bash -lc 'cd $PWD && npm ci && npm run build'
sudo systemctl restart levant-ai levant-gateway
```

## Rollback / removal (fully reversible)

```bash
sudo systemctl disable --now levant-ai levant-gateway
sudo rm /etc/systemd/system/levant-*.service && sudo systemctl daemon-reload
sudo rm /etc/nginx/sites-enabled/levant && sudo systemctl reload nginx
sudo userdel -r levant && sudo rm -rf /opt/levant
```

Nothing here touches the other apps' files, ports, deps, or services.
