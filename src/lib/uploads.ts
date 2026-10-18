import { supabase } from "@/integrations/supabase/client";

const BUCKET = "product-images";
const TEN_YEARS = 60 * 60 * 24 * 3650;

/** All catalogue and homepage spotlight images use the same 1:1 master format. */
export const PRODUCT_IMAGE_WIDTH = 1200;
export const PRODUCT_IMAGE_HEIGHT = 1200;
export const PRODUCT_IMAGE_SIZE_LABEL = "1200 × 1200 px (square, 1:1)";

/**
 * Uploads a standardized product image and returns a long-lived URL that can be stored
 * on the product row. Only the admin can write to this bucket; reads are public.
 */
export async function uploadProductImage(file: File): Promise<string> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Please choose a JPG, PNG or WebP image.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Images must be smaller than 5 MB.");
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("This image could not be opened. Please export it as JPG, PNG or WebP and try again.");
  }

  const { width, height } = bitmap;
  bitmap.close();

  if (width !== PRODUCT_IMAGE_WIDTH || height !== PRODUCT_IMAGE_HEIGHT) {
    throw new Error(
      `Image must be exactly ${PRODUCT_IMAGE_SIZE_LABEL}. Your image is ${width} × ${height} px. Resize or crop it before uploading.`,
    );
  }

  const ext = file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error("The image could not be uploaded. Please try again.");

  const { data, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, TEN_YEARS);
  if (signError || !data?.signedUrl) {
    throw new Error("The image was uploaded but the link could not be created.");
  }
  return data.signedUrl;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}
