"use client";

import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { mockComplianceMatrix } from "@/lib/mock-data";

const statusConfig = {
  compliant: {
    icon: CheckCircle2,
    label: "Compliant",
    className: "text-neon-green bg-neon-green/10",
  },
  partial: {
    icon: AlertTriangle,
    label: "Partial",
    className: "text-amber-400 bg-amber-400/10",
  },
  missing: {
    icon: XCircle,
    label: "Missing",
    className: "text-red-400 bg-red-400/10",
  },
};

export function ComplianceMatrix() {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
        Compliance Matrix
      </h3>
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                ID
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Requirement
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Section
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {mockComplianceMatrix.map((row) => {
              const config = statusConfig[row.status];
              const Icon = config.icon;
              return (
                <tr
                  key={row.id}
                  className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {row.id}
                  </td>
                  <td className="px-4 py-3">{row.requirement}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {row.section}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
                    >
                      <Icon className="h-3 w-3" />
                      {config.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
