-- Fruitly launch catalogue: five dehydrated fruit products only.
-- Apply this one-time cleanup to the connected database after reviewing the target catalogue.
-- Existing stale seeded products and their image_url/additional_images references are removed.
-- Admin product and category management remains enabled for new entries after this migration.

INSERT INTO public.categories (name, slug, description, image_url, sort_order)
VALUES (
  'Dehydrated Fruits',
  'dehydrated-fruits',
  'Fruitly''s launch collection of dehydrated fruit in 50 g pouches.',
  NULL,
  1
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = NULL,
  sort_order = 1,
  updated_at = now();

-- Remove the legacy placeholder catalogue entries before removing their category rows.
DELETE FROM public.products
WHERE slug NOT IN (
  'dehydrated-strawberry-whole',
  'dehydrated-lemon-slices',
  'dehydrated-mango-cubes',
  'dehydrated-jamun-cubes',
  'dehydrated-papaya-cubes'
);

-- Remove the original non-fruit/demo categories. Admins may create categories at any time afterwards.
DELETE FROM public.categories
WHERE slug IN (
  'vermicompost',
  'organic-fertilizer',
  'organic-fertiliser',
  'organic-fertilizers',
  'organic-fertilisers',
  'freeze-dried-fruits',
  'freeze-dried-fruit',
  'freeze-dried'
)
OR lower(name) IN (
  'vermicompost',
  'organic fertilizer',
  'organic fertiliser',
  'organic fertilizers',
  'organic fertilisers',
  'freeze-dried fruits',
  'freeze dried fruits'
);

-- Current Fruitly launch lineup. Prices remain NULL so the public catalogue says "Price on request"
-- until a consumer-facing price/MRP is confirmed.
INSERT INTO public.products (
  name, slug, category_id, short_description, description,
  price, currency, unit, image_url, additional_images, availability,
  featured, sort_order, key_features, storage_information, usage_information
)
VALUES
(
  'Dehydrated Strawberry Whole',
  'dehydrated-strawberry-whole',
  (SELECT id FROM public.categories WHERE slug = 'dehydrated-fruits'),
  'Dehydrated strawberry in a 50 g Fruitly pouch.',
  'Dehydrated strawberry. This recipe may contain added sugar for preservation; check the current pack label for ingredients and nutrition.',
  NULL, 'INR', '50 g', '/fruitly-products/dehydrated-strawberry-whole.webp', ARRAY[]::text[],
  'available', true, 1,
  ARRAY['50 g pouch', 'Dehydrated strawberry', 'Check the pack for ingredients and nutrition'],
  'Keep sealed and store in a cool, dry place away from direct sunlight. Follow the pack instructions.',
  'Enjoy as packed or use as a topping. Follow the pack instructions.'
),
(
  'Dehydrated Lemon Slices',
  'dehydrated-lemon-slices',
  (SELECT id FROM public.categories WHERE slug = 'dehydrated-fruits'),
  'Dehydrated lemon slices with tangy masala in a 50 g Fruitly pouch.',
  'Dehydrated lemon slices with tangy masala. Added sugar is used for preservation; check the current pack label for ingredients and nutrition.',
  NULL, 'INR', '50 g', '/fruitly-products/dehydrated-lemon-slices.webp', ARRAY[]::text[],
  'available', true, 2,
  ARRAY['50 g pouch', 'Tangy masala seasoning', 'Contains added sugar for preservation'],
  'Keep sealed and store in a cool, dry place away from direct sunlight. Follow the pack instructions.',
  'Enjoy as packed. Follow the pack instructions.'
),
(
  'Dehydrated Mango Cubes',
  'dehydrated-mango-cubes',
  (SELECT id FROM public.categories WHERE slug = 'dehydrated-fruits'),
  'Dehydrated mango cubes in a 50 g Fruitly pouch.',
  'Dehydrated mango cubes. Check the current pack label for ingredients and nutrition information.',
  NULL, 'INR', '50 g', '/fruitly-products/dehydrated-mango-cubes.webp', ARRAY[]::text[],
  'available', true, 3,
  ARRAY['50 g pouch', 'Dehydrated mango cubes', 'Check the pack for ingredients and nutrition'],
  'Keep sealed and store in a cool, dry place away from direct sunlight. Follow the pack instructions.',
  'Enjoy as packed or add to recipes. Follow the pack instructions.'
),
(
  'Dehydrated Jamun Cubes',
  'dehydrated-jamun-cubes',
  (SELECT id FROM public.categories WHERE slug = 'dehydrated-fruits'),
  'Dehydrated jamun cubes in a 50 g Fruitly pouch.',
  'Dehydrated jamun cubes. Check the current pack label for ingredients and nutrition information.',
  NULL, 'INR', '50 g', '/fruitly-products/dehydrated-jamun-cubes.webp', ARRAY[]::text[],
  'available', true, 4,
  ARRAY['50 g pouch', 'Dehydrated jamun cubes', 'Check the pack for ingredients and nutrition'],
  'Keep sealed and store in a cool, dry place away from direct sunlight. Follow the pack instructions.',
  'Enjoy as packed. Follow the pack instructions.'
),
(
  'Dehydrated Papaya Cubes',
  'dehydrated-papaya-cubes',
  (SELECT id FROM public.categories WHERE slug = 'dehydrated-fruits'),
  'Dehydrated papaya cubes in a 50 g Fruitly pouch.',
  'Dehydrated papaya cubes. This recipe may contain added sugar for preservation; check the current pack label for ingredients and nutrition.',
  NULL, 'INR', '50 g', '/fruitly-products/dehydrated-papaya-cubes.webp', ARRAY[]::text[],
  'available', true, 5,
  ARRAY['50 g pouch', 'Dehydrated papaya cubes', 'Check the pack for ingredients and nutrition'],
  'Keep sealed and store in a cool, dry place away from direct sunlight. Follow the pack instructions.',
  'Enjoy as packed. Follow the pack instructions.'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  currency = EXCLUDED.currency,
  unit = EXCLUDED.unit,
  image_url = EXCLUDED.image_url,
  additional_images = EXCLUDED.additional_images,
  availability = EXCLUDED.availability,
  featured = EXCLUDED.featured,
  sort_order = EXCLUDED.sort_order,
  key_features = EXCLUDED.key_features,
  storage_information = EXCLUDED.storage_information,
  usage_information = EXCLUDED.usage_information,
  updated_at = now();

UPDATE public.categories
SET image_url = NULL, updated_at = now()
WHERE slug = 'dehydrated-fruits';
