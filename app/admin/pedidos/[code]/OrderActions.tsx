"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MessageCircle, Loader2 } from "lucide-react";

const ACTIONS = [
  { status: "EM_ANALISE", label: "Em análise", color: "bg-blue-600" },
  { status: "APROVADO", label: "Aceitar", color: "bg-green-600" },
  { status: "AGUARDANDO_RESPOSTA", label: "Pedir esclarecimentos", color: "bg-purple-600" },
  { status: "REJEITADO", label: "Rejeitar", color: "bg-red-600" },
  { status: "CONCLUIDO", label: "Concluir", color: "bg-zinc-700" },
];

export default function OrderActions({
  code,
  status,
  waLink,
  customerEmail,
}: {
  code: string;
  status: string;
  waLink: string;
  customerEmail: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  async function updateStatus(newStatus: string) {
    setLoading(newStatus);
    try {
      const res = await fetch(`/api/pedidos/${code}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, adminNotes: notes || undefined }),
      });
      if (!res.ok) throw new Error("Falha");
      router.refresh();
    } catch {
      alert("Erro ao actualizar estado");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {ACTIONS.filter((a) => a.status !== status).map((a) => (
          <button
            key={a.status}
            type="button"
            disabled={!!loading}
            onClick={() => updateStatus(a.status)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold text-white ${a.color} disabled:opacity-50`}
          >
            {loading === a.status && (
              <Loader2 className="h-3 w-3 animate-spin" />
            )}
            {a.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-green-500 px-3.5 py-2 text-xs font-bold text-white hover:bg-green-600"
        >
          <MessageCircle size={14} />
          Contactar WhatsApp
        </a>
        <a
          href={`mailto:${customerEmail}?subject=Pedido%20${code}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 px-3.5 py-2 text-xs font-semibold dark:border-zinc-600"
        >
          Enviar e-mail
        </a>
      </div>
      <textarea
        placeholder="Notas internas (opcional, guardadas ao mudar estado)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        className="w-full max-w-md rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900"
      />
    </div>
  );
}
