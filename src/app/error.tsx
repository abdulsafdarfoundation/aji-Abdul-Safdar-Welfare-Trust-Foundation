"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Swap for your error reporter (Sentry, Axiom, …) when one is added.
    console.error(error);
  }, [error]);

  return (
    <div className="section flex flex-1 flex-col items-center justify-center py-28 text-center">
      <h1 className="text-3xl sm:text-4xl">Something went wrong</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        The page failed to load. This is usually a connection problem with the database —
        trying again often clears it.
      </p>

      {error.digest && (
        <p className="mt-4 font-mono text-xs text-muted-foreground">
          Reference: {error.digest}
        </p>
      )}

      <Button onClick={reset} className="mt-8">
        <RotateCcw className="size-4" aria-hidden />
        Try again
      </Button>
    </div>
  );
}
