import { ArrowDownRight, ArrowUpRight, GitCompareArrows, Pencil, X } from "lucide-react";
import type { Trade, TradeSource, TradeStatus, TradeType } from "@/data/types";
import { Badge } from "@/components/ui/Badge";
import { formatNumber, formatPnl, pnlColor } from "@/lib/format";
import { cn } from "@/lib/cn";

const statusTone: Record<TradeStatus, "success" | "warn" | "danger" | "neutral"> = {
  Executed: "success",
  Pending: "warn",
  Failed: "danger",
  Closed: "neutral",
};

const sourceTone: Record<TradeSource, "accent" | "info" | "neutral"> = {
  "Pair Trade": "accent",
  EA: "info",
  Bot: "accent",
  Copy: "info",
  Manual: "neutral",
};

function TypeCell({ type }: { type: TradeType }) {
  if (type === "Pair Trade") {
    return (
      <span className="inline-flex items-center gap-1.5 text-accent">
        <GitCompareArrows className="size-4" />
        Pair Trade
      </span>
    );
  }
  if (type === "Sell") {
    return (
      <span className="inline-flex items-center gap-1.5 text-neg">
        <ArrowDownRight className="size-4" />
        Sell
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-pos">
      <ArrowUpRight className="size-4" />
      Buy
    </span>
  );
}

interface TradeTableProps {
  trades: Trade[];
  onEdit?: (t: Trade) => void;
  onClose?: (t: Trade) => void;
}

export function TradeTable({ trades, onEdit, onClose }: TradeTableProps) {
  return (
    <div className="overflow-x-auto rounded-card border border-border bg-surface">
      <table className="w-full min-w-[860px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
            <Th className="pl-5">Ticket</Th>
            <Th>Asset</Th>
            <Th>Type</Th>
            <Th className="text-right">Quantity</Th>
            <Th className="text-right">Entry</Th>
            <Th className="text-right">SL</Th>
            <Th className="text-right">TP</Th>
            <Th className="text-right">P/L</Th>
            <Th>Status</Th>
            <Th>Source</Th>
            <Th className="pr-5 text-right">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {trades.map((t) => (
            <tr
              key={t.id}
              className="border-b border-border/70 transition-colors last:border-0 hover:bg-surface-2"
            >
              <Td className="pl-5 tnum text-muted">#{t.ticket}</Td>
              <Td className="font-medium">{t.asset}</Td>
              <Td><TypeCell type={t.type} /></Td>
              <Td className="tnum text-right text-muted">{t.quantity}</Td>
              <Td className="tnum text-right">{formatNumber(t.entry, 5)}</Td>
              <Td className="tnum text-right text-muted">{t.sl ? formatNumber(t.sl, 2) : "—"}</Td>
              <Td className="tnum text-right text-muted">{t.tp ? formatNumber(t.tp, 2) : "—"}</Td>
              <Td className={cn("tnum text-right font-medium", pnlColor(t.pnl))}>{formatPnl(t.pnl)}</Td>
              <Td><Badge tone={statusTone[t.status]}>{t.status}</Badge></Td>
              <Td><Badge tone={sourceTone[t.source]}>{t.source}</Badge></Td>
              <Td className="pr-5">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onEdit?.(t)}
                    aria-label="Edit trade"
                    className="rounded-md p-1.5 text-accent transition-colors hover:bg-[var(--accent-bg)]"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    onClick={() => onClose?.(t)}
                    aria-label="Close trade"
                    className="rounded-md p-1.5 text-neg transition-colors hover:bg-[var(--neg-bg)]"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={cn("px-3 py-3 font-medium", className)}>{children}</th>;
}
function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn("px-3 py-3.5 align-middle", className)}>{children}</td>;
}
