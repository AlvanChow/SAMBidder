"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/navbar";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <Navbar />
      <main className="pt-16">{children}</main>
    </TooltipProvider>
  );
}
