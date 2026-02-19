"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BidCard } from "@/components/bids/bid-card";
import { mockBids, bidStatusConfig } from "@/lib/mock-bids";
import type { BidStatus } from "@/lib/mock-bids";

const filterOptions: { value: BidStatus | "all"; label: string }[] = [
  { value: "all", label: "All Bids" },
  { value: "draft", label: "Drafts" },
  { value: "in_review", label: "In Review" },
  { value: "submitted", label: "Submitted" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

export default function BidsPage() {
  const [filter, setFilter] = useState<BidStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = mockBids.filter((bid) => {
    const matchesFilter = filter === "all" || bid.status === filter;
    const matchesSearch =
      search === "" ||
      bid.title.toLowerCase().includes(search.toLowerCase()) ||
      bid.solicitationNumber.toLowerCase().includes(search.toLowerCase()) ||
      bid.agency.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusCounts = mockBids.reduce(
    (acc, bid) => {
      acc[bid.status] = (acc[bid.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Bids</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mockBids.length} total bids across your portfolio
          </p>
        </div>
        <Link href="/">
          <Button className="gap-2 bg-brand text-white hover:bg-brand-dark h-9 text-sm">
            <Plus className="h-4 w-4" />
            New Bid
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {(["won", "submitted", "in_review", "draft", "lost"] as BidStatus[]).map(
          (status) => {
            const config = bidStatusConfig[status];
            return (
              <button
                key={status}
                onClick={() => setFilter(filter === status ? "all" : status)}
                className={`rounded-xl border p-3 text-center transition-all shadow-sm ${
                  filter === status
                    ? "border-brand/40 bg-brand-light"
                    : "border-border bg-white hover:bg-gray-50"
                }`}
              >
                <p className="text-xl font-bold tabular-nums">
                  {statusCounts[status] || 0}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {config.label}
                </p>
              </button>
            );
          }
        )}
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search bids by title, solicitation, or agency..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-10 bg-white border-border"
          />
        </div>
        <div className="flex gap-1">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`hidden sm:block rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                filter === opt.value
                  ? "bg-brand/10 text-brand"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((bid, i) => (
            <BidCard key={bid.id} bid={bid} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">No bids found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
