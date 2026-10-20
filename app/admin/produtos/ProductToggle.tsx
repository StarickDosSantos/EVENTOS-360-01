"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductToggle({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const published = status === "PUBLISHED";

  async function toggle() {
    setLoading(true);
    await fetch(`/api/produtos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: published ? "HIDDEN" : "PUBLISHED",
      }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        published
          ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
      }`}
    >
      {published ? "Publicado" : "Oculto"}
    </button>
  );
}
