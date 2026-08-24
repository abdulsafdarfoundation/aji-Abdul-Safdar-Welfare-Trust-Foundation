"use client";

import Link from "next/link";
import { useState } from "react";
import { ExternalLink, LogOut, Menu } from "lucide-react";

import { AdminNav } from "@/components/admin/admin-nav";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { initialsOf } from "@/lib/format";
import type { Profile } from "@/types/database";

/**
 * Sidebar chrome for the dashboard. Client-side only for the mobile drawer and
 * active-link state — all data still arrives from Server Components as
 * `children`.
 */
export function AdminShell({
  profile,
  signOutAction,
  children,
}: {
  profile: Profile;
  signOutAction: () => Promise<void>;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-full">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex h-16 items-center border-b border-sidebar-border px-5">
          <Logo href="/admin" className="text-base text-sidebar-foreground" />
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <AdminNav />
        </div>
        <SidebarFooter profile={profile} signOutAction={signOutAction} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur-md sm:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="size-5" />
                <span className="sr-only">Open dashboard menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground"
            >
              <SheetHeader className="border-b border-sidebar-border">
                <SheetTitle className="text-left">
                  <Logo href="/admin" className="text-base text-sidebar-foreground" />
                </SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-3">
                <AdminNav onNavigate={() => setOpen(false)} />
              </div>
              <SidebarFooter profile={profile} signOutAction={signOutAction} />
            </SheetContent>
          </Sheet>

          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/" target="_blank">
                View site
                <ExternalLink className="size-3.5" aria-hidden />
              </Link>
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarFooter({
  profile,
  signOutAction,
}: {
  profile: Profile;
  signOutAction: () => Promise<void>;
}) {
  return (
    <div className="border-t border-sidebar-border p-3">
      <div className="flex items-center gap-3 rounded-md px-2 py-2">
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground"
        >
          {initialsOf(profile.full_name ?? profile.email)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{profile.full_name ?? profile.email}</p>
          <p className="truncate text-xs text-sidebar-foreground/60 capitalize">
            {profile.role}
          </p>
        </div>
      </div>

      <form action={signOutAction}>
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
        >
          <LogOut className="size-4" aria-hidden />
          Sign out
        </Button>
      </form>
    </div>
  );
}
