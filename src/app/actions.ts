"use server";

import fs from "fs";
import path from "path";

export async function getGalleryMedia() {
  const directoryPath = path.join(process.cwd(), "public", "images");
  try {
    const files = fs.readdirSync(directoryPath);
    return files
      .filter((file) => file.match(/\.(jpeg|jpg|png|gif|mp4)$/i))
      .map((file) => {
        const isVideo = file.endsWith(".mp4");
        return {
          src: `/images/${file}`,
          type: isVideo ? "video" : "image",
          titleEn: isVideo ? "Field Action (Video)" : "Field Work",
          titleFr: isVideo ? "Action (Vidéo)" : "Action sur le Terrain",
          categoryEn: "All",
          categoryFr: "Toutes les Actions",
        };
      });
  } catch (error) {
    console.error("Error reading gallery media:", error);
    return [];
  }
}
