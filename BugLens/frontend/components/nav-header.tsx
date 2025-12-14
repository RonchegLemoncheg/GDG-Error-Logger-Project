"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bug, BarChart3, Home, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function NavHeader() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/errors", label: "Errors", icon: Bug },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center gap-2 font-semibold">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg ">
              <img src="/logoo.png" alt="logo" />
            </div>
            <span className="text-lg">BugLens</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 transition-colors hover:text-foreground/80",
                    pathname === link.href
                      ? "text-foreground"
                      : "text-foreground/60"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2">
          <button className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
