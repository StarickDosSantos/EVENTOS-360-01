"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  ShoppingCart,
  Menu,
  X,
  MessageCircle,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/#galeria", label: "Galeria", hash: true },
  { href: "/#contacto", label: "Contacto", hash: true },
];

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || "244900000000";
const SITE = process.env.NEXT_PUBLIC_SITE_NAME || "EVENTOS 360";

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const items = useCartStore((s) => s.items);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const isAdmin = session?.user?.role === "ADMIN";
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="mesh-bg flex min-h-screen flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Floating centered glass navbar */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4">
        <header
          className={cn(
            "pointer-events-auto glass-nav flex w-full max-w-3xl items-center gap-2 rounded-2xl px-3 py-2 transition-all duration-500 sm:gap-3 sm:rounded-full sm:px-4 sm:py-2.5",
            scrolled && "shadow-2xl shadow-black/10 dark:shadow-black/40"
          )}
        >
          {/* Logo — troca light/dark */}
          <Link href="/" className="relative flex shrink-0 items-center">
            <Image
              src="/logo-light.jpeg"
              alt={SITE}
              width={120}
              height={40}
              className="h-8 w-auto object-contain dark:hidden sm:h-9"
              priority
            />
            <Image
              src="/logo-dark.jpeg"
              alt={SITE}
              width={120}
              height={40}
              className="hidden h-8 w-auto object-contain dark:block sm:h-9"
              priority
            />
          </Link>

          {/* Nav links — desktop */}
          <nav className="hidden flex-1 items-center justify-center gap-0.5 md:flex">
            {NAV.map((l) => {
              const active =
                !l.hash &&
                (pathname === l.href || pathname?.startsWith(l.href + "/"));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-300",
                    active
                      ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                      : "text-zinc-600 hover:bg-white/50 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            <Link
              href="/carrinho"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/40 text-zinc-700 transition-all duration-300 hover:scale-105 hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
            >
              <ShoppingCart size={17} />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white shadow-md shadow-brand-600/40">
                  {totalItems}
                </span>
              )}
            </Link>
            {isAdmin ? (
              <div className="hidden items-center gap-1.5 sm:flex">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-brand-600/25 transition hover:scale-105 hover:bg-brand-500"
                >
                  <LayoutDashboard size={13} />
                  Admin
                </Link>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/40 text-zinc-600 transition hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden rounded-full border border-white/20 bg-white/40 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 sm:inline-flex"
              >
                Entrar
              </Link>
            )}
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/40 md:hidden dark:border-white/10 dark:bg-white/5"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </header>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="fixed inset-x-3 top-[4.25rem] z-40 mx-auto max-w-3xl animate-in fade-in slide-in-from-top-2 md:hidden">
          <div className="glass-strong rounded-2xl p-3 shadow-2xl">
            <nav className="flex flex-col gap-0.5">
              {NAV.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-white/50 dark:text-zinc-200 dark:hover:bg-white/10"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/carrinho"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-white/50 dark:text-zinc-200"
              >
                Carrinho ({totalItems})
              </Link>
              {isAdmin ? (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-brand-600"
                >
                  Painel Admin
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium"
                >
                  Entrar
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Spacer for fixed nav */}
      <div className="h-16 sm:h-[4.5rem]" />

      <main className="flex-1">{children}</main>

      <footer className="relative mt-8 border-t border-white/10 bg-white/40 backdrop-blur-xl dark:bg-zinc-950/60">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
          <div>
            <div className="mb-3">
              <Image
                src="/logo-light.jpeg"
                alt={SITE}
                width={140}
                height={48}
                className="h-10 w-auto object-contain dark:hidden"
              />
              <Image
                src="/logo-dark.jpeg"
                alt={SITE}
                width={140}
                height={48}
                className="hidden h-10 w-auto object-contain dark:block"
              />
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Venda e aluguer de stands, quiosques e equipamentos para eventos.
              Produção, montagem e suporte completo.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Navegação</h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/catalogo" className="transition hover:text-brand-600">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/#galeria" className="transition hover:text-brand-600">
                  Galeria
                </Link>
              </li>
              <li>
                <Link href="/#contacto" className="transition hover:text-brand-600">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Contacto</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              WhatsApp: +{WHATSAPP}
              <br />
              Email: {process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contacto@stands.ao"}
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} {SITE}. Todos os direitos reservados.
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
          "Olá! Gostaria de saber mais sobre stands e equipamentos."
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/40 transition-all duration-300 hover:scale-110 hover:bg-green-600 hover:shadow-xl"
        aria-label="WhatsApp"
      >
        <MessageCircle size={26} />
      </a>
    </div>
  );
}
