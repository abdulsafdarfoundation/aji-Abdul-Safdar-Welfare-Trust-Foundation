import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="section flex flex-1 flex-col items-center justify-center py-28 text-center">
        <p className="font-mono text-sm text-muted-foreground">404</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">We could not find that page</h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          The link may be old, or the campaign it pointed to has been closed or is not
          published yet.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/campaigns">Browse campaigns</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
