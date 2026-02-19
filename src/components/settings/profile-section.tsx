import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionCard } from "./section-card";

export function ProfileSection() {
  return (
    <SectionCard
      title="Profile Information"
      description="Your personal details used across SAMBidder"
    >
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="h-16 w-16 border-2 border-border">
          <AvatarFallback className="bg-neon-blue/10 text-lg font-semibold text-neon-blue">
            JD
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">John Doe</p>
          <p className="text-xs text-muted-foreground">
            john.doe@acmefederal.com
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            First Name
          </label>
          <Input defaultValue="John" className="bg-secondary h-9" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Last Name
          </label>
          <Input defaultValue="Doe" className="bg-secondary h-9" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Email
          </label>
          <Input
            defaultValue="john.doe@acmefederal.com"
            className="bg-secondary h-9"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Job Title
          </label>
          <Input
            defaultValue="Director of Business Development"
            className="bg-secondary h-9"
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button className="bg-neon-blue text-white hover:bg-neon-blue-dim h-9 text-sm">
          Save Changes
        </Button>
      </div>
    </SectionCard>
  );
}
