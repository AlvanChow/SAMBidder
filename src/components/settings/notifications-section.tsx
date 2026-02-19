"use client";

import { useState } from "react";
import { SectionCard } from "./section-card";

const defaultPrefs = [
  {
    id: "bid-status",
    label: "Bid status updates",
    desc: "When your bid status changes",
    defaultEnabled: true,
  },
  {
    id: "due-date",
    label: "Due date reminders",
    desc: "Reminders before submission deadlines",
    defaultEnabled: true,
  },
  {
    id: "rfp-match",
    label: "New RFP matches",
    desc: "When new opportunities match your profile",
    defaultEnabled: false,
  },
  {
    id: "weekly",
    label: "Weekly summary",
    desc: "A weekly digest of your bid activity",
    defaultEnabled: false,
  },
];

export function NotificationsSection() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(defaultPrefs.map((p) => [p.id, p.defaultEnabled]))
  );

  const toggle = (id: string) =>
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <SectionCard
      title="Notification Preferences"
      description="Control how and when you receive notifications"
    >
      <div className="space-y-4">
        {defaultPrefs.map((pref) => (
          <div
            key={pref.id}
            className="flex items-center justify-between py-1"
          >
            <div>
              <p className="text-sm font-medium">{pref.label}</p>
              <p className="text-xs text-muted-foreground">{pref.desc}</p>
            </div>
            <button
              onClick={() => toggle(pref.id)}
              className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors ${
                enabled[pref.id] ? "bg-brand" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white transition-transform shadow-sm ${
                  enabled[pref.id] ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
