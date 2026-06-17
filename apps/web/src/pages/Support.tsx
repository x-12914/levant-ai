import { useState } from "react";
import { ChevronDown, LifeBuoy, Mail } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

const FAQ = [
  {
    q: "Can Levant AI place trades for me?",
    a: "No. Version 1 is strictly read-only — it aggregates accounts, analyzes, and explains, but never places or modifies orders.",
  },
  {
    q: "How are my broker keys protected?",
    a: "Connect with read-only API keys. They're encrypted at rest (AES-256) and two-factor authentication is required when linking an account.",
  },
  {
    q: "Is the AI's analysis financial advice?",
    a: "No. AskAI and the insights are informational, can be wrong, and should be verified before you act.",
  },
  {
    q: "Which brokers are supported?",
    a: "Binance, Interactive Brokers, Coinbase, MetaTrader 5, TD Ameritrade, and Alpaca, with more on the roadmap. Live linking ships with the aggregation connectors.",
  },
];

export function Support() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-[760px]">
      <PageHeader icon={<LifeBuoy className="size-5" />} title="Support" subtitle="Answers to common questions, plus how to reach us." />

      <Card className="mb-5 overflow-hidden">
        {FAQ.map((item, i) => (
          <div key={i} className="border-b border-border last:border-0">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium hover:bg-surface-2"
            >
              {item.q}
              <ChevronDown className={cn("size-4 text-muted transition-transform", open === i && "rotate-180")} />
            </button>
            {open === i && <p className="animate-fade-in px-5 pb-4 text-sm leading-relaxed text-muted">{item.a}</p>}
          </div>
        ))}
      </Card>

      <Card className="flex items-center gap-4 p-5">
        <div className="flex size-10 items-center justify-center rounded-lg bg-accent-gradient">
          <Mail className="size-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium">Still stuck?</p>
          <p className="text-sm text-muted">
            Email <a href="mailto:support@levant-ai.app" className="text-accent">support@levant-ai.app</a> and we'll get back to you.
          </p>
        </div>
      </Card>
    </div>
  );
}
