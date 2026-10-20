import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import CatalogFilters from "./CatalogFilters";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Catálogo",
};

type SearchParams = Promise<{ categoria?: string; q?: string }>;

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const categoria = sp.categoria?.toUpperCase();
  const q = sp.q?.trim();

  const where: {
    status: "PUBLISHED";
    category?: "PRODUCAO" | "ALUGUER" | "PACOTE";
    OR?: { name?: { contains: string }; description?: { contains: string } }[];
  } = { status: "PUBLISHED" };

  if (categoria && ["PRODUCAO", "ALUGUER", "PACOTE"].includes(categoria)) {
    where.category = categoria as "PRODUCAO" | "ALUGUER" | "PACOTE";
  }
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
    ];
  }

  let products: Awaited<ReturnType<typeof prisma.product.findMany>> = [];
  try {
    products = await prisma.product.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  } catch {
    products = [];
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Catálogo</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Produção, aluguer e pacotes — escolha e adicione ao carrinho
        </p>
      </div>

      <CatalogFilters current={categoria} query={q} />

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 py-16 text-center text-zinc-500 dark:border-zinc-700">
          Nenhum produto encontrado. Ajuste os filtros ou{" "}
          <a href="/catalogo" className="text-brand-600 underline">
            limpe a pesquisa
          </a>
          .
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
