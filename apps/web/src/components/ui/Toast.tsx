import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/cn";

type ToastTone = "error" | "success" | "info";
interface Toast {
  id: number;
  tone: ToastTone;
  title: string;
  message?: string;
}

interface ToastApi {
  push: (t: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

const toneStyles: Record<ToastTone, { ring: string; icon: ReactNode }> = {
  error: {
    ring: "border-[color:var(--neg)]/40 bg-[var(--neg-bg)]",
    icon: <AlertCircle className="size-5 text-neg" />,
  },
  success: {
    ring: "border-[color:var(--pos)]/40 bg-[var(--pos-bg)]",
    icon: <CheckCircle2 className="size-5 text-pos" />,
  },
  info: {
    ring: "border-[color:var(--info)]/40 bg-[var(--info-bg)]",
    icon: <Info className="size-5 text-info" />,
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  let seq = 0;

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = ++seq + Date.now();
    setToasts((prev) => [...prev, { ...t, id }]);
    window.setTimeout(() => remove(id), 6000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remove]);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed right-5 top-5 z-50 flex w-[360px] max-w-[calc(100vw-2.5rem)] flex-col gap-3">
        {toasts.map((t) => {
          const s = toneStyles[t.tone];
          return (
            <div
              key={t.id}
              className={cn(
                "pointer-events-auto flex animate-toast-in items-start gap-3 rounded-card border px-4 py-3 shadow-float backdrop-blur-sm",
                s.ring,
              )}
            >
              <div className="mt-0.5 shrink-0">{s.icon}</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text">{t.title}</p>
                {t.message && <p className="mt-0.5 text-[13px] text-muted">{t.message}</p>}
              </div>
              <button
                onClick={() => remove(t.id)}
                className="rounded-md p-1 text-muted transition-colors hover:bg-surface-2 hover:text-text"
                aria-label="Dismiss"
              >
                <X className="size-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
