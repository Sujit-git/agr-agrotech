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

/** Single source of truth used before the database settings load. */
export const fallbackSettings: SiteSettings = {
  brand_name: "AGR",
  business_description:
    "AGR \u2014 Agrotech brings thoughtfully processed agricultural and natural products from Indian farms.",
  email: "agrotech@agr.com",
  phone: "9860256598",
  whatsapp: "919860256598",
  address: "[Add AGR address here]",
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
    return (data as SiteSettings) ?? fallbackSettings;
  },
};

export function whatsappLink(number: string | null | undefined, message: string): string {
  const digits = (number || fallbackSettings.whatsapp || "").replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function telLink(phone: string | null | undefined): string {
  return `tel:${(phone || "").replace(/[^\d+]/g, "")}`;
}
