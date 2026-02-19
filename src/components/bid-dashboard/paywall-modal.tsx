"use client";

import { useState } from "react";
import {
  CheckCircle2,
  FileDown,
  Shield,
  Zap,
  CreditCard,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface PaywallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bidId: string;
}

const features = [
  { icon: FileDown, text: "Complete proposal in .docx format" },
  { icon: Shield, text: "Full compliance matrix & FAR citations" },
  { icon: Zap, text: "Executive summary, technical & management volumes" },
];

export function PaywallModal({ open, onOpenChange, bidId }: PaywallModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bidId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to start checkout.");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border-border p-0 overflow-hidden">
        <div className="bg-gradient-to-b from-navy-light to-transparent px-6 pt-6 pb-4">
          <DialogHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy/10 mb-3">
              <Zap className="h-6 w-6 text-navy" />
            </div>
            <DialogTitle className="text-xl">
              Unlock Your Full Proposal
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
              Download the complete, submission-ready proposal with all
              compliance requirements addressed.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 space-y-5">
          <div className="space-y-3">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-success-light">
                  <feature.icon className="h-4 w-4 text-success" />
                </div>
                <span className="text-sm">{feature.text}</span>
              </motion.div>
            ))}
          </div>

          <Separator />

          <div className="rounded-xl border border-border bg-gray-50 p-4">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-sm text-muted-foreground">One-time payment</p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-3xl font-bold">$100</span>
                  <span className="text-sm text-muted-foreground">/ bid</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                {["No subscription", "Pay per bid"].map((text) => (
                  <div
                    key={text}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground"
                  >
                    <CheckCircle2 className="h-3 w-3 text-success" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}
          <Button
            className="w-full h-11 gap-2 bg-navy text-white hover:bg-navy-dark font-medium"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="h-4 w-4" />
            )}
            {loading ? "Redirecting to Stripe..." : "Checkout with Stripe"}
          </Button>

          <p className="text-center text-[11px] text-muted-foreground">
            Secured by Stripe. 30-day money-back guarantee.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
