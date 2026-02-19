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
          <Input type="password" className="bg-gray-50 h-9" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            New Password
          </label>
          <Input type="password" className="bg-gray-50 h-9" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Confirm New Password
          </label>
          <Input type="password" className="bg-gray-50 h-9" />
        </div>
        <div className="flex justify-end">
          <Button className="bg-brand text-white hover:bg-brand-dark h-9 text-sm">
            Update Password
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}
