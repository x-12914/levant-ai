import { type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface AppShellProps {
  active: string;
  onSelect: (id: string) => void;
  children: ReactNode;
}

export function AppShell({ active, onSelect, children }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-bg text-text">
      <Sidebar active={active} onSelect={onSelect} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
