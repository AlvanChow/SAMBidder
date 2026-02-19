"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, Calendar, DollarSign, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { MockBid } from "@/lib/mock-bids";
import { bidStatusConfig } from "@/lib/mock-bids";

interface BidCardProps {
  bid: MockBid;
  index: number;
}

export function BidCard({ bid, index }: BidCardProps) {
  const statusConfig = bidStatusConfig[bid.status];
  const pwinColor =
    bid.pwin >= 70 ? "#1a7a3a" : bid.pwin >= 40 ? "#002868" : "#c27803";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/bid/${bid.id}`} className="block group">
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <Badge
                  variant="outline"
                  className={`text-[10px] h-5 ${statusConfig.className}`}
                >
                  {statusConfig.label}
                </Badge>
                <span className="text-[11px] text-muted-foreground font-mono truncate">
                  {bid.solicitationNumber}
                </span>
              </div>
              <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-navy transition-colors">
                {bid.title}
              </h3>
            </div>

            <div className="shrink-0 flex flex-col items-center">
              <div className="relative h-12 w-12">
                <svg viewBox="0 0 36 36" className="h-12 w-12 -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="text-gray-100"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke={pwinColor}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={`${(bid.pwin / 100) * 94.25} 94.25`}
                  />
                </svg>
                <span
                  className="absolute inset-0 flex items-center justify-center text-[10px] font-bold tabular-nums"
                  style={{ color: pwinColor }}
                >
                  {bid.pwin}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Building2 className="h-3 w-3" />
              <span className="truncate max-w-[140px]">{bid.agency}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-3 w-3" />
              <span>{bid.estimatedValue}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              <span>{bid.dueDate}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 w-24 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${bid.complianceScore}%`,
                    backgroundColor:
                      bid.complianceScore >= 90
                        ? "#1a7a3a"
                        : bid.complianceScore >= 70
                        ? "#002868"
                        : "#c27803",
                  }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground tabular-nums">
                {bid.complianceScore}% compliant
              </span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
