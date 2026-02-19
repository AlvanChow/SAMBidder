import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SectionCard } from "./section-card";

export function CompanySection() {
  return (
    <SectionCard
      title="Company Details"
      description="Information used in your proposal generation"
    >
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Company Name
          </label>
          <Input
            defaultValue="Acme Federal Solutions, LLC"
            className="bg-gray-50 h-9"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              DUNS Number
            </label>
            <Input defaultValue="078432567" className="bg-gray-50 h-9" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              UEI (SAM.gov)
            </label>
            <Input defaultValue="J8KZNM4XHCL3" className="bg-gray-50 h-9" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              CAGE Code
            </label>
            <Input defaultValue="5RKJ7" className="bg-gray-50 h-9" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Primary NAICS
            </label>
            <Input defaultValue="541512" className="bg-gray-50 h-9" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Set-Aside Qualifications
          </label>
          <div className="flex flex-wrap gap-2 mt-1">
            {["8(a)", "HUBZone", "SDVOSB", "WOSB"].map((cert) => (
              <Badge
                key={cert}
                variant="outline"
                className="border-emerald-600/20 bg-emerald-50 text-emerald-700"
              >
                {cert}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button className="bg-navy text-white hover:bg-navy-dark h-9 text-sm">
          Save Changes
        </Button>
      </div>
    </SectionCard>
  );
}
