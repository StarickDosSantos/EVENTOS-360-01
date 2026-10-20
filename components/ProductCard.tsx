"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Tag, ArrowUpRight } from "lucide-react";
import { formatPriceLabel, CATEGORY_LABELS, MODALITY_LABELS } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useState } from "react";

type Product = {
  id: string;
  name: string;
  slug: string;
  shortDesc?: string | null;
  description: string;
  category: string;
  modality: string;
  price: number;
  priceSale?: number | null;
  priceUnit: string;
  image?: string | null;
  featured?: boolean;
};

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const defaultModality =
    product.modality === "VENDA"
      ? "VENDA"
      : product.modality === "ALUGUER"
        ? "ALUGUER"
        : "ALUGUER";

  const unitPrice =
    defaultModality === "VENDA" && product.priceSale
      ? product.priceSale
      : product.price;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      unitPrice,
      priceUnit: product.priceUnit,
      modality: defaultModality as "VENDA" | "ALUGUER",
      days: product.priceUnit === "DIA" ? 1 : undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl glass-card">
      {/* Shine sweep on hover */}
      <div className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
        <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:left-full" />
      </div>

      <Link
        href={`/produto/${product.slug}`}
        className="relative aspect-[4/3] overflow-hidden bg-zinc-100/50 dark:bg-zinc-800/50"
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-400">
            <Tag size={40} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
        <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/30 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
          {CATEGORY_LABELS[product.category] || product.category}
        </span>
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/20 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
          <ArrowUpRight size={14} />
        </span>
      </Link>

      <div className="relative z-0 flex flex-1 flex-col p-5">
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          {MODALITY_LABELS[product.modality] || product.modality}
        </div>
        <Link href={`/produto/${product.slug}`}>
          <h3 className="text-lg font-bold leading-tight tracking-tight text-zinc-900 transition group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {product.shortDesc || product.description}
        </p>
        <div className="mt-5 flex items-center justify-between gap-2">
          <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-white">
            {formatPriceLabel(product.price, product.priceUnit, product.priceSale)}
          </span>
          <button
            type="button"
            onClick={handleAdd}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all duration-300 ${
              added
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                : "bg-brand-600 text-white shadow-md shadow-brand-600/25 hover:scale-105 hover:bg-brand-500 hover:shadow-lg"
            }`}
          >
            <ShoppingCart size={13} />
            {added ? "Adicionado" : "Adicionar"}
          </button>
        </div>
      </div>
    </article>
  );
}
