"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

type Props = {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  className?: string;
};

export default function ImageUpload({
  value,
  onChange,
  folder = "eventos360",
  label = "Imagem",
  className = "",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Só imagens (JPG, PNG, WebP…)");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Máximo 8 MB");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha no upload");
      onChange(data.url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro no upload");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      {value ? (
        <div className="relative aspect-video overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
          <Image src={value} alt="Preview" fill className="object-cover" sizes="400px" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
            aria-label="Remover"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={loading}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
          className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 text-zinc-500 transition hover:border-brand-400 hover:bg-brand-50/50 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-brand-500"
        >
          {loading ? (
            <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
          ) : (
            <>
              <ImageIcon className="h-8 w-8 opacity-40" />
              <span className="flex items-center gap-1.5 text-sm font-medium">
                <Upload size={14} /> Arraste ou clique para enviar
              </span>
              <span className="text-xs text-zinc-400">JPG, PNG, WebP · máx. 8 MB</span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      {value && (
        <p className="mt-1 truncate text-xs text-zinc-400" title={value}>
          {value}
        </p>
      )}
    </div>
  );
}

type MultiProps = {
  values: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  label?: string;
};

export function MultiImageUpload({
  values,
  onChange,
  folder = "eventos360/galeria",
  label = "Fotos",
}: MultiProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) {
      setError("Só imagens");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const uploaded: string[] = [];
      for (const file of list) {
        const form = new FormData();
        form.append("file", file);
        form.append("folder", folder);
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Falha no upload");
        uploaded.push(data.url);
      }
      onChange([...values, ...uploaded]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro no upload");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {values.map((url, i) => (
          <div
            key={`${url}-${i}`}
            className="relative aspect-square overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700"
          >
            <Image src={url} alt="" fill className="object-cover" sizes="120px" />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <button
          type="button"
          disabled={loading}
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-zinc-300 text-zinc-400 transition hover:border-brand-400 hover:text-brand-600 dark:border-zinc-700"
        >
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <Upload size={18} />
              <span className="text-[10px] font-medium">Upload</span>
            </>
          )}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
