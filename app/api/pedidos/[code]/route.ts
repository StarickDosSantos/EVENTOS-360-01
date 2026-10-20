import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const patchSchema = z.object({
  status: z
    .enum([
      "PENDENTE",
      "EM_ANALISE",
      "AGUARDANDO_RESPOSTA",
      "APROVADO",
      "REJEITADO",
      "CONCLUIDO",
      "RESERVADO",
      "ENTREGUE",
      "DEVOLVIDO",
    ])
    .optional(),
  adminNotes: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { code } = await params;
  try {
    const body = patchSchema.parse(await req.json());
    const order = await prisma.order.update({
      where: { code },
      data: {
        ...(body.status ? { status: body.status } : {}),
        ...(body.adminNotes !== undefined
          ? { adminNotes: body.adminNotes }
          : {}),
      },
    });
    return NextResponse.json({ ok: true, order });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro" }, { status: 400 });
  }
}
