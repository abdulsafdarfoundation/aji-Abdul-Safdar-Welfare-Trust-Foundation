import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";
import { DemoBanner } from "@/components/demo-banner";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Staff sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : "/admin";

  return (
    <>
      <DemoBanner />
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-6 text-center">
            <Logo href="/" className="justify-center" />
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">Staff sign in</h1>
              <p className="text-sm text-muted-foreground">
                For the donation dashboard. Donors do not need an account.
              </p>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-xs">
            {isSupabaseConfigured ? (
              <LoginForm next={next} />
            ) : (
              <div className="space-y-4 text-center text-sm">
                <p className="text-muted-foreground">
                  Sign-in is disabled while the app runs on sample data. The dashboard is
                  open without a password.
                </p>
                <Button asChild className="w-full">
                  <Link href="/admin">Open the dashboard</Link>
                </Button>
              </div>
            )}
          </div>

          <Button asChild variant="ghost" className="w-full">
            <Link href="/">
              <ArrowLeft className="size-4" aria-hidden />
              Back to the site
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
