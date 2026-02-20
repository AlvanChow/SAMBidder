"use client";

import { useState, useMemo, useRef, useEffect, use } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Clock, Loader2, X } from "lucide-react";
import Link from "next/link";
import { BidSidebar } from "@/components/bid-dashboard/bid-sidebar";
import { PwinTracker } from "@/components/bid-dashboard/pwin-tracker";
import { BidStats } from "@/components/bid-dashboard/bid-stats";
import { ComplianceMatrix } from "@/components/bid-dashboard/compliance-matrix";
import { ProposalArea } from "@/components/bid-dashboard/proposal-area";
import { PaywallModal } from "@/components/bid-dashboard/paywall-modal";
import { Badge } from "@/components/ui/badge";
import type { BidWithDetails } from "@/lib/supabase/types";

const POLL_INTERVAL_MS = 4000;
const POLL_TIMEOUT_MS = 90000;

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
  const searchParams = useSearchParams();
  const paymentSuccess = searchParams.get("payment") === "success";

  const [bid, setBid] = useState<BidWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [showPaymentBanner, setShowPaymentBanner] = useState(paymentSuccess);
  const prevScoreRef = useRef(20);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchBid = async (): Promise<BidWithDetails | null> => {
    const r = await fetch(`/api/bids/${id}`);
    if (!r.ok) throw new Error(`Failed to load bid (${r.status})`);
    return r.json();
  };

  const stopPolling = () => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    fetchBid()
      .then((data) => {
        if (!data) return;
        setBid(data);
        const existing = (data.bid_documents || []).map((d) => d.doc_type);
        setUploadedDocs(existing);
        setLoading(false);

        // Start polling if proposal hasn't been generated yet
        if (!data.executive_summary) {
          pollTimerRef.current = setInterval(async () => {
            try {
              const updated = await fetchBid();
              if (!updated) return;
              setBid(updated);
              if (updated.executive_summary) {
                stopPolling();
              }
            } catch {
              // keep polling silently on transient errors
            }
          }, POLL_INTERVAL_MS);

          // Hard stop after 90 seconds
          pollTimeoutRef.current = setTimeout(stopPolling, POLL_TIMEOUT_MS);
        }
      })
      .catch((e: unknown) => {
        setPageError(e instanceof Error ? e.message : "Failed to load bid");
        setLoading(false);
      });

    return () => stopPolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // On payment success, immediately refetch to get updated status
  useEffect(() => {
    if (!paymentSuccess) return;
    fetchBid()
      .then((data) => {
        if (data) setBid(data);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentSuccess]);

  const pwinScore = useMemo(() => {
    if (!bid) return 20;
    const docsInDb = (bid.bid_documents || []).map((d) => d.doc_type);
    const allDocs = Array.from(new Set([...docsInDb, ...uploadedDocs]));
    const bonus = allDocs.reduce((sum, docId) => sum + (pwinBoostMap[docId] || 0), 0);
    return Math.min(20 + bonus, 85);
  }, [bid, uploadedDocs]);

  const handleDocumentUpload = async (docId: string, file: File) => {
    prevScoreRef.current = pwinScore;
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("docType", docId);

    try {
      const res = await fetch(`/api/bids/${id}/documents`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setUploadError((errData as { error?: string }).error || "Upload failed. Please try again.");
        return;
      }

      setUploadedDocs((prev) => (prev.includes(docId) ? prev : [...prev, docId]));
      const updated = await fetch(`/api/bids/${id}`).then((r) => r.json()).catch(() => null);
      if (updated) setBid(updated);
    } catch {
      setUploadError("Network error. Please check your connection and try again.");
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
        <p className="text-sm font-medium">{pageError ?? "Bid not found"}</p>
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
        {showPaymentBanner && (
          <div className="mb-4 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-emerald-800">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Payment successful! Your full proposal is now unlocked.
            </div>
            <button
              onClick={() => setShowPaymentBanner(false)}
              className="text-emerald-600 hover:text-emerald-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {uploadError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {uploadError}
          </div>
        )}
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
              bidStatus={bid.status}
              onExportClick={() => setPaywallOpen(true)}
            />
          </motion.div>
        </div>
      </div>

      <PaywallModal open={paywallOpen} onOpenChange={setPaywallOpen} bidId={id} />
    </div>
  );
}
