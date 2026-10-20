import { prisma } from "@/lib/prisma";
import { formatKz, STATUS_LABELS } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [total, pendentes, aprovados, rejeitados, recent, sumAgg] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDENTE" } }),
      prisma.order.count({ where: { status: "APROVADO" } }),
      prisma.order.count({ where: { status: "REJEITADO" } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { items: true },
      }),
      prisma.order.aggregate({ _sum: { totalEstimated: true } }),
    ]);

  const cards = [
    { label: "Total pedidos", value: total, color: "text-zinc-900 dark:text-white" },
    { label: "Pendentes", value: pendentes, color: "text-amber-600" },
    { label: "Aprovados", value: aprovados, color: "text-green-600" },
    { label: "Rejeitados", value: rejeitados, color: "text-red-600" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-sm text-zinc-500">{c.label}</p>
            <p className={`mt-1 text-3xl font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-500">Valor estimado total das encomendas</p>
        <p className="mt-1 text-2xl font-bold text-brand-700 dark:text-brand-400">
          {formatKz(sumAgg._sum.totalEstimated || 0)}
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
          <h2 className="font-semibold">Pedidos recentes</h2>
          <Link
            href="/admin/pedidos"
            className="text-sm font-medium text-brand-600 hover:underline"
          >
            Ver todos
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-100 text-xs uppercase text-zinc-500 dark:border-zinc-800">
              <tr>
                <th className="px-5 py-3">Código</th>
                <th className="px-5 py-3">Cliente</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-zinc-500">
                    Ainda não há pedidos
                  </td>
                </tr>
              ) : (
                recent.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-zinc-50 hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/30"
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/pedidos/${o.code}`}
                        className="font-medium text-brand-600 hover:underline"
                      >
                        {o.code}
                      </Link>
                    </td>
                    <td className="px-5 py-3">{o.customerName}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-5 py-3">{formatKz(o.totalEstimated)}</td>
                    <td className="px-5 py-3 text-zinc-500">
                      {new Date(o.createdAt).toLocaleDateString("pt-AO")}
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

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDENTE: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    EM_ANALISE: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
    AGUARDANDO_RESPOSTA:
      "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
    APROVADO: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
    REJEITADO: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
    CONCLUIDO: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        colors[status] || colors.PENDENTE
      }`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}
