import {
  LayoutGrid,
  Bot,
  Newspaper,
  FlaskConical,
  Layers,
  Users,
  Search,
  BarChart3,
  Settings,
  LifeBuoy,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

// Sidebar doubles as the app's information architecture (see DESIGN.md).
const PRIMARY: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { id: "ai", label: "AI Assistant", icon: Bot },
  { id: "insights", label: "Analyst Insights", icon: Newspaper },
  { id: "lab", label: "Strategy Lab", icon: FlaskConical },
  { id: "accounts", label: "Account Aggregation", icon: Layers },
  { id: "community", label: "Traders Community", icon: Users },
  { id: "research", label: "Research", icon: Search },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

const SECONDARY: NavItem[] = [
  { id: "settings", label: "Settings", icon: Settings },
  { id: "support", label: "Support", icon: LifeBuoy },
];

interface SidebarProps {
  active: string;
  onSelect: (id: string) => void;
}

export function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <aside className="flex h-full w-[232px] shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-accent-gradient">
          <TrendingUp className="size-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight">Levant AI</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {PRIMARY.map((item) => (
          <NavButton key={item.id} item={item} active={active === item.id} onSelect={onSelect} />
        ))}
        <div className="my-3 h-px bg-border" />
        {SECONDARY.map((item) => (
          <NavButton key={item.id} item={item} active={active === item.id} onSelect={onSelect} />
        ))}
      </nav>

      <div className="m-3 rounded-card border border-border bg-surface p-4">
        <p className="text-sm font-semibold">Join Our Community</p>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          Connect with fellow traders and share insights
        </p>
        <button className="mt-3 h-9 w-full rounded-ctl bg-accent-gradient text-sm font-medium text-white transition hover:brightness-110">
          Join Now
        </button>
      </div>
    </aside>
  );
}

function NavButton({
  item,
  active,
  onSelect,
}: {
  item: NavItem;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const Icon = item.icon;
  return (
    <button
      onClick={() => onSelect(item.id)}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-ctl px-3 py-2 text-sm transition-colors duration-150",
        active
          ? "bg-accent-gradient font-medium text-white shadow-[0_4px_16px_-8px_var(--accent)]"
          : "text-muted hover:bg-surface-2 hover:text-text",
      )}
    >
      <Icon className={cn("size-[18px]", active ? "text-white" : "text-muted group-hover:text-text")} />
      <span className="truncate">{item.label}</span>
    </button>
  );
}
