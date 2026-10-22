"use client";

import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  className?: string;
  /** object-fit style */
  fit?: "cover" | "contain";
};

/**
 * Imagem sem next/image — aceita qualquer URL (Cloudinary, Unsplash page/CDN, etc.)
 * e não exige remotePatterns no next.config.
 */
export default function SafeImage({
  src,
  alt,
  className,
  fit = "cover",
}: Props) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-zinc-200 text-zinc-400 dark:bg-zinc-800",
          className
        )}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cn(
        "h-full w-full",
        fit === "contain" ? "object-contain" : "object-cover",
        className
      )}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
}
