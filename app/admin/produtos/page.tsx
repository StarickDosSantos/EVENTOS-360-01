import { prisma } from "@/lib/prisma";
import { formatKz, CATEGORY_LABELS, MODALITY_LABELS } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import ProductToggle from "./ProductToggle";

export const dynamic = "force-dynamic";

export default async function AdminProdutosPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Link
          href="/admin/produtos/novo"
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700"
        >
          <Plus size={16} />
          Novo produto
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-100 text-xs uppercase text-zinc-500 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3">Produto</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Preço</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-zinc-50 hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/30"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                        {p.image && (
                          <Image
                            src={p.image}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        )}
                      </div>
                      <div>
                        <Link
                          href={`/admin/produtos/${p.id}`}
                          className="font-medium hover:text-brand-600"
                        >
                          {p.name}
                        </Link>
                        <p className="text-xs text-zinc-500">
                          {MODALITY_LABELS[p.modality]}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {CATEGORY_LABELS[p.category]}
                  </td>
                  <td className="px-4 py-3 font-medium">{formatKz(p.price)}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    <ProductToggle id={p.id} status={p.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/produtos/${p.id}`}
                      className="text-xs font-semibold text-brand-600 hover:underline"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
