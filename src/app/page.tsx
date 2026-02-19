"use client";

import { FileUploader } from "@/components/drop-zone/file-uploader";
import { FeatureCards } from "@/components/home/feature-cards";
import { TrustBar } from "@/components/home/trust-bar";
import { GridBackground } from "@/components/layout/grid-background";

export default function HomePage() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16">
      <GridBackground />

      <div className="relative z-10 flex flex-col items-center gap-10 w-full">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-navy/20 bg-navy-light px-3.5 py-1.5 text-xs font-medium text-navy mb-6">
            <span role="img" aria-label="American flag">🇺🇸</span>
            Proudly Serving American Contractors
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Win More{" "}
            <span className="text-navy">U.S. Government</span>
            <br />
            Contracts
          </h1>
          <p className="mt-4 max-w-lg mx-auto text-base text-muted-foreground leading-relaxed">
            Upload your RFP and get a compliant, AI-generated proposal in
            minutes. Built for American businesses competing for federal contracts.
          </p>
        </div>

        <FileUploader />

        <div className="h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-border to-transparent" />

        <FeatureCards />

        <div className="h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-border to-transparent" />

        <TrustBar />
      </div>
    </div>
  );
}
