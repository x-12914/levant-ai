import { useEffect, useState } from "react";
import { AlertCircle, Layers, Link2, Lock, Plus, RefreshCw, Wifi, X } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { accounts } from "@/data/mock";
import { getAccountSummary, type AccountSummary } from "@/lib/accounts";
import { formatMoney, formatNumber, formatPercent, formatPnl, pnlColor } from "@/lib/format";
import { cn } from "@/lib/cn";

// Demo balances per connected account (until live broker reads are wired).
const BALANCES: Record<string, { value: number; pnl: number }> = {
  "fxpro-mt5": { value: 18420.55, pnl: -237.53 },
  binance: { value: 9240.12, pnl: 182.34 },
  ibkr: { value: 0, pnl: 0 },
};

const SUPPORTED = ["Alpaca", "Binance", "Interactive Brokers", "Coinbase", "MetaTrader 5", "TD Ameritrade"];

type Load = "loading" | "ready" | "error";

export function AccountAggregation() {
  const toast = useToast();
  const [connecting, setConnecting] = useState<string | null>(null);
  const [summary, setSummary] = useState<AccountSummary | null>(null);
  const [load, setLoad] = useState<Load>("loading");

  async function refresh() {
    setLoad("loading");
    try {
      setSummary(await getAccountSummary());
      setLoad("ready");
    } catch {
      setLoad("error");
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const live = load === "ready" && summary?.configured && summary.account ? summary : null;

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader
        icon={<Layers className="size-5" />}
        title="Account Aggregation"
        subtitle="Read-only links to your brokers. Levant AI never places or moves funds."
        actions={
          <>
            <Button variant="secondary" size="sm" icon={<RefreshCw className="size-4" />} onClick={refresh}>
              Refresh
            </Button>
            <Button variant="primary" size="sm" icon={<Plus className="size-4" />} onClick={() => setConnecting("")}>
              Connect account
            </Button>
          </>
        }
      />

      {/* Live broker */}
      {live ? (
        <LiveAccountCard summary={live} />
      ) : load === "ready" && summary && !summary.configured ? (
        <Card className="mb-6 flex items-start gap-3 p-4 text-sm">
          <Wifi className="mt-0.5 size-4 text-muted" />
          <p className="text-muted">
            No live broker connected. Set <code className="text-text">ALPACA_API_KEY</code> /
            <code className="text-text"> ALPACA_API_SECRET</code> in the AI service <code className="text-text">.env</code>{" "}
            (a free Alpaca paper account works) and Refresh. Demo accounts are shown below meanwhile.
          </p>
        </Card>
      ) : load === "error" ? (
        <Card className="mb-6 flex items-start gap-3 border-[color:var(--neg)]/40 bg-[var(--neg-bg)] p-4 text-sm">
          <AlertCircle className="mt-0.5 size-4 text-neg" />
          <p className="text-neg">
            Couldn't load the live account. If you set Alpaca keys, check they're read-only and valid
            (<code>journalctl -u levant-ai</code>).
          </p>
        </Card>
      ) : null}

      {/* Demo accounts */}
      <div className="mb-3 flex items-center gap-2">
        <h3 className="text-sm font-medium text-muted">Demo accounts</h3>
        <Badge tone="warn">Demo data</Badge>
      </div>
      <div className="space-y-3">
        {accounts.map((a) => {
          const bal = BALANCES[a.id] ?? { value: 0, pnl: 0 };
          return (
            <Card key={a.id} className="flex flex-wrap items-center gap-4 p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-surface-2 text-sm font-semibold text-muted">
                {a.platform.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-medium">{a.label}</p>
                <p className="text-xs text-muted">{a.platform}</p>
              </div>
              {a.connected ? (
                <Badge tone="success" icon={<Link2 className="size-3" />}>Connected</Badge>
              ) : (
                <Badge tone="neutral">Not linked</Badge>
              )}
              <div className="ml-auto flex items-center gap-8 text-right">
                <div>
                  <p className="text-xs text-muted">Value</p>
                  <p className="tnum font-medium">{a.connected ? formatMoney(bal.value) : "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">P/L</p>
                  <p className={cn("tnum font-medium", a.connected ? pnlColor(bal.pnl) : "text-muted")}>
                    {a.connected ? formatPnl(bal.pnl) : "—"}
                  </p>
                </div>
                {a.connected ? (
                  <Button variant="ghost" size="sm" onClick={() => toast.push({ tone: "info", title: "Unlink", message: `${a.label} (demo)` })}>
                    Unlink
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" onClick={() => setConnecting(a.platform)}>
                    Connect
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {connecting !== null && (
        <ConnectPanel
          preset={connecting}
          onClose={() => setConnecting(null)}
          onSubmit={(broker) => {
            setConnecting(null);
            toast.push({
              tone: "info",
              title: broker === "Alpaca" ? "Configure Alpaca in the server .env" : "Linking not yet wired",
              message:
                broker === "Alpaca"
                  ? "Set ALPACA_API_KEY / ALPACA_API_SECRET, restart levant-ai, then Refresh."
                  : `${broker}: read-only connector lands next.`,
            });
          }}
        />
      )}
    </div>
  );
}

function LiveAccountCard({ summary }: { summary: AccountSummary }) {
  const a = summary.account!;
  const positions = summary.positions ?? [];
  const dayPl = a.equity - a.lastEquity;

  return (
    <Card className="mb-6 overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-accent-gradient text-xs font-bold text-white">
          AL
        </div>
        <div>
          <p className="font-medium">Alpaca</p>
          <p className="text-xs text-muted">{a.currency} · {a.status}</p>
        </div>
        <Badge tone="success" icon={<Wifi className="size-3" />}>Live</Badge>
        {summary.paper && <Badge tone="accent">Paper</Badge>}
      </div>

      <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
        <Stat label="Equity" value={formatMoney(a.equity)} />
        <Stat label="Day P/L" value={formatPnl(dayPl)} tone={pnlColor(dayPl)} />
        <Stat label="Cash" value={formatMoney(a.cash)} />
        <Stat label="Buying power" value={formatMoney(a.buyingPower)} />
      </div>

      {positions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-2.5 font-medium">Symbol</th>
                <th className="px-3 py-2.5 text-right font-medium">Qty</th>
                <th className="px-3 py-2.5 text-right font-medium">Avg entry</th>
                <th className="px-3 py-2.5 text-right font-medium">Price</th>
                <th className="px-3 py-2.5 text-right font-medium">Mkt value</th>
                <th className="px-5 py-2.5 text-right font-medium">Unreal. P/L</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((p) => (
                <tr key={p.symbol} className="border-b border-border/70 last:border-0">
                  <td className="px-5 py-2.5 font-medium">{p.symbol}</td>
                  <td className="tnum px-3 py-2.5 text-right text-muted">{formatNumber(p.qty, 0)}</td>
                  <td className="tnum px-3 py-2.5 text-right">{formatNumber(p.avgEntry, 2)}</td>
                  <td className="tnum px-3 py-2.5 text-right">{formatNumber(p.currentPrice, 2)}</td>
                  <td className="tnum px-3 py-2.5 text-right">{formatMoney(p.marketValue)}</td>
                  <td className={cn("tnum px-5 py-2.5 text-right font-medium", pnlColor(p.unrealizedPl))}>
                    {formatPnl(p.unrealizedPl)} <span className="text-xs">({formatPercent(p.unrealizedPlPct)})</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="px-5 py-4 text-sm text-muted">No open positions.</p>
      )}
    </Card>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="bg-surface px-5 py-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className={cn("tnum mt-1.5 text-xl font-semibold", tone ?? "text-text")}>{value}</p>
    </div>
  );
}

function ConnectPanel({
  preset,
  onClose,
  onSubmit,
}: {
  preset: string;
  onClose: () => void;
  onSubmit: (broker: string) => void;
}) {
  const [broker, setBroker] = useState(preset || SUPPORTED[0]);
  const [key, setKey] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[oklch(0.05_0.02_265/0.6)] p-4" onClick={onClose}>
      <Card className="w-full max-w-md p-5 shadow-float" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Connect a broker</h3>
          <button onClick={onClose} className="rounded-md p-1 text-muted hover:bg-surface-2 hover:text-text">
            <X className="size-4" />
          </button>
        </div>

        <label className="mb-1 block text-xs font-medium text-muted">Broker</label>
        <select
          value={broker}
          onChange={(e) => setBroker(e.target.value)}
          className="mb-4 h-9 w-full rounded-ctl border border-border bg-surface-2 px-3 text-sm"
        >
          {SUPPORTED.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <label className="mb-1 block text-xs font-medium text-muted">Read-only API key</label>
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          type="password"
          placeholder="Paste a read-only key"
          className="mb-2 h-9 w-full rounded-ctl border border-border bg-surface-2 px-3 text-sm placeholder:text-faint"
        />
        <p className="mb-4 flex items-center gap-1.5 text-xs text-muted">
          <Lock className="size-3" /> Alpaca is wired now — set its keys in the server .env. Others land next.
        </p>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={() => onSubmit(broker)}>Link account</Button>
        </div>
      </Card>
    </div>
  );
}
