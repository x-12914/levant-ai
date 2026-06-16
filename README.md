# Tradexas

A web trading workspace that aggregates accounts across multiple brokers
(forex, stocks, crypto) into one **read-only** command center, with an AI
assistant, analyst-insight summaries, a strategy lab, and a traders community.

Built from [the scope doc](Development%20Scope%20for%20Comprehensive%20AI%20Trading%20Application%20with%20Account%20Aggregation.pdf);
UI theme follows the reference in [the design image](WhatsApp%20Image%202026-06-16%20at%207.26.33%20PM.jpeg).

> **v1 is read-only.** It reads balances, positions, and history and analyzes
> them. It does not place or modify orders. See [PRODUCT.md](PRODUCT.md).

## Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite + TypeScript + Tailwind (OKLCH theme tokens) — [apps/web](apps/web) |
| Gateway / BFF | Node + Fastify (auth, WebSocket fan-out, proxy) — [services/gateway](services/gateway) |
| AI / aggregation | Python + FastAPI (Claude API, read-only broker data, quant) — [services/ai](services/ai) |
| Data | PostgreSQL + Redis (added as features land) |
| Deploy | Bare-metal venv + systemd on a shared VPS — [deploy/](deploy) |

Design system spec: [DESIGN.md](DESIGN.md). It uses the `impeccable` Claude
skill; the AI layer uses the `claude-api` skill (models default to Claude).

## Repository layout

```
apps/web/             React SPA (the Tradexas dashboard)
services/gateway/     Node/Fastify BFF + WebSocket
services/ai/          Python/FastAPI AI + aggregation service
deploy/               systemd units, nginx vhost, deploy guide
PRODUCT.md DESIGN.md  Product + design context
```

## Run locally

Three terminals (the SPA proxies `/api` and `/ws` to the gateway, which proxies
AI calls to the Python service):

```bash
# 1. Frontend
cd apps/web && npm install && npm run dev          # http://127.0.0.1:5173

# 2. Gateway
cd services/gateway && npm install
cp .env.example .env && npm run dev                # 127.0.0.1:8081

# 3. AI service
cd services/ai && python -m venv .venv
.venv/bin/pip install -r requirements.txt          # Windows: .venv\Scripts\pip
cp .env.example .env   # set ANTHROPIC_API_KEY
.venv/bin/python -m app.main                       # 127.0.0.1:8082
```

The dashboard renders with mock read-only data out of the box; the gateway and
AI service are wired but optional for frontend work.

## Deploying

The VPS is shared with other apps that must not be disrupted. The full
bare-metal isolation procedure (dedicated user, venv, nvm, systemd resource
caps, existing reverse proxy) is in [deploy/README.md](deploy/README.md).

## Deployment target (confirmed)

- OS: **Ubuntu 22.04**
- Reverse proxy: **existing nginx** (one added vhost, reload only)
- Name + TLS: **DuckDNS hostname + `certbot --nginx`** (or `<ip>.nip.io`)
- Database: **dedicated DB + role on the existing Postgres**
- RAM: **conservative systemd caps (~0.9 GB)** — confirm `free -h` headroom before enabling

Full procedure and the exact commands are in [deploy/README.md](deploy/README.md).

## Status

Scaffold complete: theme + design system, the Trade Management dashboard from
the reference, gateway and AI service skeletons, and the deploy guardrails.
Next: account-aggregation connectors (read-only), wiring the dashboard to live
data over WebSocket, and the AskAI chat UI.
# trader
