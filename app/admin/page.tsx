import { prisma } from "@/lib/prisma";
import { formatKz, STATUS_LABELS } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

type RecentOrder = {
  id: string;
  code: string;
  customerName: string;
  status: string;
  totalEstimated: number;
  createdAt: Date;
};

export default async function AdminDashboard() {
  let total = 0;
  let pendentes = 0;
  let aprovados = 0;
  let rejeitados = 0;
  let recent: RecentOrder[] = [];
  let totalEstimated = 0;
  let dbError: string | null = null;

  try {
    const [t, p, a, r, rec, sumAgg] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDENTE" } }),
      prisma.order.count({ where: { status: "APROVADO" } }),
      prisma.order.count({ where: { status: "REJEITADO" } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          code: true,
          customerName: true,
          status: true,
          totalEstimated: true,
          createdAt: true,
        },
      }),
      prisma.order.aggregate({ _sum: { totalEstimated: true } }),
    ]);
    total = t;
    pendentes = p;
    aprovados = a;
    rejeitados = r;
    recent = rec;
    totalEstimated = sumAgg._sum.totalEstimated || 0;
  } catch (e) {
    console.error("[admin/dashboard] DB error:", e);
    dbError =
      e instanceof Error
        ? e.message
        : "Não foi possível ligar à base de dados.";
  }

  const cards = [
    { label: "Total pedidos", value: total, color: "text-zinc-900 dark:text-white" },
    { label: "Pendentes", value: pendentes, color: "text-amber-600" },
    { label: "Aprovados", value: aprovados, color: "text-green-600" },
    { label: "Rejeitados", value: rejeitados, color: "text-red-600" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      {dbError && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          <p className="font-semibold">Base de dados inacessível</p>
          <p className="mt-1 break-all opacity-90">{dbError}</p>
          <p className="mt-2 text-xs opacity-75">
            Verifica o DATABASE_URL no .env (projecto Neon activo,{" "}
            <code>sslmode=require</code>, remove{" "}
            <code>channel_binding</code> se falhar). Depois:{" "}
            <code>npx prisma db push</code>
          </p>
        </div>
      )}

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
          {formatKz(totalEstimated)}
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
                    className="border-b border-zinc-50 dark:border-zinc-800/50"
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
                      {STATUS_LABELS[o.status] || o.status}
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
