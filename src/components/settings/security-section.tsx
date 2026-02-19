import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionCard } from "./section-card";

export function SecuritySection() {
  return (
    <SectionCard
      title="Security"
      description="Manage your account security settings"
    >
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Current Password
          </label>
          <Input type="password" className="bg-secondary h-9" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            New Password
          </label>
          <Input type="password" className="bg-secondary h-9" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Confirm New Password
          </label>
          <Input type="password" className="bg-secondary h-9" />
        </div>
        <div className="flex justify-end">
          <Button className="bg-neon-blue text-white hover:bg-neon-blue-dim h-9 text-sm">
            Update Password
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}
