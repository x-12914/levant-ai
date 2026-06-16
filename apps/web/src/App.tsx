import { AppShell } from "@/components/layout/AppShell";
import { ToastProvider } from "@/components/ui/Toast";
import { Dashboard } from "@/pages/Dashboard";

export default function App() {
  return (
    <ToastProvider>
      <AppShell>
        <Dashboard />
      </AppShell>
    </ToastProvider>
  );
}
