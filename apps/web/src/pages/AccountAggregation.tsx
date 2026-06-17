import { useState } from "react";
import { Layers, Link2, Lock, Plus, RefreshCw, X } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { accounts } from "@/data/mock";
import { formatMoney, formatPnl, pnlColor } from "@/lib/format";
import { cn } from "@/lib/cn";

// Demo balances per connected account (until live broker reads are wired).
const BALANCES: Record<string, { value: number; pnl: number }> = {
  "fxpro-mt5": { value: 18420.55, pnl: -237.53 },
  binance: { value: 9240.12, pnl: 182.34 },
  ibkr: { value: 0, pnl: 0 },
};

const SUPPORTED = ["Binance", "Interactive Brokers", "Coinbase", "MetaTrader 5", "TD Ameritrade", "Alpaca"];

export function AccountAggregation() {
  const toast = useToast();
  const [connecting, setConnecting] = useState<string | null>(null);

  const linked = accounts.filter((a) => a.connected);
  const totalValue = linked.reduce((s, a) => s + (BALANCES[a.id]?.value ?? 0), 0);
  const totalPnl = linked.reduce((s, a) => s + (BALANCES[a.id]?.pnl ?? 0), 0);

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader
        icon={<Layers className="size-5" />}
        title="Account Aggregation"
        subtitle="Read-only links to your brokers. Levant AI never places or moves funds."
        demo
        actions={
          <>
            <Button variant="secondary" size="sm" icon={<RefreshCw className="size-4" />}>
              Refresh
            </Button>
            <Button variant="primary" size="sm" icon={<Plus className="size-4" />} onClick={() => setConnecting("")}>
              Connect account
            </Button>
          </>
        }
      />

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Total value" value={formatMoney(totalValue)} />
        <Stat label="Aggregate P/L" value={formatPnl(totalPnl)} tone={pnlColor(totalPnl)} />
        <Stat label="Linked accounts" value={`${linked.length} of ${accounts.length}`} />
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
              title: "Linking not yet wired",
              message: `${broker}: read-only connector lands with live aggregation.`,
            });
          }}
        />
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <Card className="px-5 py-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className={cn("tnum mt-1.5 text-xl font-semibold", tone ?? "text-text")}>{value}</p>
    </Card>
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
          <Lock className="size-3" /> Encrypted at rest (AES-256). Use a key scoped to read-only.
        </p>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={() => onSubmit(broker)}>Link account</Button>
        </div>
      </Card>
    </div>
  );
}
