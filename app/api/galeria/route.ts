import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().optional().nullable(),
  category: z.string().min(1),
  coverImage: z.string().url(),
  images: z.array(z.string().url()).min(1),
  published: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  eventDate: z.string().optional().nullable(),
});

export async function GET() {
  const projects = await prisma.galleryProject.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = schema.parse(body);
    let slug = slugify(data.title);
    const existing = await prisma.galleryProject.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const project = await prisma.galleryProject.create({
      data: {
        title: data.title,
        slug,
        description: data.description || null,
        category: data.category,
        coverImage: data.coverImage,
        images: JSON.stringify(data.images),
        published: data.published ?? true,
        sortOrder: data.sortOrder ?? 0,
        eventDate: data.eventDate ? new Date(data.eventDate) : null,
      },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro ao criar";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
