"use client";

import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { BidSidebar } from "@/components/bid-dashboard/bid-sidebar";
import { PwinTracker } from "@/components/bid-dashboard/pwin-tracker";
import { BidStats } from "@/components/bid-dashboard/bid-stats";
import { ComplianceMatrix } from "@/components/bid-dashboard/compliance-matrix";
import { ProposalArea } from "@/components/bid-dashboard/proposal-area";
import { PaywallModal } from "@/components/bid-dashboard/paywall-modal";
import { Badge } from "@/components/ui/badge";
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
  const prevScoreRef = useRef(20);

  const pwinScore = useMemo(() => {
    const base = 20;
    const bonus = uploadedDocs.reduce(
      (sum, docId) => sum + (pwinBoostMap[docId] || 0),
      0
    );
    return Math.min(base + bonus, 85);
  }, [uploadedDocs]);

  const handleDocumentUpload = (docId: string) => {
    prevScoreRef.current = pwinScore;
    setUploadedDocs((prev) =>
      prev.includes(docId) ? prev : [...prev, docId]
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <Link
                href="/"
                className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    variant="outline"
                    className="border-blue-600/20 bg-blue-50 text-blue-700 text-[10px] h-5"
                  >
                    Active Bid
                  </Badge>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {mockRfpDetails.solicitationNumber}
                  </span>
                </div>
                <h1 className="text-base font-semibold truncate sm:text-lg">
                  {mockRfpDetails.title}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {mockRfpDetails.agency}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Due {mockRfpDetails.dueDate}
                  </div>
                </div>
              </div>
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 min-w-0 space-y-6"
          >
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="shrink-0 rounded-xl border border-border bg-white p-6 shadow-sm">
                <PwinTracker
                  value={pwinScore}
                  previousValue={prevScoreRef.current}
                />
              </div>
              <div className="flex-1 w-full">
                <BidStats />
              </div>
            </div>

            <ComplianceMatrix />

            <ProposalArea onExportClick={() => setPaywallOpen(true)} />
          </motion.div>
        </div>
      </div>

      <PaywallModal open={paywallOpen} onOpenChange={setPaywallOpen} />
    </div>
  );
}
