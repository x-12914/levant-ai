import { useEffect, useState } from "react";
import { Newspaper } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { analystRatings, news, watchlist } from "@/data/market";
import { classifySentiment, type Sentiment } from "@/lib/sentiment";
import { formatNumber, formatPercent, pnlColor } from "@/lib/format";
import { cn } from "@/lib/cn";

type SentState = Sentiment | "loading" | "error";

const sentTone: Record<Sentiment, "success" | "danger" | "neutral"> = {
  positive: "success",
  negative: "danger",
  neutral: "neutral",
};

export function AnalystInsights() {
  const [sent, setSent] = useState<Record<string, SentState>>(
    () => Object.fromEntries(news.map((n) => [n.id, "loading" as SentState])),
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const n of news) {
        try {
          const s = await classifySentiment(n.headline);
          if (!cancelled) setSent((p) => ({ ...p, [n.id]: s }));
        } catch {
          if (!cancelled) setSent((p) => ({ ...p, [n.id]: "error" }));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader
        icon={<Newspaper className="size-5" />}
        title="Analyst Insights"
        subtitle="Ratings and price targets are demo; headline sentiment is live via the AI model."
        demo
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Ratings */}
        <Card className="overflow-hidden">
          <div className="border-b border-border px-5 py-3 text-sm font-medium">Consensus ratings</div>
          <div className="divide-y divide-border">
            {watchlist.map((a) => {
              const r = analystRatings[a.symbol];
              if (!r) return null;
              const total = r.buy + r.hold + r.sell;
              return (
                <div key={a.symbol} className="flex items-center gap-4 px-5 py-3">
                  <div className="w-28 min-w-0">
                    <p className="font-medium">{a.symbol}</p>
                    <p className="truncate text-xs text-muted">{a.name}</p>
                  </div>
                  <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                    <span className="bg-pos" style={{ width: `${(r.buy / total) * 100}%` }} />
                    <span className="bg-[var(--text-faint)]" style={{ width: `${(r.hold / total) * 100}%` }} />
                    <span className="bg-neg" style={{ width: `${(r.sell / total) * 100}%` }} />
                  </div>
                  <div className="w-24 text-right">
                    <p className="tnum text-sm">{a.klass === "Forex" ? formatNumber(r.priceTarget, 4) : formatNumber(r.priceTarget, 0)}</p>
                    <p className={cn("tnum text-xs", pnlColor(r.upsidePct))}>
                      {r.upsidePct >= 0 ? "+" : ""}{formatPercent(r.upsidePct)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 border-t border-border px-5 py-2 text-xs text-muted">
            <span className="flex items-center gap-1"><i className="size-2 rounded-full bg-pos" /> Buy</span>
            <span className="flex items-center gap-1"><i className="size-2 rounded-full bg-[var(--text-faint)]" /> Hold</span>
            <span className="flex items-center gap-1"><i className="size-2 rounded-full bg-neg" /> Sell</span>
            <span className="ml-auto">target · upside</span>
          </div>
        </Card>

        {/* News + live sentiment */}
        <Card className="overflow-hidden">
          <div className="border-b border-border px-5 py-3 text-sm font-medium">News &amp; sentiment</div>
          <div className="divide-y divide-border">
            {news.map((n) => {
              const s = sent[n.id];
              return (
                <div key={n.id} className="px-5 py-3">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge tone="accent">{n.symbol}</Badge>
                    {s === "loading" ? (
                      <Badge tone="neutral">analyzing…</Badge>
                    ) : s === "error" ? (
                      <Badge tone="neutral">sentiment n/a</Badge>
                    ) : (
                      <Badge tone={sentTone[s]}>{s}</Badge>
                    )}
                    <span className="ml-auto text-xs text-faint">{n.source} · {n.ago}</span>
                  </div>
                  <p className="text-sm leading-snug">{n.headline}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
