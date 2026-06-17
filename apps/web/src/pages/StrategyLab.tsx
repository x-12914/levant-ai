import { useState } from "react";
import { FlaskConical, GitCompareArrows, Play, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { pairStats, strategies, type Strategy } from "@/data/market";
import { formatNumber, formatPercent, pnlColor } from "@/lib/format";
import { cn } from "@/lib/cn";

const statusTone: Record<Strategy["status"], "success" | "accent" | "neutral"> = {
  Live: "success",
  Paper: "accent",
  Draft: "neutral",
};

export function StrategyLab() {
  const toast = useToast();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader
        icon={<FlaskConical className="size-5" />}
        title="Strategy Lab"
        subtitle="Pair-trading correlation, strategy backtests, and a no-code builder. Read-only: backtests only, no live orders."
        demo
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="size-4" />}
            onClick={() => toast.push({ tone: "info", title: "No-code builder", message: "Strategy builder lands next." })}
          >
            New strategy
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* Pair correlation */}
        <Card className="overflow-hidden lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-border px-5 py-3 text-sm font-medium">
            <GitCompareArrows className="size-4 text-accent" /> Pair correlation
          </div>
          <div className="divide-y divide-border">
            {pairStats.map((p) => (
              <div key={`${p.a}-${p.b}`} className="flex items-center gap-3 px-5 py-3">
                <span className="flex-1 text-sm font-medium">{p.a} / {p.b}</span>
                <div className="w-24">
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                    <span className="block h-full bg-accent-gradient" style={{ width: `${p.correlation * 100}%` }} />
                  </div>
                  <p className="mt-1 text-right text-xs text-muted">ρ {p.correlation.toFixed(2)}</p>
                </div>
                <span
                  className={cn(
                    "tnum w-16 text-right text-sm font-medium",
                    Math.abs(p.zScore) >= 2 ? "text-warn" : "text-muted",
                  )}
                  title="Spread z-score — |z|≥2 flags a divergence"
                >
                  z {p.zScore > 0 ? "+" : ""}{p.zScore.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
          <p className="border-t border-border px-5 py-2 text-xs text-muted">
            |z| ≥ 2 marks pairs diverging from their historical relationship.
          </p>
        </Card>

        {/* Strategies */}
        <Card className="overflow-hidden lg:col-span-3">
          <div className="border-b border-border px-5 py-3 text-sm font-medium">Strategies</div>
          <div className="divide-y divide-border">
            {strategies.map((s) => (
              <div key={s.id}>
                <div className="flex items-center gap-3 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{s.name}</p>
                    <p className="text-xs text-muted">{s.type} · {s.instrument}</p>
                  </div>
                  <Badge tone={statusTone[s.status]}>{s.status}</Badge>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Play className="size-3.5" />}
                    onClick={() => setOpenId(openId === s.id ? null : s.id)}
                  >
                    Backtest
                  </Button>
                </div>
                {openId === s.id && (
                  <div className="grid grid-cols-3 gap-px border-t border-border bg-border animate-fade-in">
                    <Metric label="Sharpe" value={formatNumber(s.sharpe, 2)} />
                    <Metric label="Max drawdown" value={formatPercent(s.maxDrawdownPct)} tone={pnlColor(s.maxDrawdownPct)} />
                    <Metric label="Win rate" value={formatPercent(s.winRate)} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="bg-surface px-5 py-3">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className={cn("tnum mt-1 text-lg font-semibold", tone ?? "text-text")}>{value}</p>
    </div>
  );
}
