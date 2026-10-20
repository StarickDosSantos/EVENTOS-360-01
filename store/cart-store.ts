"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image?: string | null;
  unitPrice: number;
  priceUnit: string;
  modality: "VENDA" | "ALUGUER";
  quantity: number;
  days?: number; // only for ALUGUER with DIA unit
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, modality: string) => void;
  updateQuantity: (productId: string, modality: string, quantity: number) => void;
  updateDays: (productId: string, modality: string, days: number) => void;
  clear: () => void;
  totalItems: () => number;
  subtotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const key = `${item.productId}-${item.modality}`;
          const existing = state.items.find(
            (i) => `${i.productId}-${i.modality}` === key
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                `${i.productId}-${i.modality}` === key
                  ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                ...item,
                quantity: item.quantity || 1,
                days: item.days ?? (item.priceUnit === "DIA" ? 1 : undefined),
              },
            ],
          };
        });
      },
      removeItem: (productId, modality) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.modality === modality)
          ),
        }));
      },
      updateQuantity: (productId, modality, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId, modality);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.modality === modality
              ? { ...i, quantity }
              : i
          ),
        }));
      },
      updateDays: (productId, modality, days) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.modality === modality
              ? { ...i, days: Math.max(1, days) }
              : i
          ),
        }));
      },
      clear: () => set({ items: [] }),
      totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((s, i) => {
          const days = i.days && i.priceUnit === "DIA" ? i.days : 1;
          return s + i.unitPrice * i.quantity * days;
        }, 0),
    }),
    { name: "stands-cart" }
  )
);
