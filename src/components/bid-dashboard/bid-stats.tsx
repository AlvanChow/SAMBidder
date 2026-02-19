"use client";

import { motion } from "framer-motion";
import { Clock, FileCheck, AlertTriangle, XCircle } from "lucide-react";
import type { BidWithDetails } from "@/lib/supabase/types";

interface BidStatsProps {
  bid: BidWithDetails;
}

export function BidStats({ bid }: BidStatsProps) {
  const items = bid.compliance_items || [];
  const compliant = items.filter((r) => r.status === "compliant").length;
  const partial = items.filter((r) => r.status === "partial").length;
  const missing = items.filter((r) => r.status === "missing").length;
  const total = items.length;

  const daysLeft = bid.due_date
    ? Math.max(0, Math.ceil((new Date(bid.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const stats = [
    {
      label: "Requirements Met",
      value: total > 0 ? `${compliant}/${total}` : "—",
      icon: FileCheck,
      color: "#1a7a3a",
      bgColor: "#e8f5ed",
    },
    {
      label: "Partial",
      value: total > 0 ? partial.toString() : "—",
      icon: AlertTriangle,
      color: "#c27803",
      bgColor: "#fef7e8",
    },
    {
      label: "Missing",
      value: total > 0 ? missing.toString() : "—",
      icon: XCircle,
      color: "#BF0A30",
      bgColor: "#fde8ec",
    },
    {
      label: "Time to Due",
      value: daysLeft !== null ? `${daysLeft}d` : "—",
      icon: Clock,
      color: "#002868",
      bgColor: "#e6eef8",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="rounded-xl border border-border bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="flex h-6 w-6 items-center justify-center rounded-md"
              style={{ backgroundColor: stat.bgColor }}
            >
              <stat.icon
                className="h-3.5 w-3.5"
                style={{ color: stat.color }}
              />
            </div>
            <span className="text-[11px] text-muted-foreground">
              {stat.label}
            </span>
          </div>
          <p className="text-xl font-bold tabular-nums">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
