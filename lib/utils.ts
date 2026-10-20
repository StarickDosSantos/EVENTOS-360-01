import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKz(value: number): string {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPriceLabel(
  price: number,
  unit: string,
  priceSale?: number | null
): string {
  const base = formatKz(price);
  if (priceSale) {
    return `${formatKz(price)} (alug.) / ${formatKz(priceSale)} (compra)`;
  }
  switch (unit) {
    case "DIA":
      return `${base}/dia`;
    case "EVENTO":
      return `${base}/evento`;
    case "MONTAGEM":
      return `${base}/montagem`;
    default:
      return base;
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function generateOrderCode(seq: number): string {
  const year = new Date().getFullYear();
  return `PED-${year}-${String(seq).padStart(4, "0")}`;
}

export const CATEGORY_LABELS: Record<string, string> = {
  PRODUCAO: "Produção",
  ALUGUER: "Aluguer",
  PACOTE: "Pacotes",
};

export const MODALITY_LABELS: Record<string, string> = {
  VENDA: "Venda",
  ALUGUER: "Aluguer",
  AMBAS: "Venda e Aluguer",
};

export const STATUS_LABELS: Record<string, string> = {
  PENDENTE: "Pendente",
  EM_ANALISE: "Em análise",
  AGUARDANDO_RESPOSTA: "A aguardar resposta",
  APROVADO: "Aprovado",
  REJEITADO: "Rejeitado",
  CONCLUIDO: "Concluído",
  RESERVADO: "Reservado",
  ENTREGUE: "Entregue",
  DEVOLVIDO: "Devolvido",
};

export const ORDER_TYPE_LABELS: Record<string, string> = {
  COMPRA: "Compra de produtos",
  ALUGUER: "Aluguer de equipamentos",
  PRODUCAO: "Produção e montagem personalizada",
};
