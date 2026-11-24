"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useId, useRef, useState, useTransition } from "react";
import { ImagePlus, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { createCause, deleteCause } from "@/app/actions/content";
import { uploadMedia } from "@/components/admin/media-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CAMPAIGN_CATEGORIES, CAUSE_PACKAGES } from "@/lib/constants";
import type { Cause } from "@/types/database";

export function CauseManager({ causes }: { causes: Cause[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const id = useId();
  const busy = status !== null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "");

    if (!get("titleEn").trim()) {
      toast.error("Enter a title");
      return;
    }

    try {
      let uploaded = null;
      if (image) {
        if (!image.type.startsWith("image/")) throw new Error("The cause picture must be a photo.");
        setStatus("Uploading picture…");
        uploaded = await uploadMedia(image, "causes");
      }

      setStatus("Saving…");
      const result = await createCause({
        titleEn: get("titleEn"),
        titleFr: get("titleFr"),
        descriptionEn: get("descriptionEn"),
        descriptionFr: get("descriptionFr"),
        categoryEn: get("categoryEn"),
        categoryFr: get("categoryFr"),
        popular: f.get("popular") === "on",
        image: uploaded,
      });
      if (!result.ok) throw new Error(result.error);

      toast.success("Cause added to the website");
      formRef.current?.reset();
      setImage(null);
      startTransition(() => router.refresh());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setStatus(null);
    }
  }

  return (
    <div className="space-y-8">
      <form ref={formRef} onSubmit={onSubmit} className="space-y-4 rounded-xl border bg-card p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title (English)" name="titleEn" required />
          <Field label="Title (French) — optional" name="titleFr" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor={`${id}-de`}>Description (English)</Label>
            <Textarea id={`${id}-de`} name="descriptionEn" rows={3} maxLength={2000} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${id}-df`}>Description (French) — optional</Label>
            <Textarea id={`${id}-df`} name="descriptionFr" rows={3} maxLength={2000} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category (English)" name="categoryEn" list={`${id}-cats`} />
          <Field label="Category (French) — optional" name="categoryFr" />
          <datalist id={`${id}-cats`}>
            {CAMPAIGN_CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${id}-img`}>Picture</Label>
          <label
            htmlFor={`${id}-img`}
            className="flex min-h-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed p-4 text-center text-sm text-muted-foreground hover:bg-muted/50"
          >
            <ImagePlus className="size-6" aria-hidden />
            {image ? image.name : "Tap to choose a photo"}
          </label>
          <input
            id={`${id}-img`}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          />
        </div>

        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" name="popular" className="size-5 accent-amber-600" />
          Show “Urgent Need” badge
        </label>

        <Button type="submit" className="h-11 w-full sm:w-auto" disabled={busy}>
          {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Plus className="size-4" aria-hidden />}
          {status ?? "Add cause"}
        </Button>
      </form>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Added causes ({causes.length}) — shown first on the site
        </h2>
        {causes.length === 0 ? (
          <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No added causes yet. The {CAUSE_PACKAGES.length} built-in causes are always shown below these.
          </p>
        ) : (
          <ul className="space-y-2">
            {causes.map((c) => (
              <CauseRow key={c.id} cause={c} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Field({ label, name, required, list }: { label: string; name: string; required?: boolean; list?: string }) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={name} required={required} list={list} maxLength={160} />
    </div>
  );
}

function CauseRow({ cause }: { cause: Cause }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onDelete() {
    if (!confirm(`Delete “${cause.title_en}” from the website?`)) return;
    startTransition(async () => {
      const result = await deleteCause(cause.id);
      if (!result.ok) toast.error(result.error);
      else {
        toast.success("Cause deleted");
        router.refresh();
      }
    });
  }

  return (
    <li className="flex items-center gap-3 rounded-lg border bg-card p-2">
      <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
        {cause.image_url && <Image src={cause.image_url} alt="" fill sizes="56px" className="object-cover" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{cause.title_en}</p>
        <p className="truncate text-xs text-muted-foreground">
          {cause.category_en || "—"}
          {cause.popular && " · Urgent"}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-10 shrink-0 text-muted-foreground hover:text-destructive"
        onClick={onDelete}
        disabled={pending}
        aria-label={`Delete ${cause.title_en}`}
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
      </Button>
    </li>
  );
}
