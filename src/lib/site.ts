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
  brand_name: "AGR Agrotech",
  business_description:
    "From agriculture to nutrition, naturally. AGR Agrotech develops sustainable agricultural inputs, preserved fruits, and plant-based nutrition ingredients.",
  email: "agragrotech@gmail.com",
  phone: "7758055691 / 9423861690",
  whatsapp: "917758055691",
  address: "AGR AGROTECH PVT. LTD.\nGSTN: 27ABECA3291P1Z6\nGat No. 89, Jadhav Nagar,\nPhaltan–Uplave Road,\nTahasil Phaltan, District Satara, Maharashtra, India. Pin code – 412355",
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

export function phoneNumbers(phone: string | null | undefined): string[] {
  return (phone || "").split(/\s*\/\s*/).map((number) => number.trim()).filter(Boolean);
}
