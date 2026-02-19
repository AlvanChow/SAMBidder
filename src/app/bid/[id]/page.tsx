"use client";

import { useState, useMemo } from "react";
import { BidSidebar } from "@/components/bid-dashboard/bid-sidebar";
import { PwinTracker } from "@/components/bid-dashboard/pwin-tracker";
import { ComplianceMatrix } from "@/components/bid-dashboard/compliance-matrix";
import { ProposalArea } from "@/components/bid-dashboard/proposal-area";
import { PaywallModal } from "@/components/bid-dashboard/paywall-modal";
import { mockRfpDetails } from "@/lib/mock-data";

const pwinBoostMap: Record<string, number> = {
  "past-performance": 25,
  "capability-statement": 20,
  "team-resumes": 10,
  "certifications": 10,
};

export default function BidDashboardPage() {
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [paywallOpen, setPaywallOpen] = useState(false);

  const pwinScore = useMemo(() => {
    const base = 20;
    const bonus = uploadedDocs.reduce(
      (sum, docId) => sum + (pwinBoostMap[docId] || 0),
      0
    );
    return Math.min(base + bonus, 85);
  }, [uploadedDocs]);

  const handleDocumentUpload = (docId: string) => {
    setUploadedDocs((prev) =>
      prev.includes(docId) ? prev : [...prev, docId]
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-neon-blue mb-1">
                Active Bid
              </p>
              <h1 className="text-lg font-semibold">
                {mockRfpDetails.title}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                {mockRfpDetails.solicitationNumber}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <BidSidebar
            onDocumentUpload={handleDocumentUpload}
            uploadedDocs={uploadedDocs}
          />

          <div className="flex-1 min-w-0 space-y-8">
            <div className="flex justify-center rounded-xl border border-border bg-card p-6">
              <PwinTracker value={pwinScore} />
            </div>

            <ComplianceMatrix />

            <ProposalArea onExportClick={() => setPaywallOpen(true)} />
          </div>
        </div>
      </div>

      <PaywallModal open={paywallOpen} onOpenChange={setPaywallOpen} />
    </div>
  );
}
