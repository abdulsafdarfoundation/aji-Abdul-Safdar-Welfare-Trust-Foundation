"use client";

import { createClient } from "@/lib/supabase/client";
import type { MediaType } from "@/types/database";

export type UploadedMedia = { url: string; path: string; type: MediaType };

const MAX_BYTES = 50 * 1024 * 1024; // matches the bucket's file_size_limit
const MAX_IMAGE_EDGE = 1920;

/**
 * Phone photos are often 4–12 MB. Downscaling to 1920px JPEG before upload
 * makes them ~10× smaller, which is the difference between seconds and
 * minutes on mobile data. Falls back to the original on any failure.
 */
async function shrinkImage(file: File): Promise<Blob> {
  if (file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 1.5 * 1024 * 1024) return file;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85),
    );
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

/** Uploads one file to the public `media` bucket and returns its public URL. */
export async function uploadMedia(file: File, folder: string): Promise<UploadedMedia> {
  const type: MediaType | null = file.type.startsWith("video/")
    ? "video"
    : file.type.startsWith("image/")
      ? "image"
      : null;

  if (!type) throw new Error(`"${file.name}" is not a photo or video.`);
  if (/hei[cf]/i.test(file.type)) {
    throw new Error(`"${file.name}" is HEIC — set the camera to JPEG ("Most compatible") and retry.`);
  }

  const body = type === "image" ? await shrinkImage(file) : file;
  if (body.size > MAX_BYTES) {
    throw new Error(`"${file.name}" is over 50 MB. Trim or compress the video first.`);
  }

  const contentType = body === file ? file.type : "image/jpeg";
  const ext =
    contentType === "image/jpeg"
      ? "jpg"
      : (file.name.split(".").pop() || (type === "video" ? "mp4" : "jpg")).toLowerCase();
  const path = `${folder}/${Date.now()}-${randomId()}.${ext}`;

  const supabase = createClient();
  const { error } = await supabase.storage
    .from("media")
    .upload(path, body, { contentType, cacheControl: "31536000", upsert: false });
  if (error) throw new Error(`Upload failed for "${file.name}": ${error.message}`);

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return { url: data.publicUrl, path, type };
}
