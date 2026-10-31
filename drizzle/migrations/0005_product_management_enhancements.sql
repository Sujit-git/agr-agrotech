-- Fruitly product management enhancements
-- Adds product compare-at pricing, spotlight controls for categories,
-- and reusable preset/custom product tags.

ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS original_price numeric(10,2),
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';

ALTER TABLE public.products
  ADD CONSTRAINT products_original_price_nonnegative
  CHECK (original_price IS NULL OR original_price >= 0);

CREATE TABLE IF NOT EXISTS public.product_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  is_preset boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 100,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT product_tags_name_not_blank CHECK (char_length(btrim(name)) BETWEEN 1 AND 48),
  CONSTRAINT product_tags_slug_not_blank CHECK (char_length(btrim(slug)) BETWEEN 1 AND 64)
);

CREATE INDEX IF NOT EXISTS product_tags_active_order_idx
  ON public.product_tags (is_active, sort_order, name);

DROP TRIGGER IF EXISTS product_tags_updated_at ON public.product_tags;
CREATE TRIGGER product_tags_updated_at
  BEFORE UPDATE ON public.product_tags
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.product_tags (name, slug, is_preset, is_active, sort_order)
VALUES
  ('New Arrival', 'new-arrival', true, true, 1),
  ('Best Seller', 'best-seller', true, true, 2),
  ('Highly Ordered', 'highly-ordered', true, true, 3),
  ('Customer Favourite', 'customer-favourite', true, true, 4),
  ('Trending', 'trending', true, true, 5),
  ('Limited Edition', 'limited-edition', true, true, 6)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    is_preset = true,
    is_active = true,
    sort_order = EXCLUDED.sort_order;

ALTER TABLE public.product_tags ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.product_tags TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.product_tags TO authenticated;
GRANT ALL ON public.product_tags TO service_role;

DROP POLICY IF EXISTS "Product tags are publicly readable" ON public.product_tags;
CREATE POLICY "Product tags are publicly readable" ON public.product_tags
  FOR SELECT TO anon, authenticated
  USING (is_active OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins create custom product tags" ON public.product_tags;
CREATE POLICY "Admins create custom product tags" ON public.product_tags
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND is_preset = false);

DROP POLICY IF EXISTS "Admins update custom product tags" ON public.product_tags;
CREATE POLICY "Admins update custom product tags" ON public.product_tags
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') AND is_preset = false)
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND is_preset = false);

DROP POLICY IF EXISTS "Admins delete custom product tags" ON public.product_tags;
CREATE POLICY "Admins delete custom product tags" ON public.product_tags
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') AND is_preset = false);

CREATE OR REPLACE FUNCTION public.remove_deleted_product_tag()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.products
  SET tags = array_remove(tags, OLD.slug)
  WHERE OLD.slug = ANY(tags);
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS product_tags_remove_assignments ON public.product_tags;
CREATE TRIGGER product_tags_remove_assignments
  AFTER DELETE ON public.product_tags
  FOR EACH ROW EXECUTE FUNCTION public.remove_deleted_product_tag();

COMMENT ON COLUMN public.categories.featured IS
  'When enabled, products in this category are eligible for the homepage spotlight.';
COMMENT ON COLUMN public.products.featured IS
  'When enabled, this product is eligible for the homepage spotlight.';
COMMENT ON COLUMN public.products.original_price IS
  'Optional compare-at price. Displayed only when greater than the selling price stored in price.';
COMMENT ON COLUMN public.products.tags IS
  'Array of product_tags.slug values assigned to this product.';
