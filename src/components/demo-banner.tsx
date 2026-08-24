import { TriangleAlert } from "lucide-react";

import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Renders only while the app is running on fixtures. Its absence is the signal
 * that Supabase is wired up correctly.
 */
export function DemoBanner() {
  if (isSupabaseConfigured) return null;

  return (
    <div className="border-b border-warning/40 bg-warning/15 text-foreground">
      <p className="section flex items-center gap-2 py-2 text-center text-xs sm:text-sm">
        <TriangleAlert className="size-4 shrink-0" aria-hidden />
        <span>
          <strong className="font-semibold">Demo mode.</strong> Showing sample data and
          skipping sign-in. Add your Supabase keys to <code>.env.local</code> to go live —
          see the README.
        </span>
      </p>
    </div>
  );
}
