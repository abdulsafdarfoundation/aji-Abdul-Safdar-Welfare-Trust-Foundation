import type { Metadata } from "next";

import { CauseManager } from "@/components/admin/cause-manager";
import { getCauses } from "@/lib/data/content";

export const metadata: Metadata = { title: "Causes" };

export default async function AdminCausesPage() {
  const causes = await getCauses();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Causes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          New causes appear at the top of the Causes section and on the Donate page.
        </p>
      </header>
      <CauseManager causes={causes} />
    </div>
  );
}
