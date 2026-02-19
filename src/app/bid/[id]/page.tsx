"use client";

import { useState, useMemo, useRef, useEffect, use } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { BidSidebar } from "@/components/bid-dashboard/bid-sidebar";
import { PwinTracker } from "@/components/bid-dashboard/pwin-tracker";
import { BidStats } from "@/components/bid-dashboard/bid-stats";
import { ComplianceMatrix } from "@/components/bid-dashboard/compliance-matrix";
import { ProposalArea } from "@/components/bid-dashboard/proposal-area";
import { PaywallModal } from "@/components/bid-dashboard/paywall-modal";
import { Badge } from "@/components/ui/badge";
import type { BidWithDetails } from "@/lib/supabase/types";

const pwinBoostMap: Record<string, number> = {
  "past-performance": 25,
  "capability-statement": 20,
  "team-resumes": 10,
  certifications: 10,
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "TBD";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BidDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [bid, setBid] = useState<BidWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const prevScoreRef = useRef(20);

  useEffect(() => {
    fetch(`/api/bids/${id}`)
      .then((r) => r.json())
      .then((data: BidWithDetails) => {
        setBid(data);
        const existing = (data.bid_documents || []).map((d) => d.doc_type);
        setUploadedDocs(existing);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const pwinScore = useMemo(() => {
    if (!bid) return 20;
    const docsInDb = (bid.bid_documents || []).map((d) => d.doc_type);
    const allDocs = Array.from(new Set([...docsInDb, ...uploadedDocs]));
    const bonus = allDocs.reduce((sum, docId) => sum + (pwinBoostMap[docId] || 0), 0);
    return Math.min(20 + bonus, 85);
  }, [bid, uploadedDocs]);

  const handleDocumentUpload = async (docId: string, file: File) => {
    prevScoreRef.current = pwinScore;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("docType", docId);

    const res = await fetch(`/api/bids/${id}/documents`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setUploadedDocs((prev) => (prev.includes(docId) ? prev : [...prev, docId]));
      const updated = await fetch(`/api/bids/${id}`).then((r) => r.json());
      setBid(updated);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-navy" />
      </div>
    );
  }

  if (!bid) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4">
        <p className="text-sm font-medium">Bid not found</p>
        <Link href="/bids" className="text-xs text-navy underline">
          Back to My Bids
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <Link
                href="/bids"
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
                    {bid.solicitation_number || "—"}
                  </span>
                </div>
                <h1 className="text-base font-semibold truncate sm:text-lg">{bid.title}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground">{bid.agency}</span>
                  {bid.due_date && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Due {formatDate(bid.due_date)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <BidSidebar
            bid={bid}
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
                <PwinTracker value={pwinScore} previousValue={prevScoreRef.current} />
              </div>
              <div className="flex-1 w-full">
                <BidStats bid={bid} />
              </div>
            </div>

            <ComplianceMatrix items={bid.compliance_items || []} />

            <ProposalArea
              executiveSummary={bid.executive_summary}
              fullProposal={bid.full_proposal}
              onExportClick={() => setPaywallOpen(true)}
            />
          </motion.div>
        </div>
      </div>

      <PaywallModal open={paywallOpen} onOpenChange={setPaywallOpen} bidId={id} />
    </div>
  );
}
