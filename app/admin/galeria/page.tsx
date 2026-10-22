import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, Images } from "lucide-react";
import GalleryActions from "./GalleryActions";

export const dynamic = "force-dynamic";

export default async function AdminGaleriaPage() {
  const projects = await prisma.galleryProject.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Galeria</h1>
          <p className="text-sm text-zinc-500">
            Projectos com fotos, categoria e descrição (ex: FILDA 2026)
          </p>
        </div>
        <Link
          href="/admin/galeria/novo"
          className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-600/25 transition hover:bg-brand-500"
        >
          <Plus size={16} />
          Novo projecto
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 py-16 text-zinc-400 dark:border-zinc-700">
          <Images size={40} className="mb-3 opacity-50" />
          <p className="text-sm">Nenhum projecto na galeria</p>
          <Link
            href="/admin/galeria/novo"
            className="mt-4 text-sm font-semibold text-brand-600 hover:underline"
          >
            Criar o primeiro →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => {
            let imgs: string[] = [];
            try {
              imgs = JSON.parse(p.images || "[]");
            } catch {
              imgs = [];
            }
            return (
              <div
                key={p.id}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.coverImage}
                    alt={p.title}
                    className="h-full w-full object-cover"
                  />
                  {!p.published && (
                    <span className="absolute left-2 top-2 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
                      Oculto
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-600">
                    {p.category}
                  </p>
                  <h3 className="font-bold">{p.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-zinc-500">
                    {p.description || "Sem descrição"}
                  </p>
                  <p className="mt-2 text-xs text-zinc-400">
                    {imgs.length} foto{imgs.length !== 1 ? "s" : ""}
                  </p>
                  <GalleryActions id={p.id} published={p.published} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
