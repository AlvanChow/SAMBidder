import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionCard } from "./section-card";

const transactions = [
  {
    date: "Feb 15, 2025",
    desc: "Proposal Export - Cloud Migration RFP",
    amount: "$100.00",
  },
  {
    date: "Jan 28, 2025",
    desc: "Proposal Export - Data Analytics RFP",
    amount: "$100.00",
  },
  {
    date: "Dec 20, 2024",
    desc: "Proposal Export - Network Modernization",
    amount: "$100.00",
  },
];

export function BillingSection() {
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
        description="Your recent transactions"
      >
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.date}
              className="flex items-center justify-between py-2"
            >
              <div>
                <p className="text-sm">{tx.desc}</p>
                <p className="text-xs text-muted-foreground">{tx.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium tabular-nums">
                  {tx.amount}
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
