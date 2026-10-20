"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatKz } from "@/lib/utils";

export default function CarrinhoPage() {
  const { items, removeItem, updateQuantity, updateDays, subtotal, clear } =
    useCartStore();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-zinc-300" />
        <h1 className="text-2xl font-bold">Carrinho vazio</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Explore o catálogo e adicione produtos.
        </p>
        <Link
          href="/catalogo"
          className="mt-6 inline-flex rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Carrinho</h1>
        <button
          type="button"
          onClick={() => clear()}
          className="text-sm text-zinc-500 hover:text-red-600"
        >
          Limpar tudo
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const days = item.days && item.priceUnit === "DIA" ? item.days : 1;
          const line = item.unitPrice * item.quantity * days;
          return (
            <div
              key={`${item.productId}-${item.modality}`}
              className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-center"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/produto/${item.slug}`}
                  className="font-semibold hover:text-brand-600"
                >
                  {item.name}
                </Link>
                <p className="text-xs text-zinc-500">
                  {item.modality === "ALUGUER" ? "Aluguer" : "Compra"} ·{" "}
                  {formatKz(item.unitPrice)}
                  {item.priceUnit === "DIA" ? "/dia" : ""}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1 rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.modality,
                          item.quantity - 1
                        )
                      }
                      className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.modality,
                          item.quantity + 1
                        )
                      }
                      className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  {item.priceUnit === "DIA" && item.modality === "ALUGUER" && (
                    <div className="flex items-center gap-1.5 text-sm">
                      <span className="text-zinc-500">Dias:</span>
                      <input
                        type="number"
                        min={1}
                        value={item.days || 1}
                        onChange={(e) =>
                          updateDays(
                            item.productId,
                            item.modality,
                            Number(e.target.value)
                          )
                        }
                        className="w-16 rounded border border-zinc-200 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                <span className="font-bold">{formatKz(line)}</span>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId, item.modality)}
                  className="text-zinc-400 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between text-lg font-bold">
          <span>Total estimado</span>
          <span className="text-brand-700 dark:text-brand-400">
            {formatKz(subtotal())}
          </span>
        </div>
        <p className="mt-1 text-xs text-zinc-500">
          Valor sujeito a confirmação. O pedido fica pendente de aprovação.
        </p>
        <Link
          href="/checkout"
          className="mt-5 flex w-full items-center justify-center rounded-full bg-brand-600 py-3.5 text-sm font-bold text-white hover:bg-brand-700"
        >
          Finalizar pedido
        </Link>
      </div>
    </div>
  );
}
