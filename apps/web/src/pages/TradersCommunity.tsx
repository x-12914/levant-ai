import { useState } from "react";
import { Copy, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { traders as seed, type Trader } from "@/data/market";
import { formatPercent, pnlColor } from "@/lib/format";
import { cn } from "@/lib/cn";

const riskTone: Record<Trader["risk"], "success" | "warn" | "danger"> = {
  Low: "success",
  Medium: "warn",
  High: "danger",
};

export function TradersCommunity() {
  const toast = useToast();
  const [traders, setTraders] = useState(seed);

  function toggleCopy(t: Trader) {
    setTraders((list) => list.map((x) => (x.id === t.id ? { ...x, copying: !x.copying } : x)));
    toast.push({
      tone: "info",
      title: t.copying ? "Stopped copying" : "Copying enabled (demo)",
      message: `${t.name} — allocation flow lands with live aggregation.`,
    });
  }

  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader
        icon={<Users className="size-5" />}
        title="Traders Community"
        subtitle="Follow top traders and copy their strategies. Copy allocation is read-only in v1."
        demo
      />

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-medium">Trader</th>
              <th className="px-3 py-3 text-right font-medium">Win rate</th>
              <th className="px-3 py-3 text-right font-medium">ROI</th>
              <th className="px-3 py-3 text-right font-medium">Followers</th>
              <th className="px-3 py-3 font-medium">Risk</th>
              <th className="px-5 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {traders.map((t, i) => (
              <tr key={t.id} className="border-b border-border/70 last:border-0 hover:bg-surface-2">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-center text-xs text-faint">{i + 1}</span>
                    <span className="flex size-9 items-center justify-center rounded-full bg-accent-gradient text-sm font-semibold text-white">
                      {t.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                    <div>
                      <p className="font-medium">{t.name}</p>
                      <p className="text-xs text-muted">{t.handle}</p>
                    </div>
                  </div>
                </td>
                <td className="tnum px-3 py-3 text-right">{formatPercent(t.winRate)}</td>
                <td className={cn("tnum px-3 py-3 text-right font-medium", pnlColor(t.roiPct))}>
                  +{formatPercent(t.roiPct)}
                </td>
                <td className="tnum px-3 py-3 text-right text-muted">{t.followers.toLocaleString()}</td>
                <td className="px-3 py-3"><Badge tone={riskTone[t.risk]}>{t.risk}</Badge></td>
                <td className="px-5 py-3 text-right">
                  <Button
                    variant={t.copying ? "secondary" : "primary"}
                    size="sm"
                    icon={<Copy className="size-3.5" />}
                    onClick={() => toggleCopy(t)}
                  >
                    {t.copying ? "Copying" : "Copy"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
