"use client";

import { motion } from "framer-motion";
import { Clock, FileCheck, AlertTriangle, XCircle } from "lucide-react";
import { mockComplianceMatrix } from "@/lib/mock-data";

export function BidStats() {
  const compliant = mockComplianceMatrix.filter(
    (r) => r.status === "compliant"
  ).length;
  const partial = mockComplianceMatrix.filter(
    (r) => r.status === "partial"
  ).length;
  const missing = mockComplianceMatrix.filter(
    (r) => r.status === "missing"
  ).length;
  const total = mockComplianceMatrix.length;

  const stats = [
    {
      label: "Requirements Met",
      value: `${compliant}/${total}`,
      icon: FileCheck,
      color: "#1a7a3a",
      bgColor: "#e8f5ed",
    },
    {
      label: "Partial",
      value: partial.toString(),
      icon: AlertTriangle,
      color: "#c27803",
      bgColor: "#fef7e8",
    },
    {
      label: "Missing",
      value: missing.toString(),
      icon: XCircle,
      color: "#BF0A30",
      bgColor: "#fde8ec",
    },
    {
      label: "Time to Due",
      value: "23 days",
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
