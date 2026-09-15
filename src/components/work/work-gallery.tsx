"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Camera, Video, Play, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { getGalleryMedia } from "@/app/actions";
import { Button } from "@/components/ui/button";

interface MediaItem {
  src: string;
  type: "image" | "video";
  titleEn: string;
  titleFr: string;
  categoryEn: string;
  categoryFr: string;
}

const ITEMS_PER_PAGE = 6;

export function WorkGallery() {
  const [activeTab, setActiveTab] = useState<"image" | "video">("image");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const { lang } = useLanguage();

  useEffect(() => {
    async function loadMedia() {
      const data = await getGalleryMedia();
      setMedia(data as MediaItem[]);
      setLoading(false);
    }
    loadMedia();
  }, []);

  // Filter media based on 2 tabs only: "image" or "video"
  const filteredMedia = useMemo(() => {
    return media.filter((item) => item.type === activeTab);
  }, [media, activeTab]);

  const totalPages = Math.ceil(filteredMedia.length / ITEMS_PER_PAGE) || 1;

  // Reset page when tab changes
  const handleTabChange = (tab: "image" | "video") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const imageCount = useMemo(() => media.filter((m) => m.type === "image").length, [media]);
  const videoCount = useMemo(() => media.filter((m) => m.type === "video").length, [media]);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMedia.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMedia, currentPage]);

  const goToPrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="space-y-8" id="gallery">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider">
          <Camera className="size-3.5 text-emerald-600" />
          {lang === "fr" ? "Galerie Multimédia sur le Terrain" : "Field Work Gallery"}
        </span>
        <h2 className="text-3xl font-heading font-bold text-emerald-950 dark:text-emerald-100 sm:text-4xl">
          {lang === "fr" ? "Nos Actions en Photos et Vidéos" : "Real Work & Relief Work Delivered"}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          {lang === "fr"
            ? "Découvrez les preuves visuelles et vidéos de vos dons en action au Pakistan."
            : "See authentic field photos and videos of relief work delivered directly on the ground."}
        </p>
      </div>

      {/* Exactly 2 Filter Tabs: Images & Videos */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => handleTabChange("image")}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
            activeTab === "image"
              ? "bg-emerald-800 text-white border-emerald-800 shadow-md scale-105"
              : "bg-card text-muted-foreground border-emerald-900/10 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-900 dark:hover:text-emerald-200"
          }`}
        >
          <Camera className="size-4" />
          <span>{lang === "fr" ? "Photos & Images" : "Photos & Images"}</span>
          <span className="rounded-full bg-emerald-900/30 px-2 py-0.5 text-[11px] font-mono">
            {imageCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("video")}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
            activeTab === "video"
              ? "bg-emerald-800 text-white border-emerald-800 shadow-md scale-105"
              : "bg-card text-muted-foreground border-emerald-900/10 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-900 dark:hover:text-emerald-200"
          }`}
        >
          <Video className="size-4" />
          <span>{lang === "fr" ? "Vidéos de Terrain" : "Videos"}</span>
          <span className="rounded-full bg-emerald-900/30 px-2 py-0.5 text-[11px] font-mono">
            {videoCount}
          </span>
        </button>
      </div>

      {/* Carousel Container */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 py-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-xl bg-muted animate-pulse border border-emerald-900/10"
            />
          ))}
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-emerald-900/20 p-12 text-center text-muted-foreground space-y-2">
          <p className="text-sm font-medium">
            {lang === "fr" ? "Aucun média disponible dans cette catégorie." : "No media found in this section."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Carousel Slide Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-300">
            {currentItems.map((img, idx) => {
              const title = lang === "fr" ? img.titleFr : img.titleEn;

              return (
                <div
                  key={`${img.src}-${idx}`}
                  onClick={() => setSelectedMedia(img)}
                  className="group relative overflow-hidden rounded-xl border-2 border-emerald-900/10 bg-card shadow-xs transition-all duration-300 hover:shadow-xl hover:border-emerald-700/30 cursor-pointer focus-within:ring-2 focus-within:ring-emerald-600"
                >
                  <div className="relative h-64 w-full overflow-hidden bg-emerald-950">
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
                        className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
                      />
                    )}

                    {img.type !== "video" && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity pointer-events-none" />
                    )}

                    <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none z-10">
                      {img.type === "video" ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-1 w-fit">
                          <Play className="size-3" /> Vidéo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-900/80 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider mb-1 w-fit text-emerald-200">
                          <Camera className="size-3" /> Photo
                        </span>
                      )}
                      <h4 className="font-semibold text-xs sm:text-sm drop-shadow-sm line-clamp-1">
                        {title}
                      </h4>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Carousel Pagination & Navigation Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-emerald-900/10">
              <div className="text-xs text-muted-foreground font-medium">
                {lang === "fr"
                  ? `Page ${currentPage} sur ${totalPages} (${filteredMedia.length} éléments)`
                  : `Page ${currentPage} of ${totalPages} (${filteredMedia.length} items)`}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={goToPrev}
                  disabled={currentPage === 1}
                  className="h-9 px-3 border-emerald-900/20 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-xs font-semibold disabled:opacity-40"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="size-4 mr-1" />
                  {lang === "fr" ? "Précédent" : "Previous"}
                </Button>

                {/* Page Indicator Dots */}
                <div className="flex items-center gap-1 px-2">
                  {Array.from({ length: totalPages }).map((_, pageIdx) => {
                    const pageNum = pageIdx + 1;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        aria-label={`Go to page ${pageNum}`}
                        className={`size-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                          currentPage === pageNum
                            ? "bg-emerald-700 w-6"
                            : "bg-emerald-900/20 hover:bg-emerald-700/50"
                        }`}
                      />
                    );
                  })}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                  className="h-9 px-3 border-emerald-900/20 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-xs font-semibold disabled:opacity-40"
                  aria-label="Next Page"
                >
                  {lang === "fr" ? "Suivant" : "Next"}
                  <ChevronRight className="size-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lightbox Modal Preview */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-2xl bg-emerald-950 border-2 border-emerald-700/40 p-2 shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 z-20 rounded-full bg-black/60 p-2 text-white hover:bg-black transition-colors"
              aria-label="Close modal"
            >
              <X className="size-5" />
            </button>

            <div className="relative w-full h-[60vh] sm:h-[70vh] bg-black rounded-xl overflow-hidden flex items-center justify-center">
              {selectedMedia.type === "video" ? (
                <video
                  src={selectedMedia.src}
                  controls
                  autoPlay
                  className="h-full w-full object-contain"
                />
              ) : (
                <Image
                  src={selectedMedia.src}
                  alt={lang === "fr" ? selectedMedia.titleFr : selectedMedia.titleEn}
                  fill
                  className="object-contain"
                />
              )}
            </div>

            <div className="p-4 w-full text-center text-white space-y-1">
              <h3 className="font-semibold text-base sm:text-lg text-emerald-100">
                {lang === "fr" ? selectedMedia.titleFr : selectedMedia.titleEn}
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
