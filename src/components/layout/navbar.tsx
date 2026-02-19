"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Settings, Zap } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navLinks = [
  { href: "/bids", label: "My Bids", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon-blue/10 transition-all group-hover:bg-neon-blue/20 group-hover:glow-blue">
            <Zap className="h-4.5 w-4.5 text-neon-blue" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            SAM<span className="text-neon-blue">Bidder</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Tooltip key={link.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-neon-blue/10 text-neon-blue"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{link.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="sm:hidden">
                  {link.label}
                </TooltipContent>
              </Tooltip>
            );
          })}

          <div className="ml-2 h-6 w-px bg-border" />

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="ml-2 transition-transform hover:scale-105">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarFallback className="bg-neon-blue/10 text-xs font-semibold text-neon-blue">
                    JD
                  </AvatarFallback>
                </Avatar>
              </button>
            </TooltipTrigger>
            <TooltipContent>John Doe</TooltipContent>
          </Tooltip>
        </nav>
      </div>
    </header>
  );
}
