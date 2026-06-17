import { type ReactNode } from "react";
import { Badge } from "./Badge";

interface PageHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  demo?: boolean;
  actions?: ReactNode;
}

/** Consistent page header: icon + title, optional "Demo data" badge + actions. */
export function PageHeader({ icon, title, subtitle, demo, actions }: PageHeaderProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <span className="text-accent">{icon}</span>
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{title}</h2>
          {demo && <Badge tone="warn">Demo data</Badge>}
        </div>
        {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
    </div>
  );
}
