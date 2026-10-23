"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, CheckCircle2 } from "lucide-react";

type FormState = {
  siteName: string;
  tagline: string;
  whatsapp: string;
  email: string;
  phone: string;
  address: string;
  instagram: string;
  facebook: string;
};

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [form, setForm] = useState<FormState>({
    siteName: "",
    tagline: "",
    whatsapp: "",
    email: "",
    phone: "",
    address: "",
    instagram: "",
    facebook: "",
  });

  useEffect(() => {
    fetch("/api/configuracoes")
      .then((r) => r.json())
      .then((s) => {
        setForm({
          siteName: s.siteName || "",
          tagline: s.tagline || "",
          whatsapp: s.whatsapp || "",
          email: s.email || "",
          phone: s.phone || "",
          address: s.address || "",
          instagram: s.instagram || "",
          facebook: s.facebook || "",
        });
      })
      .catch(() => setError("Não foi possível carregar as configurações"))
      .finally(() => setLoading(false));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setOk(false);
    try {
      const res = await fetch("/api/configuracoes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName: form.siteName,
          tagline: form.tagline,
          whatsapp: form.whatsapp.replace(/\D/g, ""),
          email: form.email,
          phone: form.phone || null,
          address: form.address || null,
          instagram: form.instagram || null,
          facebook: form.facebook || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao guardar");
      setForm({
        siteName: data.siteName,
        tagline: data.tagline,
        whatsapp: data.whatsapp,
        email: data.email,
        phone: data.phone || "",
        address: data.address || "",
        instagram: data.instagram || "",
        facebook: data.facebook || "",
      });
      setOk(true);
      setTimeout(() => setOk(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setSaving(false);
    }
  }

  function set(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-2xl font-bold">Configurações do site</h1>
      <p className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">
        Altere o nome, contactos e informações que aparecem no site público
        (footer, secção de contacto e botão do WhatsApp).
      </p>

      <form onSubmit={onSubmit} className="space-y-6">
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Informações do site
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Nome do site *
              </label>
              <input
                required
                value={form.siteName}
                onChange={(e) => set("siteName", e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-600 dark:bg-zinc-950"
                placeholder="EVENTOS 360"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Descrição / slogan *
              </label>
              <textarea
                required
                rows={3}
                value={form.tagline}
                onChange={(e) => set("tagline", e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-600 dark:bg-zinc-950"
                placeholder="Venda e aluguer de stands..."
              />
              <p className="mt-1 text-xs text-zinc-500">
                Aparece no rodapé do site.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Contactos
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                WhatsApp *{" "}
                <span className="font-normal text-zinc-500">
                  (só números, com indicativo)
                </span>
              </label>
              <input
                required
                value={form.whatsapp}
                onChange={(e) => set("whatsapp", e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-600 dark:bg-zinc-950"
                placeholder="244900000000"
              />
              <p className="mt-1 text-xs text-zinc-500">
                Ex.: 244923456789 — usado no botão flutuante e nos links wa.me
              </p>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-600 dark:bg-zinc-950"
                placeholder="contacto@stands.ao"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Telefone{" "}
                <span className="font-normal text-zinc-500">(opcional)</span>
              </label>
              <input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-600 dark:bg-zinc-950"
                placeholder="+244 900 000 000"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Morada{" "}
                <span className="font-normal text-zinc-500">(opcional)</span>
              </label>
              <input
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-600 dark:bg-zinc-950"
                placeholder="Luanda, Angola"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Redes sociais{" "}
            <span className="font-normal normal-case">(opcional)</span>
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Instagram
              </label>
              <input
                value={form.instagram}
                onChange={(e) => set("instagram", e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-600 dark:bg-zinc-950"
                placeholder="@eventos360 ou URL"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Facebook</label>
              <input
                value={form.facebook}
                onChange={(e) => set("facebook", e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-zinc-600 dark:bg-zinc-950"
                placeholder="https://facebook.com/..."
              />
            </div>
          </div>
        </section>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </p>
        )}
        {ok && (
          <p className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-400">
            <CheckCircle2 size={16} />
            Configurações guardadas. O site público reflecte as alterações.
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Guardar alterações
        </button>
      </form>
    </div>
  );
}
