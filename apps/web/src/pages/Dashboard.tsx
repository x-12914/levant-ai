import { useMemo, useState } from "react";
import { Activity, Download, RefreshCw, Wifi, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { KpiStrip } from "@/components/trade/KpiStrip";
import { TradeTable } from "@/components/trade/TradeTable";
import { useToast } from "@/components/ui/Toast";
import { accounts, kpis, trades } from "@/data/mock";
import type { Trade } from "@/data/types";

export function Dashboard() {
  const toast = useToast();
  const [account, setAccount] = useState(accounts[0].id);
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [source, setSource] = useState("all");

  const filtered = useMemo(() => {
    return trades.filter((t) => {
      if (status !== "all" && t.status !== status) return false;
      if (type !== "all" && t.type !== type) return false;
      if (source !== "all" && t.source !== source) return false;
      return true;
    });
  }, [status, type, source]);

  const onClose = (t: Trade) => {
    // Read-only v1: order actions are simulated and surfaced honestly.
    toast.push({
      tone: "error",
      title: "Partial Failure Closing Pair Trade",
      message: `${t.asset}: 2 of 2 legs failed to close. Please check individual legs.`,
    });
  };

  const onRefresh = () => {
    toast.push({ tone: "info", title: "Refreshed", message: "Account data is up to date." });
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      {/* Section header */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Activity className="size-5 text-accent" />
          <h2 className="text-xl font-semibold">Trade Management</h2>
          <Badge tone="success" icon={<Wifi className="size-3" />}>
            EA Connected
          </Badge>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-muted">Account</span>
            <Select
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              options={accounts.map((a) => ({ value: a.id, label: a.label }))}
            />
          </div>
          <Button variant="secondary" size="sm" icon={<Zap className="size-4" />}>
            Quick
          </Button>
          <Button variant="secondary" size="sm" icon={<Download className="size-4" />}>
            Export CSV
          </Button>
          <Button variant="primary" size="sm" icon={<RefreshCw className="size-4" />} onClick={onRefresh}>
            Refresh
          </Button>
        </div>
      </div>

      <KpiStrip kpis={kpis} />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: "all", label: "All Statuses" },
            { value: "Executed", label: "Executed" },
            { value: "Pending", label: "Pending" },
            { value: "Closed", label: "Closed" },
            { value: "Failed", label: "Failed" },
          ]}
        />
        <Select
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={[
            { value: "all", label: "All Types" },
            { value: "Pair Trade", label: "Pair Trade" },
            { value: "Buy", label: "Buy" },
            { value: "Sell", label: "Sell" },
          ]}
        />
        <Select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          options={[
            { value: "all", label: "All Sources" },
            { value: "Pair Trade", label: "Pair Trade" },
            { value: "EA", label: "EA" },
            { value: "Bot", label: "Bot" },
            { value: "Copy", label: "Copy" },
            { value: "Manual", label: "Manual" },
          ]}
        />
        <span className="ml-auto text-[13px] text-muted">
          {filtered.length} of {trades.length} trades
        </span>
      </div>

      <TradeTable
        trades={filtered}
        onClose={onClose}
        onEdit={(t) => toast.push({ tone: "info", title: "Edit trade", message: `#${t.ticket} ${t.asset}` })}
      />
    </div>
  );
}
