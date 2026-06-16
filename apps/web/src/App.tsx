import { useState } from "react";
import { Construction } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ToastProvider } from "@/components/ui/Toast";
import { Dashboard } from "@/pages/Dashboard";
import { AIAssistant } from "@/pages/AIAssistant";

const TITLES: Record<string, string> = {
  insights: "Analyst Insights",
  lab: "Strategy Lab",
  accounts: "Account Aggregation",
  community: "Traders Community",
  research: "Research",
  analytics: "Analytics",
  settings: "Settings",
  support: "Support",
};

export default function App() {
  const [active, setActive] = useState("dashboard");

  return (
    <ToastProvider>
      <AppShell active={active} onSelect={setActive}>
        {active === "dashboard" ? (
          <Dashboard />
        ) : active === "ai" ? (
          <AIAssistant />
        ) : (
          <Placeholder title={TITLES[active] ?? "Coming soon"} />
        )}
      </AppShell>
    </ToastProvider>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-surface">
        <Construction className="size-6 text-muted" />
      </div>
      <p className="mt-4 text-lg font-medium">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted">
        This section is part of the roadmap and isn't built yet.
      </p>
    </div>
  );
}
