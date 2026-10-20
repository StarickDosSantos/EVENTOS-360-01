import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional().nullable(),
  category: z.string().min(1).optional(),
  coverImage: z.string().url().optional(),
  images: z.array(z.string().url()).min(1).optional(),
  published: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  eventDate: z.string().optional().nullable(),
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
    const body = await req.json();
    const data = schema.parse(body);

    const update: {
      title?: string;
      slug?: string;
      description?: string | null;
      category?: string;
      coverImage?: string;
      images?: string;
      published?: boolean;
      sortOrder?: number;
      eventDate?: Date | null;
    } = {};

    if (data.title !== undefined) {
      update.title = data.title;
      update.slug = slugify(data.title);
    }
    if (data.description !== undefined) update.description = data.description;
    if (data.category !== undefined) update.category = data.category;
    if (data.coverImage !== undefined) update.coverImage = data.coverImage;
    if (data.images !== undefined) update.images = JSON.stringify(data.images);
    if (data.published !== undefined) update.published = data.published;
    if (data.sortOrder !== undefined) update.sortOrder = data.sortOrder;
    if (data.eventDate !== undefined) {
      update.eventDate = data.eventDate ? new Date(data.eventDate) : null;
    }

    const project = await prisma.galleryProject.update({
      where: { id },
      data: update,
    });
    return NextResponse.json(project);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro ao actualizar";
    return NextResponse.json({ error: msg }, { status: 400 });
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
  await prisma.galleryProject.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
