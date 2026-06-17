import { useState, type ComponentType } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ToastProvider } from "@/components/ui/Toast";
import { Dashboard } from "@/pages/Dashboard";
import { AIAssistant } from "@/pages/AIAssistant";
import { AnalystInsights } from "@/pages/AnalystInsights";
import { StrategyLab } from "@/pages/StrategyLab";
import { AccountAggregation } from "@/pages/AccountAggregation";
import { TradersCommunity } from "@/pages/TradersCommunity";
import { Research } from "@/pages/Research";
import { Analytics } from "@/pages/Analytics";
import { Settings } from "@/pages/Settings";
import { Support } from "@/pages/Support";

const PAGES: Record<string, ComponentType> = {
  dashboard: Dashboard,
  ai: AIAssistant,
  insights: AnalystInsights,
  lab: StrategyLab,
  accounts: AccountAggregation,
  community: TradersCommunity,
  research: Research,
  analytics: Analytics,
  settings: Settings,
  support: Support,
};

export default function App() {
  const [active, setActive] = useState("dashboard");
  const Page = PAGES[active] ?? Dashboard;

  return (
    <ToastProvider>
      <AppShell active={active} onSelect={setActive}>
        <Page />
      </AppShell>
    </ToastProvider>
  );
}
