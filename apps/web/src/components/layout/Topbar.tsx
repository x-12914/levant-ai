import { Bell, ChevronDown, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "@/lib/useTheme";
import { currentUser } from "@/data/mock";

export function Topbar() {
  const { theme, toggle } = useTheme();

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-bg px-6">
      <h1 className="text-[15px] font-medium">
        Hello, <span className="font-semibold">{currentUser.name}</span>
      </h1>

      <div className="relative ml-2 hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
        <input
          type="search"
          placeholder="Search assets, traders, strategies"
          className="h-9 w-full rounded-ctl border border-border bg-surface pl-9 pr-3 text-sm text-text placeholder:text-faint focus-visible:ring-focus"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <IconBtn label="Toggle theme" onClick={toggle}>
          {theme === "dark" ? <Moon className="size-[18px]" /> : <Sun className="size-[18px]" />}
        </IconBtn>

        <IconBtn label="Notifications">
          <span className="relative">
            <Bell className="size-[18px]" />
            <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-accent ring-2 ring-bg" />
          </span>
        </IconBtn>

        <button className="ml-1 flex items-center gap-2 rounded-ctl py-1 pl-1 pr-2 transition-colors hover:bg-surface-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-accent-gradient text-sm font-semibold text-white">
            {currentUser.initial}
          </span>
          <span className="hidden text-sm font-medium sm:block">{currentUser.name}</span>
          <ChevronDown className="size-4 text-muted" />
        </button>
      </div>
    </header>
  );
}

function IconBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-ctl text-muted transition-colors hover:bg-surface-2 hover:text-text"
    >
      {children}
    </button>
  );
}
