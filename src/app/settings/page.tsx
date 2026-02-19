"use client";

import { useState } from "react";
import { User, Building2, CreditCard, Bell, Shield } from "lucide-react";
import { ProfileSection } from "@/components/settings/profile-section";
import { CompanySection } from "@/components/settings/company-section";
import { BillingSection } from "@/components/settings/billing-section";
import { NotificationsSection } from "@/components/settings/notifications-section";
import { SecuritySection } from "@/components/settings/security-section";

const navItems = [
  { id: "profile", label: "Profile", icon: User },
  { id: "company", label: "Company", icon: Building2 },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
];

const sections: Record<string, React.ComponentType> = {
  profile: ProfileSection,
  company: CompanySection,
  billing: BillingSection,
  notifications: NotificationsSection,
  security: SecuritySection,
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const ActiveSection = sections[activeTab];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account, company details, and preferences
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <nav className="sm:w-52 shrink-0">
          <div className="flex sm:flex-col gap-1 overflow-x-auto pb-2 sm:pb-0">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-neon-blue/10 text-neon-blue"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="flex-1 min-w-0">
          <ActiveSection />
        </div>
      </div>
    </div>
  );
}
