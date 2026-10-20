"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { cn } from "@/lib/utils";

export type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  coverImage: string;
  images: string[];
  eventDate: string | null;
};

export default function GallerySection({ projects }: { projects: GalleryItem[] }) {
  const [active, setActive] = useState<GalleryItem | null>(null);
  const [photoIdx, setPhotoIdx] = useState(0);

  function openProject(p: GalleryItem) {
    setActive(p);
    setPhotoIdx(0);
  }

  function close() {
    setActive(null);
    setPhotoIdx(0);
  }

  function prev() {
    if (!active) return;
    setPhotoIdx((i) => (i - 1 + active.images.length) % active.images.length);
  }

  function next() {
    if (!active) return;
    setPhotoIdx((i) => (i + 1) % active.images.length);
  }

  if (projects.length === 0) {
    return (
      <section id="galeria" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Galeria de trabalhos</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Em breve — projectos publicados pelo admin aparecerão aqui
          </p>
        </div>
        <div className="glass flex flex-col items-center justify-center rounded-3xl py-20 text-zinc-400">
          <Images size={48} className="mb-3 opacity-40" />
          <p className="text-sm">Nenhum projecto publicado ainda</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="galeria" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Portfolio
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Galeria de trabalhos</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Clique num projecto para ver detalhes e fotos em tamanho grande
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => openProject(p)}
              className={cn(
                "group relative overflow-hidden rounded-3xl text-left glass-card",
                i === 0 && "sm:col-span-2 sm:row-span-1"
              )}
            >
              <div className={cn("relative overflow-hidden", i === 0 ? "aspect-[16/9]" : "aspect-[4/3]")}>
                <Image
                  src={p.coverImage}
                  alt={p.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="mb-2 inline-block rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                    {p.category}
                  </span>
                  <h3 className="text-lg font-bold text-white drop-shadow-md sm:text-xl">
                    {p.title}
                  </h3>
                  {p.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-white/80">
                      {p.description}
                    </p>
                  )}
                  <p className="mt-2 text-xs font-medium text-white/60">
                    {p.images.length} foto{p.images.length !== 1 ? "s" : ""} · Ver projecto →
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox / Modal */}
      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-400">
                  {active.category}
                </span>
                <h3 className="text-xl font-bold text-white sm:text-2xl">{active.title}</h3>
                {active.description && (
                  <p className="mt-1 max-w-2xl text-sm text-zinc-400">{active.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={close}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/15"
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            {/* Main photo */}
            <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black">
              <div className="relative aspect-[16/10] w-full max-h-[60vh]">
                <Image
                  src={active.images[photoIdx] || active.coverImage}
                  alt={`${active.title} — foto ${photoIdx + 1}`}
                  fill
                  className="object-contain"
                  sizes="90vw"
                  priority
                />
              </div>
              {active.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
                    aria-label="Anterior"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
                    aria-label="Seguinte"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {active.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto border-t border-white/10 px-4 py-3">
                {active.images.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPhotoIdx(i)}
                    className={cn(
                      "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition",
                      i === photoIdx
                        ? "border-brand-500 opacity-100"
                        : "border-transparent opacity-50 hover:opacity-80"
                    )}
                  >
                    <Image src={src} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}

            <p className="pb-3 text-center text-xs text-zinc-500">
              {photoIdx + 1} / {active.images.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
