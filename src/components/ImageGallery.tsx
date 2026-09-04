"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  url: string;
  alt: string;
  category: string;
  created_at: string;
}

const categories = ["all", "projects", "campus", "personal"];

export default function ImageGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const url =
      activeCategory === "all"
        ? "/api/gallery"
        : `/api/gallery?category=${activeCategory}`;

    setLoading(true);
    fetch(url)
      .then((r) => r.json())
      .then((d) => setImages(d.images ?? []))
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <div>
      {/* Category filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              activeCategory === cat
                ? "bg-primary text-white"
                : "border border-border text-text-muted hover:border-primary/30 hover:text-text"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      )}

      {/* Empty state */}
      {!loading && images.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20">
          <ImageIcon size={40} className="text-text-muted/40" />
          <p className="mt-3 text-sm text-text-muted">
            No images yet. Upload some through the admin panel.
          </p>
        </div>
      )}

      {/* Image grid */}
      {!loading && images.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setLightbox(img)}
              className="group cursor-pointer overflow-hidden rounded-xl border border-border transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-surface-alt">
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium">{img.title}</h3>
                {img.description && (
                  <p className="mt-1 text-sm text-text-muted line-clamp-2">
                    {img.description}
                  </p>
                )}
                <span className="mt-2 inline-block rounded-full bg-surface-alt px-2.5 py-0.5 text-xs font-medium text-text-muted">
                  {img.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-h-[85vh] max-w-4xl overflow-hidden rounded-2xl bg-surface"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightbox(null)}
                className="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              >
                <X size={18} />
              </button>
              <div className="relative aspect-video">
                <Image
                  src={lightbox.url}
                  alt={lightbox.alt}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold">{lightbox.title}</h3>
                {lightbox.description && (
                  <p className="mt-1 text-sm text-text-muted">
                    {lightbox.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
