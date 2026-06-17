import { useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { analystRatings, priceSeries, watchlist, type Asset } from "@/data/market";
import { formatNumber, formatPercent, pnlColor } from "@/lib/format";
import { cn } from "@/lib/cn";

export function Research() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Asset>(watchlist[0]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return watchlist;
    return watchlist.filter((a) => a.symbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q));
  }, [query]);

  const rating = analystRatings[selected.symbol];

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader icon={<Search className="size-5" />} title="Research" subtitle="Search assets and review price action, key stats, and analyst targets." demo />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Search + list */}
        <Card className="overflow-hidden">
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search symbol or name"
                className="h-9 w-full rounded-ctl border border-border bg-surface-2 pl-9 pr-3 text-sm placeholder:text-faint"
              />
            </div>
          </div>
          <div className="max-h-[420px] divide-y divide-border overflow-y-auto">
            {results.map((a) => (
              <button
                key={a.symbol}
                onClick={() => setSelected(a)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-2",
                  selected.symbol === a.symbol && "bg-surface-2",
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{a.symbol}</p>
                  <p className="truncate text-xs text-muted">{a.name}</p>
                </div>
                <div className="text-right">
                  <p className="tnum text-sm">{formatNumber(a.price, a.klass === "Forex" ? 4 : 2)}</p>
                  <p className={cn("tnum text-xs", pnlColor(a.changePct))}>
                    {a.changePct >= 0 ? "+" : ""}{formatPercent(a.changePct)}
                  </p>
                </div>
              </button>
            ))}
            {results.length === 0 && <p className="px-4 py-6 text-center text-sm text-muted">No matches.</p>}
          </div>
        </Card>

        {/* Detail */}
        <Card className="p-5 lg:col-span-2">
          <div className="flex flex-wrap items-baseline gap-3">
            <h3 className="text-lg font-semibold">{selected.symbol}</h3>
            <span className="text-sm text-muted">{selected.name}</span>
            <Badge tone="neutral">{selected.klass}</Badge>
            <div className="ml-auto text-right">
              <p className="tnum text-xl font-semibold">{formatNumber(selected.price, selected.klass === "Forex" ? 4 : 2)}</p>
              <p className={cn("tnum text-sm", pnlColor(selected.changePct))}>
                {selected.changePct >= 0 ? "+" : ""}{formatPercent(selected.changePct)} today
              </p>
            </div>
          </div>

          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceSeries} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <YAxis domain={["dataMin - 4", "dataMax + 4"]} hide />
                <Tooltip
                  cursor={{ stroke: "var(--border-strong)" }}
                  contentStyle={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                  labelStyle={{ display: "none" }}
                  formatter={(v: number) => [v, "index"]}
                />
                <Line type="monotone" dataKey="p" stroke="var(--accent)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {rating && (
            <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-4">
              <Stat label="Analyst target" value={formatNumber(rating.priceTarget, selected.klass === "Forex" ? 4 : 0)} />
              <Stat label="Upside" value={`${rating.upsidePct >= 0 ? "+" : ""}${formatPercent(rating.upsidePct)}`} tone={pnlColor(rating.upsidePct)} />
              <Stat label="Buy ratings" value={String(rating.buy)} />
              <Stat label="Sell ratings" value={String(rating.sell)} />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="bg-surface px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className={cn("tnum mt-1 text-base font-semibold", tone ?? "text-text")}>{value}</p>
    </div>
  );
}
