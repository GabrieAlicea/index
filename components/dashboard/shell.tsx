"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LogOut, Menu, X } from "lucide-react";

import { signOut } from "@/app/(auth)/actions";
import { Logo } from "@/components/shared/logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { NAV_BY_ROLE, type DashboardRole } from "@/components/dashboard/nav-config";

const ROLE_LABEL: Record<DashboardRole, string> = {
  customer: "Customer",
  mechanic: "Mechanic",
  admin: "Admin",
};

export function DashboardShell({
  role,
  userName,
  children,
}: {
  role: DashboardRole;
  userName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navItems = NAV_BY_ROLE[role];
  const initials = userName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
      {navItems.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== `/dashboard/${role}` && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary/15 text-primary"
                : "text-text-muted hover:bg-white/5 hover:text-text"
            )}
          >
            <item.icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-base">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/8 bg-base-raised lg:flex">
        <div className="flex h-16 items-center border-b border-white/8 px-5">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        {nav}
        <div className="border-t border-white/8 p-3">
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-white/5 hover:text-text"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
          <aside className="glass-strong absolute inset-y-0 left-0 flex w-72 flex-col">
            <div className="flex h-16 items-center justify-between border-b border-white/8 px-5">
              <Link href="/">
                <Logo />
              </Link>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="size-5 text-text-muted" />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass-strong sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/8 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="text-text-muted lg:hidden"
            >
              <Menu className="size-6" />
            </button>
            <Badge variant="primary">{ROLE_LABEL[role]} Dashboard</Badge>
          </div>
          <div className="flex items-center gap-3">
            <button
              aria-label="Notifications"
              className="relative rounded-full p-2 text-text-muted transition-colors hover:bg-white/5 hover:text-text"
            >
              <Bell className="size-5" />
            </button>
            <Avatar className="size-9 border border-white/10">
              <AvatarFallback>{initials || "U"}</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
