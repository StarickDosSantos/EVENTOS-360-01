import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }
  return NextResponse.json(product);
}

const patchSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  shortDesc: z.string().optional().nullable(),
  category: z.enum(["PRODUCAO", "ALUGUER", "PACOTE"]).optional(),
  modality: z.enum(["VENDA", "ALUGUER", "AMBAS"]).optional(),
  price: z.number().min(0).optional(),
  priceSale: z.number().min(0).optional().nullable(),
  priceUnit: z.enum(["UNIDADE", "DIA", "EVENTO", "MONTAGEM"]).optional(),
  stock: z.number().int().min(0).optional(),
  image: z.string().optional().nullable(),
  featured: z.boolean().optional(),
  status: z.enum(["PUBLISHED", "HIDDEN", "UNAVAILABLE"]).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const data = patchSchema.parse(await req.json());
    const product = await prisma.product.update({
      where: { id },
      data,
    });
    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro" }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[produtos DELETE]", err);
    return NextResponse.json(
      { error: "Não foi possível eliminar o produto" },
      { status: 400 }
    );
  }
}
