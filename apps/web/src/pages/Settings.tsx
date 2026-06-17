import { useState } from "react";
import { Moon, Settings as SettingsIcon, Shield, Sun } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { useTheme } from "@/lib/useTheme";
import { currentUser } from "@/data/mock";
import { cn } from "@/lib/cn";

export function Settings() {
  const { theme, toggle } = useTheme();
  const toast = useToast();
  const [twoFa, setTwoFa] = useState(false);

  return (
    <div className="mx-auto max-w-[760px]">
      <PageHeader icon={<SettingsIcon className="size-5" />} title="Settings" />

      <div className="space-y-5">
        {/* Profile */}
        <Section title="Profile">
          <Row label="Username" value={currentUser.name} />
          <Row label="Plan" value={<Badge tone="accent">Beta</Badge>} />
        </Section>

        {/* Appearance */}
        <Section title="Appearance">
          <div className="flex items-center justify-between px-5 py-3">
            <div>
              <p className="text-sm">Theme</p>
              <p className="text-xs text-muted">Dark is tuned for long market sessions.</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
              onClick={toggle}
            >
              {theme === "dark" ? "Dark" : "Light"}
            </Button>
          </div>
        </Section>

        {/* AI */}
        <Section title="AI">
          <Row
            label="Provider"
            value={<span className="text-muted">Configured server-side · switch via <code className="text-text">AI_PROVIDER</code></span>}
          />
          <p className="px-5 pb-3 text-xs text-muted">
            Running on OpenAI now; flip <code className="text-text">AI_PROVIDER=anthropic</code> on the server to use Claude.
          </p>
        </Section>

        {/* Security */}
        <Section title="Security">
          <div className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-muted" />
              <div>
                <p className="text-sm">Two-factor authentication</p>
                <p className="text-xs text-muted">Required when linking broker accounts.</p>
              </div>
            </div>
            <button
              role="switch"
              aria-checked={twoFa}
              onClick={() => {
                setTwoFa((v) => !v);
                toast.push({ tone: "info", title: twoFa ? "2FA off" : "2FA enabled (demo)" });
              }}
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors",
                twoFa ? "bg-accent" : "bg-surface-3",
              )}
            >
              <span className={cn("absolute top-0.5 size-5 rounded-full bg-white transition-transform", twoFa ? "translate-x-5" : "translate-x-0.5")} />
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-border px-5 py-3 text-sm font-medium">{title}</div>
      <div className="divide-y divide-border">{children}</div>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 text-sm">
      <span className="text-muted">{label}</span>
      <span>{value}</span>
    </div>
  );
}
