"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const FILTERS = [
  { value: "", label: "Todos" },
  { value: "PRODUCAO", label: "Produção" },
  { value: "ALUGUER", label: "Aluguer" },
  { value: "PACOTE", label: "Pacotes" },
];

export default function CatalogFilters({
  current,
  query,
}: {
  current?: string;
  query?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(query || "");

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (current) params.set("categoria", current);
    if (q.trim()) params.set("q", q.trim());
    router.push(`/catalogo?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = (current || "") === f.value;
          const href =
            f.value === ""
              ? q
                ? `/catalogo?q=${encodeURIComponent(q)}`
                : "/catalogo"
              : `/catalogo?categoria=${f.value}${q ? `&q=${encodeURIComponent(q)}` : ""}`;
          return (
            <Link
              key={f.value}
              href={href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                active
                  ? "bg-brand-600 text-white"
                  : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
              )}
            >
              {f.label}
            </Link>
          );
        })}
      </div>
      <form onSubmit={onSearch} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Pesquisar produtos..."
          className="w-full rounded-full border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-700 dark:bg-zinc-900 sm:w-64"
        />
      </form>
    </div>
  );
}
