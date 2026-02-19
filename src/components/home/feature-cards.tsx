"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "AI-Powered Drafting",
    description:
      "Upload your RFP and receive a compliant proposal draft in under 5 minutes.",
    color: "#00B4FF",
  },
  {
    icon: ShieldCheck,
    title: "Compliance Guaranteed",
    description:
      "Every FAR, DFAR, and agency-specific clause is mapped and addressed automatically.",
    color: "#00E68C",
  },
  {
    icon: BarChart3,
    title: "pWin Optimization",
    description:
      "Real-time win probability scoring helps you strengthen weak sections before submission.",
    color: "#00B4FF",
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
          className="group rounded-xl border border-border bg-card/50 p-5 transition-all hover:border-border/80 hover:bg-card"
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg mb-3"
            style={{ backgroundColor: `${feature.color}10` }}
          >
            <feature.icon
              className="h-4.5 w-4.5"
              style={{ color: feature.color }}
            />
          </div>
          <h3 className="text-sm font-semibold mb-1">{feature.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
