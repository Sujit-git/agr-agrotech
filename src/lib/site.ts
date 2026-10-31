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
  /** Product slugs selected for the three Our Story image positions. Stored as metadata in the existing business_description field. */
  our_story_product_slugs: string[];
};

export type CustomerReview = {
  id: string;
  name: string;
  quote: string;
  product: string | null;
  rating: number;
  sort_order: number;
  is_published: boolean;
  verified_buyer: boolean;
};

export const DEFAULT_OUR_STORY_PRODUCT_SLUGS = [
  "dehydrated-mango-cubes",
  "dehydrated-strawberry-whole",
  "dehydrated-papaya-cubes",
] as const;

const OUR_STORY_SELECTION_MARKER = "<!-- fruitly-our-story-product-slugs:";

function splitOurStorySelection(value: string | null): {
  businessDescription: string | null;
  productSlugs: string[];
} {
  const raw = value ?? "";
  const markerIndex = raw.lastIndexOf(OUR_STORY_SELECTION_MARKER);
  if (markerIndex < 0) {
    return {
      businessDescription: value,
      productSlugs: [...DEFAULT_OUR_STORY_PRODUCT_SLUGS],
    };
  }

  const markerTail = raw.slice(markerIndex + OUR_STORY_SELECTION_MARKER.length);
  const encoded = markerTail.match(/^(.+?)\s*-->/s)?.[1]?.trim();
  if (!encoded) {
    return {
      businessDescription: raw.slice(0, markerIndex).trimEnd() || null,
      productSlugs: [...DEFAULT_OUR_STORY_PRODUCT_SLUGS],
    };
  }

  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(encoded));
    const values = Array.isArray(parsed) ? parsed : [];
    const productSlugs = DEFAULT_OUR_STORY_PRODUCT_SLUGS.map((fallback, index) => {
      const candidate = values[index];
      return typeof candidate === "string" && /^[a-z0-9-]{1,80}$/.test(candidate)
        ? candidate
        : fallback;
    });
    return {
      businessDescription: raw.slice(0, markerIndex).trimEnd() || null,
      productSlugs,
    };
  } catch {
    return {
      businessDescription: raw.slice(0, markerIndex).trimEnd() || null,
      productSlugs: [...DEFAULT_OUR_STORY_PRODUCT_SLUGS],
    };
  }
}

/**
 * Persist the three Our Story product selections inside an existing text field.
 * This deliberately avoids a new table, column, migration or SQL operation.
 * The marker is hidden from all application readers by settingsQuery.
 */
export function encodeOurStoryProductSelections(
  businessDescription: string | null,
  productSlugs: string[],
): string {
  const cleanDescription = (businessDescription ?? "").replace(
    /\n*<!-- fruitly-our-story-product-slugs:[^]*? -->\s*$/,
    "",
  ).trimEnd();
  const safeSlugs = DEFAULT_OUR_STORY_PRODUCT_SLUGS.map((fallback, index) => {
    const candidate = productSlugs[index];
    return typeof candidate === "string" && /^[a-z0-9-]{1,80}$/.test(candidate)
      ? candidate
      : fallback;
  });
  const marker = `${OUR_STORY_SELECTION_MARKER}${encodeURIComponent(JSON.stringify(safeSlugs))} -->`;
  return cleanDescription ? `${cleanDescription}\n\n${marker}` : marker;
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
  our_story_product_slugs: [...DEFAULT_OUR_STORY_PRODUCT_SLUGS],
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

    const settings = data as Omit<SiteSettings, "our_story_product_slugs">;
    const storySelection = splitOurStorySelection(settings.business_description);
    return {
      ...settings,
      business_description: storySelection.businessDescription,
      our_story_product_slugs: storySelection.productSlugs,
    };
  },
};

export const customerReviewsQuery = {
  queryKey: ["customer-reviews"],
  queryFn: async (): Promise<CustomerReview[]> => {
    const { data, error } = await supabase
      .from("customer_reviews")
      .select("id,name,quote,product,rating,sort_order,is_published,verified_buyer")
      .eq("is_published", true)
      .gte("rating", 1)
      .neq("quote", "")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as CustomerReview[];
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
