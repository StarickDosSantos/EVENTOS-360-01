"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ImageUpload, { MultiImageUpload } from "@/components/ImageUpload";

const CATEGORIES = ["Feiras", "Corporativo", "Festas", "Concertos", "Exposições", "Outros"];

export default function NovoGaleriaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Feiras");
  const [coverImage, setCoverImage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [published, setPublished] = useState(true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const imgs = images.filter(Boolean);
    const cover = coverImage.trim() || imgs[0];
    if (!cover || imgs.length === 0) {
      setError("Faça upload de pelo menos uma foto");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/galeria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || null,
          category,
          coverImage: cover,
          images: imgs.length ? imgs : [cover],
          published,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro");
      router.push("/admin/galeria");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao criar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/galeria"
        className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-brand-600"
      >
        <ArrowLeft size={14} /> Voltar
      </Link>
      <h1 className="mb-6 text-2xl font-bold">Novo projecto na galeria</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium">Título *</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ex: FILDA 2026"
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Categoria *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-zinc-700 dark:bg-zinc-800"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Breve descrição do trabalho realizado..."
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>

        <ImageUpload
          label="Imagem de capa *"
          value={coverImage}
          onChange={setCoverImage}
          folder="eventos360/galeria"
        />

        <MultiImageUpload
          label="Fotos do projecto *"
          values={images}
          onChange={setImages}
          folder="eventos360/galeria"
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="rounded border-zinc-300"
          />
          Publicado (visível no site)
        </label>
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brand-600 py-3 text-sm font-bold text-white shadow-md shadow-brand-600/25 transition hover:bg-brand-500 disabled:opacity-60"
        >
          {loading ? "A guardar..." : "Criar projecto"}
        </button>
      </form>
    </div>
  );
}
