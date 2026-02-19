"use client";

import { useState, useEffect } from "react";
import { SectionCard } from "./section-card";

const prefsMeta = [
  { id: "bid_status_updates", label: "Bid status updates", desc: "When your bid status changes" },
  { id: "due_date_reminders", label: "Due date reminders", desc: "Reminders before submission deadlines" },
  { id: "rfp_matches", label: "New RFP matches", desc: "When new opportunities match your profile" },
  { id: "weekly_summary", label: "Weekly summary", desc: "A weekly digest of your bid activity" },
];

export function NotificationsSection() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    bid_status_updates: true,
    due_date_reminders: true,
    rfp_matches: false,
    weekly_summary: false,
  });

  useEffect(() => {
    fetch("/api/user/notifications")
      .then((r) => r.json())
      .then((data) => {
        setEnabled({
          bid_status_updates: data.bid_status_updates ?? true,
          due_date_reminders: data.due_date_reminders ?? true,
          rfp_matches: data.rfp_matches ?? false,
          weekly_summary: data.weekly_summary ?? false,
        });
      })
      .catch(() => {});
  }, []);

  const toggle = async (id: string) => {
    const next = { ...enabled, [id]: !enabled[id] };
    setEnabled(next);
    await fetch("/api/user/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    }).catch(() => {});
  };

  return (
    <SectionCard
      title="Notification Preferences"
      description="Control how and when you receive notifications"
    >
      <div className="space-y-4">
        {prefsMeta.map((pref) => (
          <div key={pref.id} className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium">{pref.label}</p>
              <p className="text-xs text-muted-foreground">{pref.desc}</p>
            </div>
            <button
              onClick={() => toggle(pref.id)}
              className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors ${
                enabled[pref.id] ? "bg-navy" : "bg-gray-200"
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
