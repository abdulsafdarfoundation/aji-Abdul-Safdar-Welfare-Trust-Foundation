"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Camera, Loader2, Play } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { getGalleryMedia } from "@/app/actions";

export function WorkGallery() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();

  useEffect(() => {
    async function loadMedia() {
      const data = await getGalleryMedia();
      setMedia(data);
      setLoading(false);
    }
    loadMedia();
  }, []);

  const categories = [
    { id: "All", labelEn: "All Work", labelFr: "Toutes les Actions" },
    { id: "Ration", labelEn: "Ration Pack", labelFr: "Colis Alimentaires" },
    { id: "Mosque", labelEn: "Mosque", labelFr: "Mosquées" },
    { id: "Meal", labelEn: "Community Meal", labelFr: "Repas" },
    { id: "Water", labelEn: "Solar Water", labelFr: "Eau Solaire" },
    { id: "Welfare", labelEn: "Marriage & Welfare", labelFr: "Mariage & Aide" },
  ];

  const filteredImages =
    activeCategory === "All"
      ? media
      : media.filter((img) => img.categoryEn === activeCategory);

  return (
    <div className="space-y-8" id="gallery">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider">
          <Camera className="size-3.5 text-emerald-600" />
          {lang === "fr" ? "Photos de nos Actions sur le Terrain" : "Authentic Field Photos"}
        </span>
        <h2 className="text-3xl font-heading font-bold text-emerald-950 dark:text-emerald-100 sm:text-4xl">
          {lang === "fr" ? "Nos Actions et Réalisations Concrètes" : "Real Work & Relief Work Delivered"}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          {lang === "fr"
            ? "Découvrez l'impact concret de votre générosité sur le terrain au Pakistan."
            : "See the tangible difference your generosity creates on the ground in Pakistan and rural Sindh."}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`rounded-full px-4 py-2 sm:py-1.5 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer flex-grow sm:flex-grow-0 text-center ${
              activeCategory === cat.id
                ? "bg-emerald-800 text-white shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:text-emerald-900 dark:hover:text-emerald-200"
            }`}
          >
            {lang === "fr" ? cat.labelFr : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredImages.map((img, idx) => {
          const title = lang === "fr" ? img.titleFr : img.titleEn;
          const category = lang === "fr" ? img.categoryFr : img.categoryEn;

          return (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-xl border bg-card shadow-xs transition-all duration-300 hover:shadow-md"
            >
              <div className="relative h-64 w-full overflow-hidden bg-muted">
                {img.type === "video" ? (
                  <video
                    src={img.src}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    controls
                    preload="metadata"
                  />
                ) : (
                  <Image
                    src={img.src}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                
                {img.type !== "video" && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity pointer-events-none" />
                )}
                
                <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
                  {img.type === "video" && (
                    <span className="inline-block rounded-md bg-emerald-600/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1 w-fit">
                      <Play className="size-3" /> Vidéo
                    </span>
                  )}
                  <h4 className="font-semibold text-sm drop-shadow-sm">{title}</h4>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}

