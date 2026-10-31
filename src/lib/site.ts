import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  brand_name: string;
  business_description: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  instagram: string | null;
  facebook: string | null;
  site_url: string | null;
};

const OUR_STORY_SELECTION_MARKER = "<!-- fruitly-our-story-product-slugs:";

/**
 * Strip metadata left by the retired Admin image selectors so it never appears
 * in the business description. Our Story now uses static, versioned site assets.
 */
function cleanBusinessDescription(value: string | null): string | null {
  if (!value) return value;
  const markerIndex = value.lastIndexOf(OUR_STORY_SELECTION_MARKER);
  if (markerIndex < 0) return value;
  return value.slice(0, markerIndex).trimEnd() || null;
}

/** Single source of truth used before the database settings load. */
export const fallbackSettings: SiteSettings = {
  brand_name: "Fruitly",
  business_description:
    "Fruitly brings together a fruit-first range of dehydrated and freeze-dried fruits. Pure. Fresh. Natural.",
  email: "agragrotech@gmail.com",
  phone: "7758055691 / 9423861690",
  whatsapp: "917758055691",
  address: "Gat No. 89, Jadhavnagar,\nPhaltan-Upalve Road,\nTahasil Phaltan, District Satara, Maharashtra, India. Pin code - 415523",
  instagram: "",
  facebook: "",
  site_url: "",
};

export const settingsQuery = {
  queryKey: ["site-settings"],
  queryFn: async (): Promise<SiteSettings> => {
    const { data, error } = await supabase
      .from("site_settings")
      .select(
        "brand_name,business_description,email,phone,whatsapp,address,instagram,facebook,site_url",
      )
      .maybeSingle();
    if (error) throw error;
    if (!data) return fallbackSettings;

    const settings = data as SiteSettings;
    return {
      ...settings,
      business_description: cleanBusinessDescription(settings.business_description),
    };
  },
};

export function buildProductUrl(siteUrl: string | null | undefined, slug: string): string {
  const fallbackOrigin = typeof window !== "undefined" ? window.location.origin : "https://fruitly.co.in";
  const configured = siteUrl?.trim() || fallbackOrigin;
  const base = /^https?:\/\//i.test(configured) ? configured : `https://${configured}`;

  try {
    return new URL(`/product/${encodeURIComponent(slug)}`, base).toString();
  } catch {
    return `${fallbackOrigin.replace(/\/+$/, "")}/product/${encodeURIComponent(slug)}`;
  }
}

export function whatsappLink(number: string | null | undefined, message: string): string {
  const digits = (number || fallbackSettings.whatsapp || "").replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function telLink(phone: string | null | undefined): string {
  return `tel:${(phone || "").replace(/[^\d+]/g, "")}`;
}

export function phoneNumbers(phone: string | null | undefined): string[] {
  return (phone || "").split(/\s*\/\s*/).map((number) => number.trim()).filter(Boolean);
}
