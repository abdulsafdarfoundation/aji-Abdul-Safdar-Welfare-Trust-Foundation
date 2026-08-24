import type { Metadata } from "next";

import { signOut } from "@/app/actions/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { DemoBanner } from "@/components/demo-banner";
import { requireStaff } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · Dashboard" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // Every admin route is gated here rather than in the proxy, so authorization
  // is decided by a verified session against the database, not a cookie.
  const profile = await requireStaff();

  return (
    <>
      <DemoBanner />
      <AdminShell profile={profile} signOutAction={signOut}>
        {children}
      </AdminShell>
    </>
  );
}
