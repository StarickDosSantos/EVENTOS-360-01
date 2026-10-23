import Link from "next/link";
import { CheckCircle2, Package, Wrench, Truck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import ProductCard from "@/components/ProductCard";
import GallerySection from "@/components/GallerySection";
import Hero from "@/components/Hero";

export const dynamic = "force-dynamic";

async function getFeatured() {
  try {
    return await prisma.product.findMany({
      where: { status: "PUBLISHED", featured: true },
      orderBy: { sortOrder: "asc" },
      take: 6,
    });
  } catch {
    return [];
  }
}

async function getGallery() {
  try {
    const rows = await prisma.galleryProject.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 12,
    });
    return rows.map((r) => {
      let images: string[] = [];
      try {
        images = JSON.parse(r.images || "[]");
      } catch {
        images = [];
      }
      if (!images.length && r.coverImage) images = [r.coverImage];
      return {
        id: r.id,
        title: r.title,
        description: r.description,
        category: r.category,
        coverImage: r.coverImage,
        images,
        eventDate: r.eventDate ? r.eventDate.toISOString() : null,
      };
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featured, gallery, settings] = await Promise.all([
    getFeatured(),
    getGallery(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Hero />

      {/* Serviços */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            O que fazemos
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Os nossos serviços</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Do projecto à montagem — tudo num só lugar
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: Package,
              title: "Produção",
              desc: "Stands, quiosques e tendas personalizados à medida do seu evento e marca.",
            },
            {
              icon: Wrench,
              title: "Aluguer",
              desc: "Equipamentos digitais, iluminação LED, red carpet, baias e muito mais.",
            },
            {
              icon: Truck,
              title: "Montagem",
              desc: "Equipa técnica para instalação, suporte no local e desmontagem.",
            },
          ].map((s) => (
            <div key={s.title} className="group glass-card rounded-3xl p-7">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600/10 text-brand-600 transition-transform duration-500 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-500/15 dark:text-brand-400">
                <s.icon size={26} />
              </div>
              <h3 className="text-xl font-bold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Destaques */}
      {featured.length > 0 && (
        <section className="relative py-20">
          <div className="absolute inset-0 bg-brand-600/[0.03] dark:bg-brand-500/[0.05]" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-12 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                  Catálogo
                </p>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Destaques</h2>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                  Produtos mais pedidos pelos nossos clientes
                </p>
              </div>
              <Link
                href="/catalogo"
                className="hidden text-sm font-semibold text-brand-600 transition hover:text-brand-500 sm:inline-flex"
              >
                Ver tudo →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <div className="mt-10 text-center sm:hidden">
              <Link href="/catalogo" className="btn-primary">
                Ver catálogo completo
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Galeria dinâmica */}
      <GallerySection projects={gallery} />

      {/* Como funciona */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-white sm:text-4xl">
            Como funciona
          </h2>
          <div className="grid gap-6 sm:grid-cols-4">
            {[
              "Explore o catálogo e escolha produtos",
              "Adicione ao carrinho (quantidades e dias)",
              "Preencha o formulário e envie o pedido",
              "Recebemos e confirmamos disponibilidade",
            ].map((step, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/15 bg-white/10 p-5 text-center backdrop-blur-md transition hover:bg-white/15"
              >
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white">
                  {i + 1}
                </div>
                <p className="text-sm font-medium text-brand-50">{step}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-brand-100/90">
            <CheckCircle2 className="mr-1.5 inline h-4 w-4" />
            O pedido fica pendente de aprovação — não há confirmação automática de reserva.
          </p>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="glass-strong overflow-hidden rounded-[2rem] p-8 sm:p-12">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                Contacto
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Fale connosco</h2>
              <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                Tem um projecto em mente ou precisa de um orçamento personalizado?
                Contacte-nos directamente.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                <li>
                  <strong>WhatsApp:</strong> +{settings.whatsapp}
                </li>
                <li>
                  <strong>Email:</strong> {settings.email}
                </li>
                {settings.phone && (
                  <li>
                    <strong>Telefone:</strong> {settings.phone}
                  </li>
                )}
                {settings.address && (
                  <li>
                    <strong>Morada:</strong> {settings.address}
                  </li>
                )}
              </ul>
            </div>
            <div className="flex flex-col items-start justify-center gap-3">
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-green-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-500/30 transition hover:scale-[1.02] hover:bg-green-600 sm:w-auto"
              >
                Abrir WhatsApp
              </a>
              <Link
                href="/catalogo"
                className="btn-glass w-full sm:w-auto"
              >
                Ir para o catálogo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
