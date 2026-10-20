"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

export default function NovoProdutoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/produtos", {
        method: "POST",
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
      setLoading(false);
    }
  }

  function field(
    key: keyof typeof form,
    label: string,
    opts?: { type?: string; required?: boolean }
  ) {
    return (
      <div>
        <label className="mb-1.5 block text-sm font-medium">{label}</label>
        <input
          type={opts?.type || "text"}
          required={opts?.required}
          value={String(form[key] ?? "")}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              [key]:
                opts?.type === "checkbox"
                  ? (e.target as HTMLInputElement).checked
                  : e.target.value,
            }))
          }
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Novo produto</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        {field("name", "Nome *", { required: true })}
        {field("shortDesc", "Descrição curta")}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Descrição *
          </label>
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
            <label className="mb-1.5 block text-sm font-medium">Modalidade</label>
            <select
              value={form.modality}
              onChange={(e) =>
                setForm((f) => ({ ...f, modality: e.target.value }))
              }
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
            >
              <option value="VENDA">Venda</option>
              <option value="ALUGUER">Aluguer</option>
              <option value="AMBAS">Ambas</option>
            </select>
          </div>
          {field("price", "Preço (Kz) *", { type: "number", required: true })}
          {field("priceSale", "Preço compra (se ambas)")}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Unidade de preço
            </label>
            <select
              value={form.priceUnit}
              onChange={(e) =>
                setForm((f) => ({ ...f, priceUnit: e.target.value }))
              }
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
            >
              <option value="UNIDADE">Unidade</option>
              <option value="DIA">Por dia</option>
              <option value="EVENTO">Por evento</option>
              <option value="MONTAGEM">Montagem</option>
            </select>
          </div>
          {field("stock", "Stock", { type: "number" })}
        </div>
        <ImageUpload
          label="Imagem do produto"
          value={form.image}
          onChange={(url) => setForm((f) => ({ ...f, image: url }))}
          folder="eventos360/produtos"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) =>
              setForm((f) => ({ ...f, featured: e.target.checked }))
            }
          />
          Destacar na homepage
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Criar produto
        </button>
      </form>
    </div>
  );
}
