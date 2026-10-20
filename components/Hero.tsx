"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Sparkles, Play } from "lucide-react";

const FLOATING = [
  {
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
    className: "left-[8%] top-[18%] h-28 w-40 sm:h-36 sm:w-52",
    delay: "0s",
    depth: 0.15,
  },
  {
    src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80",
    className: "right-[6%] top-[22%] h-24 w-36 sm:h-32 sm:w-48",
    delay: "0.4s",
    depth: 0.25,
  },
  {
    src: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80",
    className: "bottom-[18%] left-[12%] h-24 w-36 sm:h-28 sm:w-44",
    delay: "0.8s",
    depth: 0.2,
  },
  {
    src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80",
    className: "bottom-[14%] right-[10%] h-28 w-40 sm:h-36 sm:w-52",
    delay: "1.2s",
    depth: 0.3,
  },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function onMove(e: React.MouseEvent) {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setOffset({ x, y });
  }

  function onLeave() {
    setOffset({ x: 0, y: 0 });
  }

  const parallaxBg = scrollY * 0.35;

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative min-h-[92vh] overflow-hidden"
    >
      {/* Base gradient + animated mesh */}
      <div
        className="absolute inset-0 bg-[#050a18]"
        style={{ transform: `translateY(${parallaxBg * 0.3}px)` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-950 via-[#0a1628] to-zinc-950" />

      {/* Animated orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-32 top-1/4 h-[28rem] w-[28rem] rounded-full bg-brand-600/30 blur-[100px] transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${offset.x * -40}px, ${offset.y * -30 + parallaxBg * 0.15}px)`,
          }}
        />
        <div
          className="absolute -right-24 top-1/3 h-[24rem] w-[24rem] rounded-full bg-cyan-500/20 blur-[90px] transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${offset.x * 50}px, ${offset.y * 20 + parallaxBg * 0.1}px)`,
          }}
        />
        <div
          className="absolute bottom-0 left-1/2 h-[20rem] w-[40rem] -translate-x-1/2 rounded-full bg-brand-500/15 blur-[80px]"
          style={{ transform: `translateX(-50%) translateY(${parallaxBg * 0.2}px)` }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            transform: `translateY(${parallaxBg * 0.5}px)`,
          }}
        />
        {/* Scan line shimmer */}
        <div className="hero-shimmer absolute inset-0 opacity-30" />
      </div>

      {/* Floating photo cards with parallax */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {FLOATING.map((item, i) => (
          <div
            key={i}
            className={`absolute overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-black/50 transition-transform duration-500 ease-out ${item.className} ${
              ready ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transform: `translate(${offset.x * item.depth * -80}px, ${
                offset.y * item.depth * -60 + parallaxBg * item.depth
              }px) rotate(${offset.x * item.depth * 6}deg)`,
              transitionDelay: item.delay,
              animation: ready ? `heroFloat ${6 + i}s ease-in-out infinite` : undefined,
              animationDelay: item.delay,
            }}
          >
            <Image src={item.src} alt="" fill className="object-cover" sizes="200px" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-6xl flex-col items-center justify-center px-4 py-28 text-center sm:px-6">
        <div
          className={`transition-all duration-1000 ${
            ready ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-200 backdrop-blur-xl">
            <Sparkles size={14} className="text-brand-400" />
            Venda · Aluguer · Produção
          </div>
        </div>

        <h1
          className={`max-w-4xl text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl transition-all duration-1000 delay-150 ${
            ready ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          Experiências de evento
          <span className="relative mt-1 block bg-gradient-to-r from-brand-300 via-cyan-300 to-brand-400 bg-clip-text text-transparent">
            que ficam na memória
          </span>
        </h1>

        <p
          className={`mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg transition-all duration-1000 delay-300 ${
            ready ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          Stands, quiosques e equipamentos premium. Do projecto à montagem —
          escolha no catálogo, envie o pedido e a nossa equipa confirma tudo consigo.
        </p>

        <div
          className={`mt-10 flex flex-wrap items-center justify-center gap-4 transition-all duration-1000 delay-500 ${
            ready ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <Link
            href="/catalogo"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-7 py-3.5 text-sm font-bold text-brand-900 shadow-xl shadow-white/10 transition hover:scale-[1.03] active:scale-[0.98]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-brand-100 to-white opacity-0 transition group-hover:opacity-100" />
            <span className="relative">Explorar catálogo</span>
            <ArrowRight size={18} className="relative transition group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/#galeria"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition hover:scale-[1.03] hover:bg-white/10 active:scale-[0.98]"
          >
            <Play size={16} className="fill-current" />
            Ver trabalhos
          </Link>
        </div>

        {/* Stats strip */}
        <div
          className={`mt-16 grid w-full max-w-xl grid-cols-3 gap-4 transition-all duration-1000 delay-700 ${
            ready ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {[
            { n: "150+", l: "Eventos" },
            { n: "40+", l: "Produtos" },
            { n: "24h", l: "Resposta" },
          ].map((s) => (
            <div
              key={s.l}
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4 backdrop-blur-md"
            >
              <div className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{s.n}</div>
              <div className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-zinc-50 to-transparent dark:from-zinc-950" />
    </section>
  );
}
