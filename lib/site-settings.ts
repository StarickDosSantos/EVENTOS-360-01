import { promises as fs } from "fs";
import path from "path";

export type PublicSiteSettings = {
  siteName: string;
  tagline: string;
  whatsapp: string;
  email: string;
  phone: string | null;
  address: string | null;
  instagram: string | null;
  facebook: string | null;
};

const DEFAULTS: PublicSiteSettings = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || "EVENTOS 360",
  tagline:
    "Venda e aluguer de stands, quiosques e equipamentos para eventos. Produção, montagem e suporte completo.",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "244900000000",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contacto@stands.ao",
  phone: null,
  address: null,
  instagram: null,
  facebook: null,
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "site-settings.json");

async function ensureFile(): Promise<PublicSiteSettings> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<PublicSiteSettings>;
    return {
      siteName: parsed.siteName || DEFAULTS.siteName,
      tagline: parsed.tagline || DEFAULTS.tagline,
      whatsapp: parsed.whatsapp || DEFAULTS.whatsapp,
      email: parsed.email || DEFAULTS.email,
      phone: parsed.phone ?? null,
      address: parsed.address ?? null,
      instagram: parsed.instagram ?? null,
      facebook: parsed.facebook ?? null,
    };
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULTS, null, 2), "utf8");
    return { ...DEFAULTS };
  }
}

/** Lê as definições do site (cria ficheiro default se ainda não existir). */
export async function getSiteSettings(): Promise<PublicSiteSettings> {
  try {
    return await ensureFile();
  } catch (e) {
    console.error("[site-settings] get", e);
    return { ...DEFAULTS };
  }
}

/** Guarda as definições (usado pela API admin). */
export async function saveSiteSettings(
  data: PublicSiteSettings
): Promise<PublicSiteSettings> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const cleaned: PublicSiteSettings = {
    siteName: data.siteName.trim() || DEFAULTS.siteName,
    tagline: data.tagline.trim() || DEFAULTS.tagline,
    whatsapp: data.whatsapp.replace(/\s+/g, "") || DEFAULTS.whatsapp,
    email: data.email.trim().toLowerCase() || DEFAULTS.email,
    phone: data.phone?.trim() || null,
    address: data.address?.trim() || null,
    instagram: data.instagram?.trim() || null,
    facebook: data.facebook?.trim() || null,
  };
  await fs.writeFile(DATA_FILE, JSON.stringify(cleaned, null, 2), "utf8");
  return cleaned;
}
