import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSiteSettings, saveSiteSettings } from "@/lib/site-settings";
import { z } from "zod";

/** Público — footer, WhatsApp flutuante, secção de contacto. */
export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(settings, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

const updateSchema = z.object({
  siteName: z.string().min(2).max(80),
  tagline: z.string().min(5).max(300),
  whatsapp: z
    .string()
    .min(9)
    .max(20)
    .regex(/^[0-9]+$/, "WhatsApp só com dígitos (ex: 244900000000)"),
  email: z.string().email(),
  phone: z.string().max(30).optional().nullable(),
  address: z.string().max(200).optional().nullable(),
  instagram: z.string().max(120).optional().nullable(),
  facebook: z.string().max(200).optional().nullable(),
});

/** Admin — actualiza contactos e informações do site. */
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = updateSchema.parse(body);
    const settings = await saveSiteSettings({
      siteName: data.siteName,
      tagline: data.tagline,
      whatsapp: data.whatsapp,
      email: data.email,
      phone: data.phone ?? null,
      address: data.address ?? null,
      instagram: data.instagram ?? null,
      facebook: data.facebook ?? null,
    });
    return NextResponse.json(settings);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.errors[0]?.message || "Dados inválidos" },
        { status: 400 }
      );
    }
    console.error("[configuracoes PUT]", err);
    return NextResponse.json({ error: "Erro ao guardar" }, { status: 500 });
  }
}
