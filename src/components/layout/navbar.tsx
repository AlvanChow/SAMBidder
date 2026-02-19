"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, Settings, Shield, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/auth-context";

const navLinks = [
  { href: "/bids", label: "My Bids", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || "?";

  const displayName =
    user?.user_metadata?.full_name || user?.email || "Account";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-light transition-all group-hover:bg-navy/15">
            <Shield className="h-4.5 w-4.5 text-navy fill-navy" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            SAM<span className="text-navy">Bidder</span>
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
                        ? "bg-navy/10 text-navy"
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

          {user && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleSignOut}
                  className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Sign out</TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="ml-1 transition-transform hover:scale-105">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarFallback className="bg-navy-light text-xs font-semibold text-navy">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </TooltipTrigger>
            <TooltipContent>{displayName}</TooltipContent>
          </Tooltip>
        </nav>
      </div>
    </header>
  );
}
