
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Package,
  Wrench,
  Truck,
  MessageCircle,
  Sparkles,
  CalendarCheck,
  ShieldCheck,
  Layers3,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
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

      if (!images.length && r.coverImage) {
        images = [r.coverImage];
      }

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

const services = [
  {
    number: "01",
    icon: Package,
    title: "Produção personalizada",
    description:
      "Stands, quiosques e tendas concebidos para representar a sua marca e valorizar cada evento.",
    tag: "Produção",
  },
  {
    number: "02",
    icon: Layers3,
    title: "Aluguer de equipamentos",
    description:
      "Soluções práticas para o seu evento, desde iluminação LED e ecrãs até mobiliário e acessórios.",
    tag: "Equipamentos",
  },
  {
    number: "03",
    icon: Wrench,
    title: "Montagem profissional",
    description:
      "Acompanhamento técnico, instalação e desmontagem para que tudo esteja preparado a tempo.",
    tag: "Execução",
  },
];

const steps = [
  {
    number: "01",
    title: "Explore",
    description: "Descubra produtos e soluções no nosso catálogo.",
  },
  {
    number: "02",
    title: "Selecione",
    description: "Escolha os artigos, quantidades e período pretendido.",
  },
  {
    number: "03",
    title: "Solicite",
    description: "Envie o seu pedido com os dados do evento.",
  },
  {
    number: "04",
    title: "Confirme",
    description: "A nossa equipa verifica a disponibilidade e contacta-o.",
  },
];

export default async function HomePage() {
  const [featured, gallery] = await Promise.all([
    getFeatured(),
    getGallery(),
  ]);

  const whatsapp = (
    process.env.NEXT_PUBLIC_WHATSAPP || "244900000000"
  ).replace(/\D/g, "");

  const email =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contacto@stands.ao";

  const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
    "Olá! Gostaria de solicitar um orçamento para o meu evento.",
  )}`;

  return (
    <main className="overflow-hidden bg-white text-zinc-950 transition-colors duration-500 dark:bg-[#080b12] dark:text-white">
      <Hero />

      {/* SERVIÇOS */}
      <section
        id="servicos"
        className="relative px-5 py-24 sm:px-8 sm:py-32 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                <span className="h-px w-7 bg-blue-500" />
                O que fazemos
              </p>

              <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">
                Tudo o que precisa.
                <br />
                <span className="text-zinc-400 dark:text-zinc-500">
                  Num só parceiro.
                </span>
              </h2>
            </div>

            <p className="max-w-lg text-base leading-7 text-zinc-600 dark:text-zinc-400 lg:justify-self-end">
              Da primeira ideia à instalação final, reunimos as soluções
              essenciais para criar espaços funcionais e memoráveis.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.number}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-zinc-200/80 bg-zinc-50/70 p-7 transition duration-500 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-xl hover:shadow-zinc-900/[0.04] sm:p-8 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-blue-400/30 dark:hover:bg-white/[0.045] dark:hover:shadow-black/20"
                >
                  <div className="mb-12 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 transition duration-300 group-hover:bg-blue-600 group-hover:text-white dark:border-blue-400/15 dark:bg-blue-400/[0.08] dark:text-blue-400 dark:group-hover:bg-blue-500 dark:group-hover:text-white">
                      <Icon size={22} strokeWidth={1.7} />
                    </div>

                    <span className="text-sm font-medium tracking-widest text-zinc-400 dark:text-zinc-600">
                      {service.number}
                    </span>
                  </div>

                  <span className="mb-3 inline-block text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                    {service.tag}
                  </span>

                  <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                    {service.description}
                  </p>

                  <div className="mt-7 h-px w-full bg-zinc-200 transition-colors group-hover:bg-blue-200 dark:bg-white/10 dark:group-hover:bg-blue-400/30" />
                </article>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 rounded-2xl border border-zinc-200/70 px-5 py-5 text-sm text-zinc-600 dark:border-white/[0.08] dark:text-zinc-400 sm:justify-between sm:px-8">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={17} className="text-blue-600 dark:text-blue-400" />
              Soluções personalizadas
            </div>

            <div className="flex items-center gap-2.5">
              <CalendarCheck size={17} className="text-blue-600 dark:text-blue-400" />
              Planeamento do evento
            </div>

            <div className="flex items-center gap-2.5">
              <ShieldCheck size={17} className="text-blue-600 dark:text-blue-400" />
              Acompanhamento da equipa
            </div>
          </div>
        </div>
      </section>

      {/* PRODUTOS EM DESTAQUE */}
      {featured.length > 0 && (
        <section
          id="catalogo-destaques"
          className="relative border-y border-zinc-200/70 bg-[#f7f8fb] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 dark:border-white/[0.06] dark:bg-[#0b0f18]"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                  <Sparkles size={14} />
                  Seleção EVENTOS 360
                </p>

                <h2 className="text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">
                  Produtos em destaque
                </h2>

                <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
                  Explore algumas das soluções disponíveis para preparar
                  o seu próximo evento.
                </p>
              </div>

              <Link
                href="/catalogo"
                className="group inline-flex w-fit items-center gap-2 rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold transition hover:border-blue-400 hover:text-blue-600 dark:border-white/15 dark:bg-white/[0.04] dark:hover:border-blue-400/40 dark:hover:text-blue-400"
              >
                Ver catálogo completo
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GALERIA */}
      <section className="py-8 sm:py-12">
        <GallerySection projects={gallery} />
      </section>

      {/* COMO FUNCIONA */}
      <section
        id="como-funciona"
        className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32 lg:px-12"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(37,99,235,0.10),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_50%_0%,rgba(37,99,235,0.12),transparent_60%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Simples e transparente
            </p>

            <h2 className="text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Do catálogo ao evento.
            </h2>

            <p className="mt-5 text-base leading-7 text-zinc-600 dark:text-zinc-400">
              Um processo claro para nos dizer o que precisa e receber
              acompanhamento da nossa equipa.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <article
                key={step.number}
                className="relative rounded-[1.5rem] border border-zinc-200/80 bg-white/80 p-6 transition duration-300 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-950/[0.04] dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-blue-400/30"
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-xs font-bold tracking-[0.15em] text-blue-600 dark:text-blue-400">
                    PASSO {step.number}
                  </span>

                  {index < steps.length - 1 && (
                    <ArrowRight
                      size={17}
                      className="hidden text-zinc-300 dark:text-zinc-600 lg:block"
                    />
                  )}
                </div>

                <h3 className="text-xl font-semibold tracking-tight">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                  {step.description}
                </p>
              </article>
            ))}
          </div>

          <p className="mx-auto mt-8 flex max-w-3xl items-start justify-center gap-2 text-center text-xs leading-6 text-zinc-500 dark:text-zinc-500">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
            O envio do pedido não garante a reserva. A disponibilidade
            e as condições serão confirmadas pela nossa equipa.
          </p>
        </div>
      </section>

      {/* CONTACTO */}
      <section
        id="contacto"
        className="px-5 pb-24 pt-8 sm:px-8 sm:pb-32 lg:px-12"
      >
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-zinc-200 bg-[#f7f9fc] dark:border-white/[0.08] dark:bg-[#0d1421]">
          <div className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full bg-blue-400/[0.12] blur-[100px] dark:bg-blue-500/[0.12]" />

          <div className="relative grid gap-10 p-7 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:p-16">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                <MessageCircle size={15} />
                Vamos conversar
              </p>

              <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">
                Tem um evento
                <br />
                para preparar?
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
                Partilhe a sua ideia connosco. A nossa equipa poderá
                ajudar a identificar as soluções adequadas e preparar
                uma proposta para o seu evento.
              </p>

              <div className="mt-8 space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
                <p>
                  <span className="text-zinc-500 dark:text-zinc-500">
                    WhatsApp
                  </span>
                  <br />
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block font-semibold transition hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    +{whatsapp}
                  </a>
                </p>

                <p>
                  <span className="text-zinc-500 dark:text-zinc-500">
                    Email
                  </span>
                  <br />
                  <a
                    href={`mailto:${email}`}
                    className="mt-1 inline-block font-semibold transition hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {email}
                  </a>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-[1.5rem] border border-zinc-200 bg-white/80 p-5 shadow-sm sm:p-7 dark:border-white/10 dark:bg-white/[0.035]">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400">
                <MessageCircle size={23} />
              </div>

              <h3 className="text-xl font-semibold tracking-tight">
                Fale directamente connosco
              </h3>

              <p className="mb-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Envie-nos uma mensagem com a data, o local e o tipo
                de estrutura ou equipamento de que necessita.
              </p>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-green-600 px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-green-500"
              >
                Abrir WhatsApp
                <ArrowRight size={16} />
              </a>

              <Link
                href="/catalogo"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-zinc-200 px-6 text-sm font-semibold text-zinc-800 transition hover:border-blue-300 hover:text-blue-600 dark:border-white/15 dark:text-zinc-200 dark:hover:border-blue-400/40 dark:hover:text-blue-400"
              >
                Explorar catálogo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
