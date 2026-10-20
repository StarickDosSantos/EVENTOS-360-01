"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, X } from "lucide-react";

const CATEGORIES = ["Feiras", "Corporativo", "Festas", "Concertos", "Exposições", "Outros"];

export default function EditGaleriaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Feiras");
  const [coverImage, setCoverImage] = useState("");
  const [images, setImages] = useState<string[]>([""]);
  const [published, setPublished] = useState(true);

  useEffect(() => {
    fetch("/api/galeria")
      .then((r) => r.json())
      .then((list: Array<{
        id: string;
        title: string;
        description: string | null;
        category: string;
        coverImage: string;
        images: string;
        published: boolean;
      }>) => {
        const p = list.find((x) => x.id === id);
        if (!p) {
          setError("Projecto não encontrado");
          setFetching(false);
          return;
        }
        setTitle(p.title);
        setDescription(p.description || "");
        setCategory(p.category);
        setCoverImage(p.coverImage);
        try {
          const imgs = JSON.parse(p.images || "[]");
          setImages(imgs.length ? imgs : [""]);
        } catch {
          setImages([p.coverImage || ""]);
        }
        setPublished(p.published);
        setFetching(false);
      })
      .catch(() => {
        setError("Erro ao carregar");
        setFetching(false);
      });
  }, [id]);

  function updateImage(i: number, val: string) {
    setImages((prev) => prev.map((x, idx) => (idx === i ? val : x)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const imgs = images.map((u) => u.trim()).filter(Boolean);
    const cover = coverImage.trim() || imgs[0];
    try {
      const res = await fetch(`/api/galeria/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || null,
          category,
          coverImage: cover,
          images: imgs,
          published,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro");
      router.push("/admin/galeria");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return <p className="text-sm text-zinc-500">A carregar...</p>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/galeria"
        className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-brand-600"
      >
        <ArrowLeft size={14} /> Voltar
      </Link>
      <h1 className="mb-6 text-2xl font-bold">Editar projecto</h1>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Título *</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Categoria *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800"
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
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Capa (URL)</label>
          <input
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Fotos (URLs)</label>
          <div className="space-y-2">
            {images.map((url, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={url}
                  onChange={(e) => updateImage(i, e.target.value)}
                  className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                />
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setImages((p) => p.filter((_, idx) => idx !== i))}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-zinc-400 hover:text-red-500 dark:border-zinc-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setImages((p) => [...p, ""])}
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand-600"
          >
            <Plus size={14} /> Adicionar foto
          </button>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="rounded"
          />
          Publicado
        </label>
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brand-600 py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {loading ? "A guardar..." : "Guardar alterações"}
        </button>
      </form>
    </div>
  );
}
