"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionCard } from "./section-card";
import { useAuth } from "@/contexts/auth-context";

export function ProfileSection() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((data) => {
        setFullName(data.full_name || "");
        setJobTitle(data.job_title || "");
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: fullName, job_title: jobTitle }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const initials = fullName
    ? fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : (user?.email?.[0] || "?").toUpperCase();

  const nameParts = fullName.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ");

  return (
    <SectionCard
      title="Profile Information"
      description="Your personal details used across SAMBidder"
    >
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="h-16 w-16 border-2 border-border">
          <AvatarFallback className="bg-navy-light text-lg font-semibold text-navy">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{fullName || "—"}</p>
          <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            First Name
          </label>
          <Input
            value={firstName}
            onChange={(e) =>
              setFullName([e.target.value, lastName].filter(Boolean).join(" "))
            }
            className="bg-gray-50 h-9"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Last Name
          </label>
          <Input
            value={lastName}
            onChange={(e) =>
              setFullName([firstName, e.target.value].filter(Boolean).join(" "))
            }
            className="bg-gray-50 h-9"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Email
          </label>
          <Input
            value={user?.email || ""}
            disabled
            className="bg-gray-50 h-9 opacity-60"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Job Title
          </label>
          <Input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="bg-gray-50 h-9"
          />
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
