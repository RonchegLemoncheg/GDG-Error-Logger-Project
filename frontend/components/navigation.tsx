"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Bug, LayoutDashboard, AlertTriangle, Box } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      href: "/errors",
      label: "Errors",
      icon: AlertTriangle,
    },
    {
      href: "/modules",
      label: "Modules",
      icon: Box,
    },
  ];

  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="BugLens logo"
                className="h-12 w-12 rounded-md object-contain"
              />
              <span className="text-lg font-semibold">BugLens</span>
            </Link>
            <div className="flex items-center gap-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )}
                  >
                    <Icon className="size-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
