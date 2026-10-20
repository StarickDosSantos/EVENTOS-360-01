"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function EditProdutoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    shortDesc: "",
    category: "ALUGUER",
    modality: "ALUGUER",
    price: "",
    priceSale: "",
    priceUnit: "UNIDADE",
    stock: "1",
    image: "",
    featured: false,
    status: "PUBLISHED",
  });

  useEffect(() => {
    fetch(`/api/produtos/${id}`)
      .then((r) => r.json())
      .then((p) => {
        if (p.error) throw new Error(p.error);
        setForm({
          name: p.name,
          description: p.description,
          shortDesc: p.shortDesc || "",
          category: p.category,
          modality: p.modality,
          price: String(p.price),
          priceSale: p.priceSale != null ? String(p.priceSale) : "",
          priceUnit: p.priceUnit,
          stock: String(p.stock),
          image: p.image || "",
          featured: p.featured,
          status: p.status,
        });
      })
      .catch(() => setError("Produto não encontrado"))
      .finally(() => setLoading(false));
  }, [id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/produtos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          priceSale: form.priceSale ? Number(form.priceSale) : null,
          stock: Number(form.stock),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro");
      router.push("/admin/produtos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Editar produto</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Nome *</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Descrição *</label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Preço *</label>
            <input
              type="number"
              required
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: e.target.value }))
              }
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Stock</label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) =>
                setForm((f) => ({ ...f, stock: e.target.value }))
              }
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Categoria</label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
            >
              <option value="PRODUCAO">Produção</option>
              <option value="ALUGUER">Aluguer</option>
              <option value="PACOTE">Pacote</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Estado</label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.value }))
              }
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
            >
              <option value="PUBLISHED">Publicado</option>
              <option value="HIDDEN">Oculto</option>
              <option value="UNAVAILABLE">Indisponível</option>
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">URL imagem</label>
          <input
            value={form.image}
            onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Guardar
        </button>
      </form>
    </div>
  );
}
