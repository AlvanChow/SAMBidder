"use client";

import { Lock, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const blurredPlaceholder = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

interface ProposalAreaProps {
  executiveSummary: string;
  fullProposal: string;
  onExportClick: () => void;
}

export function ProposalArea({ executiveSummary, fullProposal, onExportClick }: ProposalAreaProps) {
  const isGenerating = !executiveSummary && !fullProposal;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
          Executive Summary
        </h3>
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          {isGenerating ? (
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p className="text-sm">Generating executive summary...</p>
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
              {executiveSummary || "Executive summary not yet generated."}
            </p>
          )}
        </div>
      </div>

      <div className="relative">
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
          Full Proposal Draft
        </h3>
        <div className="relative rounded-xl border border-border bg-white overflow-hidden shadow-sm">
          <div className="p-5 blur-[6px] select-none pointer-events-none">
            <div className="space-y-4">
              <h4 className="text-base font-semibold">1.0 Technical Approach</h4>
              <p className="text-sm leading-relaxed text-foreground/80">{blurredPlaceholder}</p>
              <h4 className="text-base font-semibold">2.0 Management Approach</h4>
              <p className="text-sm leading-relaxed text-foreground/80">{blurredPlaceholder}</p>
              <h4 className="text-base font-semibold">3.0 Staffing Plan</h4>
              <p className="text-sm leading-relaxed text-foreground/80">{blurredPlaceholder}</p>
            </div>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 max-w-xs text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-light">
                <Lock className="h-6 w-6 text-navy" />
              </div>
              <div>
                <p className="text-base font-semibold">Full Proposal Locked</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Unlock the complete, compliant proposal with all sections ready for submission.
                </p>
              </div>
              <Button
                onClick={onExportClick}
                className="gap-2 bg-navy text-white hover:bg-navy-dark h-10 px-5"
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
