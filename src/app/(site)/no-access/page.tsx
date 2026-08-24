import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "No dashboard access",
  robots: { index: false, follow: false },
};

export default function NoAccessPage() {
  return (
    <div className="section flex flex-col items-center py-24 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-warning/15 text-warning">
        <ShieldAlert className="size-8" aria-hidden />
      </span>

      <h1 className="mt-6 text-3xl sm:text-4xl">Your account has no dashboard access</h1>

      <p className="mt-4 max-w-lg text-muted-foreground">
        You are signed in, but your role does not include the admin dashboard. An
        existing administrator can grant access by setting your role to{" "}
        <code>editor</code> or <code>admin</code> in the profiles table.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild variant="outline">
          <Link href="/">Back to the site</Link>
        </Button>
        <form action={signOut}>
          <Button type="submit" variant="ghost">
            Sign out
          </Button>
        </form>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Think this is a mistake? Email{" "}
        <a href={`mailto:${SITE.email}`} className="text-primary underline-offset-4 hover:underline">
          {SITE.email}
        </a>
        .
      </p>
    </div>
  );
}
