import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "success" | "danger" | "neutral" | "accent" | "info" | "warn";

const tones: Record<Tone, string> = {
  success: "bg-[var(--pos-bg)] text-pos",
  danger: "bg-[var(--neg-bg)] text-neg",
  accent: "bg-[var(--accent-bg)] text-accent",
  info: "bg-[var(--info-bg)] text-info",
  warn: "bg-[oklch(0.83_0.13_80_/_0.14)] text-warn",
  neutral: "bg-surface-3 text-muted",
};

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

/** Pill badge. Status is shown via tinted background, never a side stripe. */
export function Badge({ tone = "neutral", children, icon, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium leading-5",
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
