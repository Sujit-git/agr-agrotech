import { supabase } from "@/integrations/supabase/client";

const BUCKET = "product-images";
const TEN_YEARS = 60 * 60 * 24 * 3650;

/** All catalogue and homepage spotlight images use the same 2:3 portrait master format. */
export const PRODUCT_IMAGE_WIDTH = 1024;
export const PRODUCT_IMAGE_HEIGHT = 1536;
export const PRODUCT_IMAGE_SIZE_LABEL = "1024 × 1536 px (portrait, 2:3)";

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

  if (width !== PRODUCT_IMAGE_WIDTH || height !== PRODUCT_IMAGE_HEIGHT) {
    bitmap.close();
    throw new Error(
      `Image must be exactly ${PRODUCT_IMAGE_SIZE_LABEL}. Your image is ${width} × ${height} px. Resize or crop it before uploading.`,
    );
  }

  // Re-encode the validated master at high quality to WebP. This keeps the
  // 1024 × 1536 artwork sharp while reducing transfer size for storefronts.
  const canvas = document.createElement("canvas");
  canvas.width = PRODUCT_IMAGE_WIDTH;
  canvas.height = PRODUCT_IMAGE_HEIGHT;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("This browser could not prepare the image. Please try another browser.");
  }
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(bitmap, 0, 0, PRODUCT_IMAGE_WIDTH, PRODUCT_IMAGE_HEIGHT);
  bitmap.close();

  let optimized: Blob;
  try {
    optimized = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Image optimization failed."))),
        "image/webp",
        0.94,
      );
    });
  } catch {
    throw new Error("The image could not be optimized. Please export it as WebP and try again.");
  }
  if (optimized.size > 5 * 1024 * 1024) {
    throw new Error("The optimized image is still larger than 5 MB. Please export a smaller WebP file.");
  }

  const path = `${crypto.randomUUID()}.webp`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, optimized, {
    contentType: "image/webp",
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
