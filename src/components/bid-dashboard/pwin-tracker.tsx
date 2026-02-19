"use client";

import { motion } from "framer-motion";

interface PwinTrackerProps {
  value: number;
}

export function PwinTracker({ value }: PwinTrackerProps) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const color = value >= 70 ? "#00E68C" : value >= 40 ? "#00B4FF" : "#F59E0B";
  const label = value >= 70 ? "Strong" : value >= 40 ? "Moderate" : "Low";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-secondary"
          />
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            transform="rotate(-90 100 100)"
            style={{
              filter: `drop-shadow(0 0 8px ${color}40)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={value}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-bold tabular-nums"
            style={{ color }}
          >
            {value}%
          </motion.span>
          <span className="text-xs font-medium text-muted-foreground mt-0.5">
            pWin Score
          </span>
        </div>
      </div>
      <div
        className="flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
        style={{
          backgroundColor: `${color}15`,
          color,
        }}
      >
        <div
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        {label} Win Probability
      </div>
    </div>
  );
}
