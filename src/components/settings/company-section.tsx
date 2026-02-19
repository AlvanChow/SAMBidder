"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SectionCard } from "./section-card";

const SET_ASIDE_OPTIONS = ["8(a)", "HUBZone", "SDVOSB", "WOSB", "Small Business"];

export function CompanySection() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [duns, setDuns] = useState("");
  const [uei, setUei] = useState("");
  const [cageCode, setCageCode] = useState("");
  const [naics, setNaics] = useState("");
  const [setAsides, setSetAsides] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((data) => {
        setCompanyName(data.company_name || "");
        setDuns(data.duns_number || "");
        setUei(data.uei || "");
        setCageCode(data.cage_code || "");
        setNaics(data.primary_naics || "");
        setSetAsides(data.set_aside_qualifications || []);
      })
      .catch(() => {});
  }, []);

  const toggleSetAside = (val: string) => {
    setSetAsides((prev) =>
      prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_name: companyName,
        duns_number: duns,
        uei,
        cage_code: cageCode,
        primary_naics: naics,
        set_aside_qualifications: setAsides,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="bg-gray-50 h-9"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              DUNS Number
            </label>
            <Input value={duns} onChange={(e) => setDuns(e.target.value)} className="bg-gray-50 h-9" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              UEI (SAM.gov)
            </label>
            <Input value={uei} onChange={(e) => setUei(e.target.value)} className="bg-gray-50 h-9" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              CAGE Code
            </label>
            <Input value={cageCode} onChange={(e) => setCageCode(e.target.value)} className="bg-gray-50 h-9" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Primary NAICS
            </label>
            <Input value={naics} onChange={(e) => setNaics(e.target.value)} className="bg-gray-50 h-9" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Set-Aside Qualifications
          </label>
          <div className="flex flex-wrap gap-2 mt-1">
            {SET_ASIDE_OPTIONS.map((cert) => (
              <button
                key={cert}
                type="button"
                onClick={() => toggleSetAside(cert)}
                className="focus:outline-none"
              >
                <Badge
                  variant="outline"
                  className={
                    setAsides.includes(cert)
                      ? "border-emerald-600/20 bg-emerald-50 text-emerald-700 cursor-pointer"
                      : "border-border bg-gray-50 text-muted-foreground cursor-pointer hover:bg-gray-100"
                  }
                >
                  {cert}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-navy text-white hover:bg-navy-dark h-9 text-sm"
        >
          {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </SectionCard>
  );
}
