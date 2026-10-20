"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

type Product = {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  price: number;
  priceSale?: number | null;
  priceUnit: string;
  modality: string;
  minDays?: number | null;
};

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [modality, setModality] = useState<"VENDA" | "ALUGUER">(
    product.modality === "VENDA" ? "VENDA" : "ALUGUER"
  );
  const [qty, setQty] = useState(1);
  const [days, setDays] = useState(product.minDays || 1);
  const [added, setAdded] = useState(false);

  const showModalityChoice = product.modality === "AMBAS";
  const unitPrice =
    modality === "VENDA" && product.priceSale
      ? product.priceSale
      : product.price;

  function handleAdd() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      unitPrice,
      priceUnit: product.priceUnit,
      modality,
      quantity: qty,
      days: product.priceUnit === "DIA" ? days : undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-900/50">
      {showModalityChoice && (
        <div>
          <label className="mb-1.5 block text-sm font-medium">Modalidade</label>
          <div className="flex gap-2">
            {(["ALUGUER", "VENDA"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setModality(m)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  modality === m
                    ? "bg-brand-600 text-white"
                    : "border border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-800"
                }`}
              >
                {m === "ALUGUER" ? "Aluguer" : "Compra"}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Quantidade</label>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
            className="w-24 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
          />
        </div>
        {product.priceUnit === "DIA" && modality === "ALUGUER" && (
          <div>
            <label className="mb-1.5 block text-sm font-medium">Dias</label>
            <input
              type="number"
              min={product.minDays || 1}
              value={days}
              onChange={(e) =>
                setDays(Math.max(product.minDays || 1, Number(e.target.value)))
              }
              className="w-24 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white transition sm:w-auto ${
          added ? "bg-green-600" : "bg-brand-600 hover:bg-brand-700"
        }`}
      >
        <ShoppingCart size={18} />
        {added ? "Adicionado ao carrinho!" : "Adicionar ao carrinho"}
      </button>
    </div>
  );
}
