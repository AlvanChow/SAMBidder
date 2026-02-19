"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "AI-Powered Drafting",
    description:
      "Upload your RFP and receive a compliant proposal draft in under 5 minutes.",
    color: "#1a73c7",
    bgColor: "#e8f2fc",
  },
  {
    icon: ShieldCheck,
    title: "Compliance Guaranteed",
    description:
      "Every FAR, DFAR, and agency-specific clause is mapped and addressed automatically.",
    color: "#2e8b57",
    bgColor: "#eaf5f0",
  },
  {
    icon: BarChart3,
    title: "pWin Optimization",
    description:
      "Real-time win probability scoring helps you strengthen weak sections before submission.",
    color: "#d4880f",
    bgColor: "#fef7e8",
  },
];

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
      {features.map((feature, i) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
          className="group rounded-xl border border-border bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg mb-3"
            style={{ backgroundColor: feature.bgColor }}
          >
            <feature.icon
              className="h-4.5 w-4.5"
              style={{ color: feature.color }}
            />
          </div>
          <h3 className="text-sm font-semibold mb-1 text-foreground">{feature.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
