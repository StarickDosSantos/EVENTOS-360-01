import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderCode } from "@/lib/utils";
import { z } from "zod";

const itemSchema = z.object({
  productId: z.string().optional(),
  productName: z.string(),
  productSlug: z.string().optional(),
  quantity: z.number().int().min(1),
  days: z.number().int().min(1).optional().nullable(),
  unitPrice: z.number().min(0),
  modality: z.string(),
  priceUnit: z.string(),
  lineTotal: z.number().min(0),
});

const bodySchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(5),
  customerEmail: z.string().email(),
  type: z.enum(["COMPRA", "ALUGUER", "PRODUCAO"]),
  eventDate: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  totalEstimated: z.number().min(0),
  items: z.array(itemSchema).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const data = bodySchema.parse(json);

    const count = await prisma.order.count();
    const code = generateOrderCode(count + 1);

    const order = await prisma.order.create({
      data: {
        code,
        status: "PENDENTE",
        type: data.type,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        eventDate: data.eventDate ? new Date(data.eventDate) : null,
        location: data.location || null,
        notes: data.notes || null,
        totalEstimated: data.totalEstimated,
        items: {
          create: data.items.map((i) => ({
            productId: i.productId || null,
            productName: i.productName,
            productSlug: i.productSlug || null,
            quantity: i.quantity,
            days: i.days || null,
            unitPrice: i.unitPrice,
            lineTotal: i.lineTotal,
            modality: i.modality,
            priceUnit: i.priceUnit,
          })),
        },
      },
    });

    // TODO: enviar email de notificação à empresa e ao cliente (Resend)

    return NextResponse.json({ ok: true, code: order.code, id: order.id });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: err.flatten() },
        { status: 400 }
      );
    }
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao criar pedido" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Admin only — handled in admin pages via server components
  return NextResponse.json({ error: "Use o painel admin" }, { status: 403 });
}
