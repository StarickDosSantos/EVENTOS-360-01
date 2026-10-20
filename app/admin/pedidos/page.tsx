import { prisma } from "@/lib/prisma";
import { formatKz, STATUS_LABELS, ORDER_TYPE_LABELS } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const status = sp.status;

  const where = status
    ? { status: status as "PENDENTE" | "APROVADO" | "REJEITADO" | "EM_ANALISE" }
    : {};

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  const filters = [
    { value: "", label: "Todos" },
    { value: "PENDENTE", label: "Pendentes" },
    { value: "EM_ANALISE", label: "Em análise" },
    { value: "APROVADO", label: "Aprovados" },
    { value: "REJEITADO", label: "Rejeitados" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Pedidos</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f.value}
            href={f.value ? `/admin/pedidos?status=${f.value}` : "/admin/pedidos"}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${
              (status || "") === f.value
                ? "bg-brand-600 text-white"
                : "border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-100 text-xs uppercase text-zinc-500 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Itens</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-zinc-500">
                    Nenhum pedido
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-zinc-50 hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/30"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/pedidos/${o.code}`}
                        className="font-medium text-brand-600 hover:underline"
                      >
                        {o.code}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div>{o.customerName}</div>
                      <div className="text-xs text-zinc-500">{o.customerPhone}</div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {ORDER_TYPE_LABELS[o.type] || o.type}
                    </td>
                    <td className="px-4 py-3">{o.items.length}</td>
                    <td className="px-4 py-3 font-medium">
                      {formatKz(o.totalEstimated)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold">
                        {STATUS_LABELS[o.status] || o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
                      {new Date(o.createdAt).toLocaleString("pt-AO")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
