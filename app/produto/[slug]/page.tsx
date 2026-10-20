import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  formatPriceLabel,
  CATEGORY_LABELS,
  MODALITY_LABELS,
} from "@/lib/utils";
import AddToCartButton from "./AddToCartButton";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  return { title: product?.name || "Produto" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product || product.status !== "PUBLISHED") notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/catalogo"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-brand-600 dark:text-zinc-400"
      >
        <ArrowLeft size={16} />
        Voltar ao catálogo
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400">
              Sem imagem
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800 dark:bg-brand-950 dark:text-brand-300">
              {CATEGORY_LABELS[product.category]}
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {MODALITY_LABELS[product.modality]}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-bold text-brand-700 dark:text-brand-400">
            {formatPriceLabel(
              product.price,
              product.priceUnit,
              product.priceSale
            )}
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            {product.description}
          </p>
          {product.minDays && (
            <p className="mt-2 text-sm text-zinc-500">
              Mínimo de {product.minDays} dia(s) para aluguer.
            </p>
          )}
          <p className="mt-1 text-sm text-zinc-500">
            Disponibilidade: {product.stock} unidade(s)
          </p>

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
