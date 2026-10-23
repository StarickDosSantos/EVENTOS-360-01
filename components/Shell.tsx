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

const FALLBACK_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || "244900000000";
const FALLBACK_SITE = process.env.NEXT_PUBLIC_SITE_NAME || "EVENTOS 360";
const FALLBACK_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contacto@stands.ao";
const FALLBACK_TAGLINE =
  "Venda e aluguer de stands, quiosques e equipamentos para eventos. Produção, montagem e suporte completo.";

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [siteName, setSiteName] = useState(FALLBACK_SITE);
  const [whatsapp, setWhatsapp] = useState(FALLBACK_WHATSAPP);
  const [email, setEmail] = useState(FALLBACK_EMAIL);
  const [tagline, setTagline] = useState(FALLBACK_TAGLINE);
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

  useEffect(() => {
    fetch("/api/configuracoes")
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => {
        if (!s) return;
        if (s.siteName) setSiteName(s.siteName);
        if (s.whatsapp) setWhatsapp(s.whatsapp);
        if (s.email) setEmail(s.email);
        if (s.tagline) setTagline(s.tagline);
      })
      .catch(() => {});
  }, []);

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
              src="/logo-light.png"
              alt={siteName}
              width={120}
              height={40}
              className="h-8 w-auto object-contain dark:hidden sm:h-9"
              priority
            />
            <Image
              src="/logo-dark.png"
              alt={siteName}
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
                  title="Sair"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : null}

            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/40 text-zinc-700 md:hidden dark:border-white/10 dark:bg-white/5 dark:text-zinc-200"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </header>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden">
          <div className="absolute inset-x-3 top-20 rounded-2xl border border-white/20 bg-white p-4 shadow-2xl dark:border-white/10 dark:bg-zinc-900">
            <nav className="flex flex-col gap-1">
              {NAV.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-zinc-800 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                  {l.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-brand-600"
                >
                  Área admin
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}

      <main className="flex-1 pt-20">{children}</main>

      <footer className="mt-auto border-t border-white/10 bg-white/60 backdrop-blur-xl dark:bg-zinc-950/80">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <div className="mb-4">
              <Image
                src="/logo-light.jpeg"
                alt={siteName}
                width={140}
                height={48}
                className="h-10 w-auto object-contain dark:hidden"
              />
              <Image
                src="/logo-dark.jpeg"
                alt={siteName}
                width={140}
                height={48}
                className="hidden h-10 w-auto object-contain dark:block"
              />
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {tagline}
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Navegação</h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link
                  href="/catalogo"
                  className="transition hover:text-brand-600"
                >
                  Catálogo
                </Link>
              </li>
              <li>
                <Link
                  href="/#galeria"
                  className="transition hover:text-brand-600"
                >
                  Galeria
                </Link>
              </li>
              <li>
                <Link
                  href="/#contacto"
                  className="transition hover:text-brand-600"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Contacto</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              WhatsApp: +{whatsapp}
              <br />
              Email: {email}
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} {siteName}. Todos os direitos
          reservados.
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(
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
