"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useId, useRef, useState, useTransition } from "react";
import { ImagePlus, Loader2, Play, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { createPosts, deletePost } from "@/app/actions/content";
import { uploadMedia, type UploadedMedia } from "@/components/admin/media-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/format";
import type { Post, PostKind } from "@/types/database";

const COPY: Record<
  PostKind,
  { titleLabel: string; titlePlaceholder: string; withBody: boolean; multiple: boolean; submit: string; empty: string }
> = {
  update: {
    titleLabel: "Title",
    titlePlaceholder: "e.g. Ramadan ration drive completed",
    withBody: true,
    multiple: false,
    submit: "Publish update",
    empty: "No updates yet. Your first announcement will appear on the Updates page.",
  },
  work: {
    titleLabel: "Caption (optional)",
    titlePlaceholder: "e.g. Solar pump installed — Tharparkar",
    withBody: false,
    multiple: true,
    submit: "Upload to gallery",
    empty: "No uploads yet. New photos and videos show first in the Work gallery.",
  },
  review: {
    titleLabel: "Name / caption (optional)",
    titlePlaceholder: "e.g. Message from a donor in Lyon",
    withBody: false,
    multiple: true,
    submit: "Upload reviews",
    empty: "No reviews yet. Upload screenshots or video reviews.",
  },
};

/**
 * Mobile-first add + list screen shared by Updates, Work and Reviews.
 * Files go straight to Supabase Storage from the browser, then one server
 * action records them.
 */
export function PostManager({ kind, posts }: { kind: PostKind; posts: Post[] }) {
  const copy = COPY[kind];
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const ids = { title: useId(), body: useId(), files: useId() };
  const busy = status !== null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = String(form.get("title") ?? "");
    const body = String(form.get("body") ?? "");

    if (files.length === 0 && (kind !== "update" || (!title.trim() && !body.trim()))) {
      toast.error(kind === "update" ? "Add some text or a photo/video." : "Choose at least one photo or video.");
      return;
    }

    try {
      const media: UploadedMedia[] = [];
      for (const [i, file] of files.entries()) {
        setStatus(files.length > 1 ? `Uploading ${i + 1} of ${files.length}…` : "Uploading…");
        media.push(await uploadMedia(file, kind));
      }

      setStatus("Saving…");
      const result = await createPosts({ kind, title, body, media });
      if (!result.ok) throw new Error(result.error);

      toast.success(kind === "update" ? "Update published" : `${media.length} item(s) added`);
      formRef.current?.reset();
      setFiles([]);
      startTransition(() => router.refresh());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setStatus(null);
    }
  }

  return (
    <div className="space-y-8">
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="space-y-4 rounded-xl border bg-card p-4 sm:p-6"
      >
        <div className="space-y-1.5">
          <Label htmlFor={ids.title}>{copy.titleLabel}</Label>
          <Input id={ids.title} name="title" placeholder={copy.titlePlaceholder} maxLength={200} />
        </div>

        {copy.withBody && (
          <div className="space-y-1.5">
            <Label htmlFor={ids.body}>Announcement text</Label>
            <Textarea id={ids.body} name="body" rows={4} maxLength={5000} />
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor={ids.files}>
            {copy.multiple ? "Photos / videos" : "Photo or video (optional)"}
          </Label>
          <label
            htmlFor={ids.files}
            className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed p-4 text-center text-sm text-muted-foreground hover:bg-muted/50"
          >
            <ImagePlus className="size-6" aria-hidden />
            {files.length > 0
              ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
              : copy.multiple
                ? "Tap to choose — you can pick several"
                : "Tap to choose"}
          </label>
          <input
            id={ids.files}
            type="file"
            accept="image/*,video/*"
            multiple={copy.multiple}
            className="sr-only"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          />
          <p className="text-xs text-muted-foreground">Videos up to 50 MB. Photos are resized automatically.</p>
        </div>

        <Button type="submit" className="h-11 w-full sm:w-auto" disabled={busy}>
          {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Upload className="size-4" aria-hidden />}
          {status ?? copy.submit}
        </Button>
      </form>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Published ({posts.length}) — newest first
        </h2>
        {posts.length === 0 ? (
          <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            {copy.empty}
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {posts.map((post) => (
              <PostTile key={post.id} post={post} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function PostTile({ post }: { post: Post }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onDelete() {
    if (!confirm("Delete this item from the website?")) return;
    startTransition(async () => {
      const result = await deletePost(post.id);
      if (!result.ok) toast.error(result.error);
      else {
        toast.success("Deleted");
        router.refresh();
      }
    });
  }

  return (
    <li className="overflow-hidden rounded-lg border bg-card">
      <div className="relative aspect-square bg-muted">
        {post.media_type === "image" && post.media_url ? (
          <Image src={post.media_url} alt={post.title} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" />
        ) : post.media_type === "video" && post.media_url ? (
          <>
            <video src={`${post.media_url}#t=0.1`} preload="metadata" muted playsInline className="size-full object-cover" />
            <Play className="absolute left-2 top-2 size-5 rounded-full bg-black/60 p-1 text-white" aria-hidden />
          </>
        ) : (
          <p className="line-clamp-6 p-3 text-xs text-muted-foreground">{post.body}</p>
        )}
      </div>
      <div className="flex items-center gap-1 p-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium">{post.title || "Untitled"}</p>
          <p className="text-[11px] text-muted-foreground">{formatDate(post.created_at)}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 shrink-0 text-muted-foreground hover:text-destructive"
          onClick={onDelete}
          disabled={pending}
          aria-label="Delete"
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
        </Button>
      </div>
    </li>
  );
}
