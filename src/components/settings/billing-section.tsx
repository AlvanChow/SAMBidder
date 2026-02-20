"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionCard } from "./section-card";

interface Payment {
  id: string;
  title: string;
  paid_at: string;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function truncate(str: string, max = 40): string {
  return str.length > max ? str.slice(0, max) + "…" : str;
}

export function BillingSection() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/payments")
      .then((r) => r.json())
      .then((data) => {
        setPayments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <SectionCard
        title="Current Plan"
        description="Your billing and subscription details"
      >
        <div className="flex items-center justify-between rounded-xl border border-border bg-gray-50 p-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">Pay-Per-Bid</p>
              <Badge
                variant="outline"
                className="border-emerald-600/20 bg-emerald-50 text-emerald-700 text-[10px]"
              >
                Active
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              $100 per proposal export
            </p>
          </div>
          <p className="text-2xl font-bold">$100</p>
        </div>
      </SectionCard>

      <SectionCard
        title="Payment History"
        description="Your recent proposal export transactions"
      >
        {loading ? (
          <div className="flex items-center gap-2 py-4 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading payment history…</span>
          </div>
        ) : payments.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">
            No payments yet. Export a proposal to get started.
          </p>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <p className="text-sm">
                    Proposal Export — {truncate(payment.title)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(payment.paid_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium tabular-nums">
                    $100.00
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
