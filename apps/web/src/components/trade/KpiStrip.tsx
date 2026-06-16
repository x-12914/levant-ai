import type { AccountKpis } from "@/data/types";
import { formatNumber, formatPercent, formatPnl, pnlColor } from "@/lib/format";
import { cn } from "@/lib/cn";

interface Cell {
  label: string;
  value: string;
  tone?: string;
}

export function KpiStrip({ kpis }: { kpis: AccountKpis }) {
  const cells: Cell[] = [
    { label: "Total Trades", value: String(kpis.totalTrades) },
    { label: "Win Rate", value: formatPercent(kpis.winRate), tone: pnlColor(kpis.winRate >= 50 ? 1 : -1) },
    { label: "Avg. P/L", value: formatPnl(kpis.avgPnl), tone: pnlColor(kpis.avgPnl) },
    { label: "Best Trade", value: formatPnl(kpis.bestTrade), tone: pnlColor(kpis.bestTrade) },
    { label: "Worst Trade", value: formatPnl(kpis.worstTrade), tone: pnlColor(kpis.worstTrade) },
    { label: "Volume", value: formatNumber(kpis.volume) },
  ];

  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-card border border-border bg-surface sm:grid-cols-3 xl:grid-cols-6">
      {cells.map((c, i) => (
        <div
          key={c.label}
          className={cn(
            "px-5 py-4",
            // hairline dividers between cells, no side-stripe accents
            "border-border",
            i % 2 === 0 ? "border-r" : "",
            "sm:[&:nth-child(3n)]:border-r-0 sm:[&:not(:nth-child(3n))]:border-r",
            "xl:border-r xl:last:border-r-0",
            i < 4 ? "border-b sm:[&:nth-child(n+4)]:border-b-0" : "",
            "xl:border-b-0",
          )}
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted">{c.label}</p>
          <p className={cn("tnum mt-1.5 text-xl font-semibold", c.tone ?? "text-text")}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}
