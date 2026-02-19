"use client";

import { motion } from "framer-motion";
import { Shield, Clock, FileCheck } from "lucide-react";

const stats = [
  { icon: FileCheck, value: "2,400+", label: "Proposals Generated" },
  { icon: Clock, value: "< 5 min", label: "Average Draft Time" },
  { icon: Shield, value: "98.7%", label: "Compliance Score" },
];

export function TrustBar() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="flex flex-wrap items-center justify-center gap-6 sm:gap-10"
    >
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-light">
            <stat.icon className="h-4 w-4 text-navy" />
          </div>
          <div>
            <p className="text-sm font-semibold tabular-nums text-foreground">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
