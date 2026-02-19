"use client";

import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { mockComplianceMatrix } from "@/lib/mock-data";

const statusConfig = {
  compliant: {
    icon: CheckCircle2,
    label: "Compliant",
    className: "text-emerald-700 bg-emerald-50",
  },
  partial: {
    icon: AlertTriangle,
    label: "Partial",
    className: "text-amber-700 bg-amber-50",
  },
  missing: {
    icon: XCircle,
    label: "Missing",
    className: "text-red-700 bg-red-50",
  },
};

export function ComplianceMatrix() {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
        Compliance Matrix
      </h3>
      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-gray-50">
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
                  className="border-b border-border/50 last:border-0 hover:bg-gray-50/50 transition-colors"
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
