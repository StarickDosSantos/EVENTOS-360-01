import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  shortDesc: z.string().optional().nullable(),
  category: z.enum(["PRODUCAO", "ALUGUER", "PACOTE"]),
  modality: z.enum(["VENDA", "ALUGUER", "AMBAS"]),
  price: z.number().min(0),
  priceSale: z.number().min(0).optional().nullable(),
  priceUnit: z.enum(["UNIDADE", "DIA", "EVENTO", "MONTAGEM"]),
  stock: z.number().int().min(0).default(1),
  image: z.string().optional().nullable(),
  featured: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const data = createSchema.parse(await req.json());
    let slug = slugify(data.name);
    const exists = await prisma.product.findUnique({ where: { slug } });
    if (exists) slug = `${slug}-${Date.now().toString(36)}`;

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        shortDesc: data.shortDesc || null,
        category: data.category,
        modality: data.modality,
        price: data.price,
        priceSale: data.priceSale ?? null,
        priceUnit: data.priceUnit,
        stock: data.stock,
        image: data.image || null,
        featured: data.featured ?? false,
        status: "PUBLISHED",
        gallery: "[]",
      },
    });
    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao criar" }, { status: 400 });
  }
}
