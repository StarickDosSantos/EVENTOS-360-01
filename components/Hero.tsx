
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  MessageCircle,
  Sparkles,
  Box,
  Layers3,
  CalendarCheck,
} from "lucide-react";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const services = [
  { icon: Box, label: "Stands personalizados" },
  { icon: Layers3, label: "Quiosques e tendas" },
  { icon: CalendarCheck, label: "Aluguer e montagem" },
];

export default function Hero() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="relative isolate flex min-h-[90svh] flex-col justify-center overflow-hidden bg-[#fafbfe] px-5 py-24 text-zinc-950 transition-colors duration-500 dark:bg-[#080b12] dark:text-white sm:px-8 lg:px-12">
      {/* Fundo subtil */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(59,130,246,0.10),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_50%_0%,rgba(59,130,246,0.16),transparent_55%)]" />

        <div className="absolute -right-40 top-24 h-96 w-96 rounded-full bg-blue-400/[0.08] blur-[100px] dark:bg-blue-500/[0.10]" />

        <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-brand-500/[0.08] blur-[100px]" />

        <div className="absolute inset-0 opacity-[0.025] [background-image:linear-gradient(to_right,#64748b_1px,transparent_1px),linear-gradient(to_bottom,#64748b_1px,transparent_1px)] [background-size:64px_64px] dark:opacity-[0.045]" />
      </div>

      <div className="mx-auto w-full max-w-7xl">
        {/* Etiqueta superior */}
        <div
          className={`mb-8 flex justify-center transition-all duration-700 ${
            ready ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="inline-flex items-center gap-2.5 rounded-full border border-blue-200/80 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.19em] text-blue-700 shadow-sm shadow-blue-950/[0.03] backdrop-blur-xl dark:border-blue-400/20 dark:bg-white/[0.04] dark:text-blue-300">
            <Sparkles size={14} />
            <span>Soluções para eventos</span>
            <span className="h-1 w-1 rounded-full bg-blue-500" />
            <span className="tracking-normal">360°</span>
          </div>
        </div>

        {/* Título principal — Manrope */}
        <div className="mx-auto max-w-5xl text-center">
          <h1
            className={`${manrope.className} text-balance text-[clamp(3rem,7vw,6.5rem)] font-semibold leading-[1.02] tracking-[-0.055em] transition-all duration-1000 ${
              ready ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            Damos forma
            <br />
            às suas{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent dark:from-blue-400 dark:via-sky-400 dark:to-cyan-300">
                ideias.
              </span>

              <svg
                aria-hidden="true"
                viewBox="0 0 240 12"
                className="absolute -bottom-2 left-0 h-2 w-full text-blue-500/50"
                fill="none"
              >
                <path
                  d="M3 8C65 2 165 2 237 7"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p
            className={`mx-auto mt-8 max-w-2xl text-pretty text-base leading-7 text-zinc-600 transition-all delay-150 duration-1000 dark:text-zinc-400 sm:text-lg sm:leading-8 ${
              ready ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            }`}
          >
            Stands, quiosques, tendas e equipamentos para eventos.
            Tratamos da produção, do aluguer e da montagem para que
            se possa concentrar no que realmente importa.
          </p>

          {/* Botões */}
          <div
            className={`mt-9 flex flex-col items-stretch justify-center gap-3 transition-all delay-300 duration-1000 sm:flex-row sm:items-center ${
              ready ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            }`}
          >
            <Link
              href="/catalogo"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-blue-600 px-7 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-600/25 active:translate-y-0 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              Explorar catálogo
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/#contacto"
              className="group inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full border border-zinc-200 bg-white/70 px-7 text-sm font-semibold text-zinc-800 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-100 dark:hover:border-blue-400/40 dark:hover:bg-white/[0.08]"
            >
              <MessageCircle
                size={17}
                className="text-blue-600 dark:text-blue-400"
              />
              Pedir orçamento
            </Link>
          </div>
        </div>

        {/* Serviços */}
        <div
          className={`mx-auto mt-20 max-w-5xl transition-all delay-500 duration-1000 sm:mt-24 ${
            ready ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <div className="h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent dark:via-white/15" />

          <div className="grid grid-cols-1 divide-y divide-zinc-200/80 dark:divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {services.map(({ icon: Icon, label }, index) => (
              <div
                key={label}
                className="group flex items-center justify-between gap-4 px-4 py-5 sm:justify-center sm:px-5 sm:py-7"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 transition duration-300 group-hover:scale-105 group-hover:bg-blue-100 dark:border-blue-400/15 dark:bg-blue-400/[0.08] dark:text-blue-400 dark:group-hover:bg-blue-400/[0.15]">
                    <Icon size={19} strokeWidth={1.7} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      {label}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                      {index === 0
                        ? "Feitos à sua medida"
                        : index === 1
                          ? "Flexibilidade para cada ocasião"
                          : "Do início ao fim"}
                    </p>
                  </div>
                </div>

                <ArrowDownRight
                  size={16}
                  className="text-zinc-400 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue-500 sm:hidden"
                />
              </div>
            ))}
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent dark:via-white/15" />
        </div>

        {/* Assinatura */}
        <p
          className={`mt-7 text-center text-[10px] font-medium uppercase tracking-[0.25em] text-zinc-400 transition-opacity delay-700 duration-1000 dark:text-zinc-600 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          Cada detalhe conta.
        </p>
      </div>
    </section>
  );
}
