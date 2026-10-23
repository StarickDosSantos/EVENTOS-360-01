"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

export default function ProductActions({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function remove() {
    if (
      !confirm(
        `Eliminar o produto "${name}"?\n\nEsta acção não pode ser desfeita.`
      )
    ) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/produtos/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Erro ao eliminar o produto");
        return;
      }
      router.refresh();
    } catch {
      alert("Erro de rede ao eliminar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <Link
        href={`/admin/produtos/${id}`}
        className="inline-flex h-8 items-center gap-1 rounded-lg border border-zinc-200 px-2.5 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
      >
        <Pencil size={13} />
        Editar
      </Link>
      <button
        type="button"
        disabled={loading}
        onClick={remove}
        className="inline-flex h-8 items-center gap-1 rounded-lg border border-red-200 px-2.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:hover:bg-red-950"
        title="Eliminar produto"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}
