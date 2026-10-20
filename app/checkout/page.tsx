"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { formatKz, ORDER_TYPE_LABELS } from "@/lib/utils";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ code: string } | null>(null);

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    type: "ALUGUER" as "COMPRA" | "ALUGUER" | "PRODUCAO",
    eventDate: "",
    location: "",
    notes: "",
  });

  if (items.length === 0 && !success) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Carrinho vazio</h1>
        <Link href="/catalogo" className="mt-4 inline-block text-brand-600 underline">
          Voltar ao catálogo
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
        <h1 className="text-2xl font-bold">Pedido enviado!</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          O seu pedido <strong>{success.code}</strong> foi recebido e está{" "}
          <strong>pendente de aprovação</strong>. Entraremos em contacto em
          breve para confirmar disponibilidade e valores.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/catalogo"
            className="rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white"
          >
            Continuar a explorar
          </Link>
          <Link
            href="/"
            className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold dark:border-zinc-600"
          >
            Página inicial
          </Link>
        </div>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.productId,
            productName: i.name,
            productSlug: i.slug,
            quantity: i.quantity,
            days: i.days,
            unitPrice: i.unitPrice,
            modality: i.modality,
            priceUnit: i.priceUnit,
            lineTotal:
              i.unitPrice *
              i.quantity *
              (i.days && i.priceUnit === "DIA" ? i.days : 1),
          })),
          totalEstimated: subtotal(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao enviar pedido");
      clear();
      setSuccess({ code: data.code });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Finalizar pedido</h1>
      <p className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">
        O envio do formulário cria um pedido <strong>pendente de aprovação</strong>.
        Não confirma reserva nem pagamento automaticamente.
      </p>

      <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-3 font-semibold">Resumo do carrinho</h2>
        <ul className="space-y-2 text-sm">
          {items.map((i) => {
            const days = i.days && i.priceUnit === "DIA" ? i.days : 1;
            return (
              <li
                key={`${i.productId}-${i.modality}`}
                className="flex justify-between gap-4"
              >
                <span>
                  {i.name} × {i.quantity}
                  {i.priceUnit === "DIA" ? ` · ${days} dia(s)` : ""}{" "}
                  <span className="text-zinc-400">
                    ({i.modality === "ALUGUER" ? "Aluguer" : "Compra"})
                  </span>
                </span>
                <span className="font-medium">
                  {formatKz(i.unitPrice * i.quantity * days)}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="mt-3 flex justify-between border-t border-zinc-100 pt-3 font-bold dark:border-zinc-800">
          <span>Total estimado</span>
          <span className="text-brand-700 dark:text-brand-400">
            {formatKz(subtotal())}
          </span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">
              Nome completo *
            </label>
            <input
              required
              value={form.customerName}
              onChange={(e) =>
                setForm((f) => ({ ...f, customerName: e.target.value }))
              }
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-600 dark:bg-zinc-900"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Telefone / WhatsApp *
            </label>
            <input
              required
              type="tel"
              value={form.customerPhone}
              onChange={(e) =>
                setForm((f) => ({ ...f, customerPhone: e.target.value }))
              }
              placeholder="9XX XXX XXX"
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-600 dark:bg-zinc-900"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">E-mail *</label>
            <input
              required
              type="email"
              value={form.customerEmail}
              onChange={(e) =>
                setForm((f) => ({ ...f, customerEmail: e.target.value }))
              }
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-600 dark:bg-zinc-900"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Tipo de pedido *
            </label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  type: e.target.value as typeof form.type,
                }))
              }
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-zinc-600 dark:bg-zinc-900"
            >
              {Object.entries(ORDER_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Data do evento / entrega
            </label>
            <input
              type="date"
              value={form.eventDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, eventDate: e.target.value }))
              }
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-zinc-600 dark:bg-zinc-900"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">
              Local do evento / montagem
            </label>
            <input
              value={form.location}
              onChange={(e) =>
                setForm((f) => ({ ...f, location: e.target.value }))
              }
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-zinc-600 dark:bg-zinc-900"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">
              Observações adicionais
            </label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-zinc-600 dark:bg-zinc-900"
            />
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-3.5 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> A enviar...
            </>
          ) : (
            "Enviar pedido para aprovação"
          )}
        </button>
      </form>
    </div>
  );
}
