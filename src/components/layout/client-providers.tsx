"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/navbar";
import { AuthProvider } from "@/contexts/auth-context";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TooltipProvider>
        <Navbar />
        <main className="pt-16">{children}</main>
      </TooltipProvider>
    </AuthProvider>
  );
}
