"use client";

import { Lock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockExecutiveSummary, mockBlurredContent } from "@/lib/mock-data";

interface ProposalAreaProps {
  onExportClick: () => void;
}

export function ProposalArea({ onExportClick }: ProposalAreaProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
          Executive Summary
        </h3>
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
            {mockExecutiveSummary}
          </p>
        </div>
      </div>

      <div className="relative">
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
          Full Proposal Draft
        </h3>
        <div className="relative rounded-xl border border-border bg-white overflow-hidden shadow-sm">
          <div className="p-5 blur-[6px] select-none pointer-events-none">
            <div className="space-y-4">
              <h4 className="text-base font-semibold">
                1.0 Technical Approach
              </h4>
              <p className="text-sm leading-relaxed text-foreground/80">
                {mockBlurredContent}
              </p>
              <h4 className="text-base font-semibold">
                2.0 Management Approach
              </h4>
              <p className="text-sm leading-relaxed text-foreground/80">
                {mockBlurredContent}
              </p>
              <h4 className="text-base font-semibold">
                3.0 Staffing Plan
              </h4>
              <p className="text-sm leading-relaxed text-foreground/80">
                {mockBlurredContent}
              </p>
            </div>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 max-w-xs text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light">
                <Lock className="h-6 w-6 text-brand" />
              </div>
              <div>
                <p className="text-base font-semibold">
                  Full Proposal Locked
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Unlock the complete, compliant proposal with all sections
                  ready for submission.
                </p>
              </div>
              <Button
                onClick={onExportClick}
                className="gap-2 bg-brand text-white hover:bg-brand-dark h-10 px-5"
              >
                <Download className="h-4 w-4" />
                Export to Word
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
