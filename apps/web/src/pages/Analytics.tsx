import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { allocation, portfolioSeries } from "@/data/market";
import { cn } from "@/lib/cn";

const SLICE_COLORS = ["var(--accent)", "var(--accent-2)", "var(--pos)", "var(--warn)"];

const tooltipStyle = {
  background: "var(--surface-2)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  fontSize: 12,
} as const;

export function Analytics() {
  const start = portfolioSeries[0].value;
  const end = portfolioSeries[portfolioSeries.length - 1].value;
  const growth = ((end - start) / start) * 100;

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader icon={<BarChart3 className="size-5" />} title="Analytics" subtitle="Portfolio allocation and growth across your aggregated accounts." demo />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Allocation */}
        <Card className="p-5">
          <p className="text-sm font-medium">Asset allocation</p>
          <div className="mt-2 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={allocation} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2} stroke="none">
                  {allocation.map((_, i) => (
                    <Cell key={i} fill={SLICE_COLORS[i % SLICE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number, n) => [`${v}%`, n]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            {allocation.map((a, i) => (
              <div key={a.name} className="flex items-center gap-2">
                <i className="size-2.5 rounded-full" style={{ background: SLICE_COLORS[i % SLICE_COLORS.length] }} />
                <span className="text-muted">{a.name}</span>
                <span className="tnum ml-auto">{a.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Growth */}
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-medium">Portfolio growth</p>
            <span className={cn("tnum text-sm font-medium", growth >= 0 ? "text-pos" : "text-neg")}>
              {growth >= 0 ? "+" : ""}{growth.toFixed(1)}% YTD
            </span>
          </div>
          <div className="mt-2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioSeries} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}`, "index"]} />
                <Area type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={2} fill="url(#growthFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
