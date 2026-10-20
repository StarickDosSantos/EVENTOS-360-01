"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";

export default function GalleryActions({
  id,
  published,
}: {
  id: string;
  published: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    await fetch(`/api/galeria/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    setLoading(false);
    router.refresh();
  }

  async function remove() {
    if (!confirm("Eliminar este projecto da galeria?")) return;
    setLoading(true);
    await fetch(`/api/galeria/${id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="mt-3 flex gap-1.5">
      <button
        type="button"
        disabled={loading}
        onClick={toggle}
        className="inline-flex h-8 items-center gap-1 rounded-lg border border-zinc-200 px-2.5 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        title={published ? "Ocultar" : "Publicar"}
      >
        {published ? <EyeOff size={13} /> : <Eye size={13} />}
        {published ? "Ocultar" : "Publicar"}
      </button>
      <Link
        href={`/admin/galeria/${id}`}
        className="inline-flex h-8 items-center gap-1 rounded-lg border border-zinc-200 px-2.5 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
      >
        <Pencil size={13} />
        Editar
      </Link>
      <button
        type="button"
        disabled={loading}
        onClick={remove}
        className="inline-flex h-8 items-center gap-1 rounded-lg border border-red-200 px-2.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}
