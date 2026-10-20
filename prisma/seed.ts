import { PrismaClient, ProductCategory, ProductModality, PriceUnit, ProductStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const products = [
  {
    name: "Stand",
    slug: "stand",
    description:
      "Stand completo para feiras e exposições. Estrutura robusta, personalizável com a sua marca, incluindo montagem e desmontagem.",
    shortDesc: "Stand profissional para feiras e eventos",
    category: ProductCategory.PRODUCAO,
    modality: ProductModality.VENDA,
    price: 1600000,
    priceUnit: PriceUnit.UNIDADE,
    stock: 10,
    featured: true,
    sortOrder: 1,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  },
  {
    name: "Quiosque",
    slug: "quiosque",
    description:
      "Quiosque modular ideal para pontos de venda, degustações e activações de marca. Fácil de montar e transportar.",
    shortDesc: "Quiosque modular para activações",
    category: ProductCategory.PRODUCAO,
    modality: ProductModality.VENDA,
    price: 65000,
    priceUnit: PriceUnit.UNIDADE,
    stock: 20,
    featured: true,
    sortOrder: 2,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
  },
  {
    name: "Tendas",
    slug: "tendas",
    description:
      "Tendas profissionais para eventos outdoor. Disponíveis em várias dimensões, com opções de laterais e iluminação.",
    shortDesc: "Tendas profissionais para eventos",
    category: ProductCategory.PRODUCAO,
    modality: ProductModality.VENDA,
    price: 80000,
    priceUnit: PriceUnit.UNIDADE,
    stock: 15,
    featured: true,
    sortOrder: 3,
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
  },
  {
    name: "Cubo",
    slug: "cubo",
    description:
      "Estrutura cúbica versátil. Disponível para aluguer ou compra. Ideal para stands minimalistas e zonas de experiência.",
    shortDesc: "Cubo — aluguer ou compra",
    category: ProductCategory.ALUGUER,
    modality: ProductModality.AMBAS,
    price: 250000,
    priceSale: 450000,
    priceUnit: PriceUnit.UNIDADE,
    stock: 8,
    featured: true,
    sortOrder: 4,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  },
  {
    name: "Red Carpet",
    slug: "red-carpet",
    description:
      "Tapete vermelho premium para entradas VIP, cerimónias e eventos de alto nível. Várias larguras disponíveis.",
    shortDesc: "Tapete vermelho VIP",
    category: ProductCategory.ALUGUER,
    modality: ProductModality.ALUGUER,
    price: 100000,
    priceUnit: PriceUnit.EVENTO,
    stock: 12,
    featured: false,
    sortOrder: 5,
    image: "https://images.unsplash.com/photo-1519167758481-83f142bb8cba?w=800&q=80",
  },
  {
    name: "Baias",
    slug: "baias",
    description:
      "Baias de exposição modulares. Perfeitas para feiras, mercados e espaços de demonstração de produtos.",
    shortDesc: "Baias modulares de exposição",
    category: ProductCategory.ALUGUER,
    modality: ProductModality.ALUGUER,
    price: 75000,
    priceUnit: PriceUnit.UNIDADE,
    stock: 25,
    featured: false,
    sortOrder: 6,
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80",
  },
  {
    name: 'Tablet Touch 21"',
    slug: "tablet-touch-21",
    description:
      "Tablet touch de 21 polegadas para interacção digital, catálogos interactivos, jogos e registo de visitantes.",
    shortDesc: "Tablet interactivo 21 polegadas",
    category: ProductCategory.ALUGUER,
    modality: ProductModality.ALUGUER,
    price: 100000,
    priceUnit: PriceUnit.DIA,
    minDays: 1,
    stock: 10,
    featured: true,
    sortOrder: 7,
    image: "https://images.unsplash.com/photo-1585792187661-18b9d0e2c0b8?w=800&q=80",
  },
  {
    name: "Tira LED 2 × 0,5",
    slug: "tira-led-2x05",
    description:
      "Tira de LED luminosa 2m × 0,5m. Ideal para destacar produtos, marcas e criar ambientes impactantes.",
    shortDesc: "Tira LED luminosa 2×0,5 m",
    category: ProductCategory.ALUGUER,
    modality: ProductModality.ALUGUER,
    price: 150000,
    priceUnit: PriceUnit.DIA,
    minDays: 1,
    stock: 15,
    featured: false,
    sortOrder: 8,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
  {
    name: "Mopie Digital",
    slug: "mopie-digital",
    description:
      "Totem digital Mopie para comunicação visual dinâmica. Ecrã de alta resolução, ideal para conteúdo promocional.",
    shortDesc: "Totem digital interactivo",
    category: ProductCategory.ALUGUER,
    modality: ProductModality.ALUGUER,
    price: 300000,
    priceUnit: PriceUnit.EVENTO,
    stock: 6,
    featured: true,
    sortOrder: 9,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  },
  {
    name: "Balcão LED",
    slug: "balcao-led",
    description:
      "Balcão com iluminação LED integrada. Design moderno, perfeito para recepção, bar ou ponto de venda premium.",
    shortDesc: "Balcão com iluminação LED",
    category: ProductCategory.ALUGUER,
    modality: ProductModality.ALUGUER,
    price: 500000,
    priceUnit: PriceUnit.EVENTO,
    stock: 4,
    featured: true,
    sortOrder: 10,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
  },
  {
    name: "Baía + Red Carpet",
    slug: "baia-red-carpet",
    description:
      "Pacote completo: baía de exposição + red carpet. Ideal para entradas de destaque e espaços de demonstração.",
    shortDesc: "Pacote Baía + Red Carpet",
    category: ProductCategory.PACOTE,
    modality: ProductModality.ALUGUER,
    price: 145000,
    priceUnit: PriceUnit.EVENTO,
    stock: 10,
    featured: true,
    sortOrder: 11,
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
  },
];

async function main() {
  console.log("Seeding...");

  const email = process.env.ADMIN_EMAIL || "admin@eventos360.ao";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const hash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Administrador",
      passwordHash: hash,
      role: "ADMIN",
    },
  });
  console.log(`Admin: ${email} / ${password}`);

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        shortDesc: p.shortDesc,
        category: p.category,
        modality: p.modality,
        price: p.price,
        priceSale: p.priceSale ?? null,
        priceUnit: p.priceUnit,
        minDays: p.minDays ?? null,
        stock: p.stock,
        featured: p.featured,
        sortOrder: p.sortOrder,
        image: p.image,
        status: ProductStatus.PUBLISHED,
      },
      create: {
        ...p,
        priceSale: p.priceSale ?? null,
        minDays: p.minDays ?? null,
        status: ProductStatus.PUBLISHED,
        gallery: "[]",
      },
    });
  }

  console.log(`Seeded ${products.length} products.`);

  const galleryProjects = [
    {
      title: "FILDA 2026",
      slug: "filda-2026",
      description:
        "Montagem de stands e quiosques na Feira Internacional de Luanda. Produção completa com iluminação LED e balcões digitais.",
      category: "Feiras",
      coverImage:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80",
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80",
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=80",
      ]),
      published: true,
      sortOrder: 1,
    },
    {
      title: "Convenção Corporativa 2025",
      slug: "convencao-corporativa-2025",
      description:
        "Espaço de networking com red carpet, baias e tablet touch para registo de participantes.",
      category: "Corporativo",
      coverImage:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
        "https://images.unsplash.com/photo-1519167758481-83f142bb8cba?w=1200&q=80",
      ]),
      published: true,
      sortOrder: 2,
    },
    {
      title: "Festival de Música — Stage VIP",
      slug: "festival-musica-stage-vip",
      description:
        "Área VIP com balcão LED, iluminação e estruturas modulares para activações de marca.",
      category: "Concertos",
      coverImage:
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=900&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80",
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&q=80",
        "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&q=80",
      ]),
      published: true,
      sortOrder: 3,
    },
  ];

  for (const g of galleryProjects) {
    await prisma.galleryProject.upsert({
      where: { slug: g.slug },
      update: {
        title: g.title,
        description: g.description,
        category: g.category,
        coverImage: g.coverImage,
        images: g.images,
        published: g.published,
        sortOrder: g.sortOrder,
      },
      create: g,
    });
  }
  console.log(`Seeded ${galleryProjects.length} gallery projects.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
