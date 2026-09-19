import { supabase } from "@/integrations/supabase/client";

import vermicompost from "@/assets/product-vermicompost.jpg";
import mango from "@/assets/product-dehydrated-mango.jpg";
import strawberry from "@/assets/product-freeze-dried-strawberry.jpg";
import pineapple from "@/assets/product-freeze-dried-pineapple.jpg";

export type Availability = "available" | "out_of_stock" | "coming_soon";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  short_description: string | null;
  description: string | null;
  price: number | null;
  currency: string;
  unit: string | null;
  image_url: string | null;
  additional_images: string[];
  availability: string;
  featured: boolean;
  sort_order: number;
  key_features: string[];
  storage_information: string | null;
  usage_information: string | null;
  created_at: string;
  updated_at: string;
};

/** Placeholder photography used until the admin uploads real product images. */
const seedImages: Record<string, string> = {
  "agr-premium-vermicompost": vermicompost,
  "dehydrated-mango-slices": mango,
  "freeze-dried-strawberry": strawberry,
  "freeze-dried-pineapple": pineapple,
};

export function productImage(product: Pick<Product, "slug" | "image_url">): string | null {
  return product.image_url || seedImages[product.slug] || null;
}

export const availabilityLabels: Record<Availability, string> = {
  available: "Available",
  out_of_stock: "Out of Stock",
  coming_soon: "Coming Soon",
};

export function availabilityLabel(value: string): string {
  return availabilityLabels[value as Availability] ?? value;
}

export function formatPrice(price: number | null, currency = "INR"): string {
  if (price == null) return "Price on request";
  const symbol = currency === "INR" ? "\u20b9" : `${currency} `;
  return `${symbol}${Number(price).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export const categoriesQuery = {
  queryKey: ["categories"],
  queryFn: async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from("categories")
      .select("id,name,slug,description,image_url,sort_order")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Category[];
  },
};

export const productsQuery = {
  queryKey: ["products"],
  queryFn: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Product[];
  },
};
