import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-ctl font-medium " +
  "transition-[background,box-shadow,transform] duration-150 ease-out-quint " +
  "active:translate-y-px focus-visible:ring-focus disabled:opacity-50 disabled:pointer-events-none " +
  "whitespace-nowrap select-none";

const variants: Record<Variant, string> = {
  primary: "bg-accent-gradient text-white shadow-[0_4px_16px_-6px_var(--accent)] hover:brightness-110",
  secondary: "bg-surface-2 text-text border border-border hover:border-border-strong hover:bg-surface-3",
  ghost: "text-muted hover:text-text hover:bg-surface-2",
  danger: "bg-[var(--neg-bg)] text-neg border border-[color:var(--neg)]/30 hover:brightness-110",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-9 px-4 text-sm",
};

export function Button({
  variant = "secondary",
  size = "md",
  icon,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {icon}
      {children}
    </button>
  );
}
