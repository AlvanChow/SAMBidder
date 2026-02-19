import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary mb-4">
        <Settings className="h-7 w-7 text-muted-foreground" />
      </div>
      <h1 className="text-xl font-semibold">Settings</h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm text-center">
        Account settings, billing, and preferences will be available here.
      </p>
    </div>
  );
}
