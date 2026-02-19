"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface PwinTrackerProps {
  value: number;
  previousValue?: number;
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1.2,
      ease: "easeOut",
    });
    const unsubscribe = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, motionValue, rounded]);

  return <>{display}</>;
}

export function PwinTracker({ value, previousValue = 20 }: PwinTrackerProps) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const color = value >= 70 ? "#00E68C" : value >= 40 ? "#00B4FF" : "#F59E0B";
  const label = value >= 70 ? "Strong" : value >= 40 ? "Moderate" : "Low";
  const delta = value - previousValue;
  const TrendIcon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-secondary"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeDasharray="4 8"
            className="text-border opacity-50"
            transform="rotate(-90 100 100)"
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
              filter: `drop-shadow(0 0 10px ${color}50)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-4xl font-bold tabular-nums"
            style={{ color }}
          >
            <AnimatedNumber value={value} />%
          </span>
          <span className="text-[11px] font-medium text-muted-foreground mt-1">
            pWin Score
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
          style={{
            backgroundColor: `${color}12`,
            color,
          }}
        >
          <div
            className="h-1.5 w-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: color }}
          />
          {label} Win Probability
        </div>

        {delta !== 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium ${
              delta > 0
                ? "bg-neon-green/10 text-neon-green"
                : "bg-red-400/10 text-red-400"
            }`}
          >
            <TrendIcon className="h-3 w-3" />
            {delta > 0 ? "+" : ""}
            {delta}%
          </motion.div>
        )}
      </div>
    </div>
  );
}
