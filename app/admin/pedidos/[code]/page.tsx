import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  formatKz,
  STATUS_LABELS,
  ORDER_TYPE_LABELS,
} from "@/lib/utils";
import OrderActions from "./OrderActions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPedidoDetail({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const order = await prisma.order.findUnique({
    where: { code },
    include: { items: true },
  });
  if (!order) notFound();

  const whatsappMsg = encodeURIComponent(
    `Olá, ${order.customerName}!\n\nRecebemos o seu pedido ${order.code}, referente a ${order.items.map((i) => i.productName).join(", ")}.\n\nEstamos a analisar a disponibilidade e os detalhes do seu pedido. Entraremos em contacto para confirmar as condições, o valor final e a data.\n\nObrigado pela preferência!`
  );
  const phone = order.customerPhone.replace(/\D/g, "");
  const waLink = `https://wa.me/${phone.startsWith("244") ? phone : "244" + phone}?text=${whatsappMsg}`;

  return (
    <div>
      <Link
        href="/admin/pedidos"
        className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-brand-600"
      >
        <ArrowLeft size={14} /> Voltar
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{order.code}</h1>
          <p className="text-sm text-zinc-500">
            {STATUS_LABELS[order.status]} ·{" "}
            {new Date(order.createdAt).toLocaleString("pt-AO")}
          </p>
        </div>
        <OrderActions
          code={order.code}
          status={order.status}
          waLink={waLink}
          customerEmail={order.customerEmail}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 font-semibold">Artigos</h2>
            <ul className="space-y-3">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between gap-4 border-b border-zinc-50 pb-3 last:border-0 dark:border-zinc-800"
                >
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-xs text-zinc-500">
                      {item.modality} · qty {item.quantity}
                      {item.days ? ` · ${item.days} dia(s)` : ""} ·{" "}
                      {formatKz(item.unitPrice)}
                    </p>
                  </div>
                  <span className="font-semibold">{formatKz(item.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-zinc-100 pt-3 text-lg font-bold dark:border-zinc-800">
              <span>Total estimado</span>
              <span className="text-brand-700 dark:text-brand-400">
                {formatKz(order.totalEstimated)}
              </span>
            </div>
          </section>

          {order.notes && (
            <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-2 font-semibold">Observações do cliente</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {order.notes}
              </p>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-3 font-semibold">Cliente</h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-zinc-500">Nome</dt>
                <dd className="font-medium">{order.customerName}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Telefone</dt>
                <dd className="font-medium">{order.customerPhone}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Email</dt>
                <dd className="font-medium">{order.customerEmail}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Tipo</dt>
                <dd>{ORDER_TYPE_LABELS[order.type]}</dd>
              </div>
              {order.eventDate && (
                <div>
                  <dt className="text-zinc-500">Data evento</dt>
                  <dd>
                    {new Date(order.eventDate).toLocaleDateString("pt-AO")}
                  </dd>
                </div>
              )}
              {order.location && (
                <div>
                  <dt className="text-zinc-500">Local</dt>
                  <dd>{order.location}</dd>
                </div>
              )}
            </dl>
          </section>

          {order.adminNotes && (
            <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-2 font-semibold">Notas internas</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {order.adminNotes}
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
