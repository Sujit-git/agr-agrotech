-- Roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Categories
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are publicly readable" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Products
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  short_description text,
  description text,
  price numeric(10,2),
  currency text NOT NULL DEFAULT 'INR',
  unit text,
  image_url text,
  additional_images text[] NOT NULL DEFAULT '{}',
  availability text NOT NULL DEFAULT 'available',
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  key_features text[] NOT NULL DEFAULT '{}',
  storage_information text,
  usage_information text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are publicly readable" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX products_category_idx ON public.products(category_id);

-- Site settings (single row)
CREATE TABLE public.site_settings (
  id boolean PRIMARY KEY DEFAULT true,
  brand_name text NOT NULL DEFAULT 'AGR',
  business_description text,
  email text,
  phone text,
  whatsapp text,
  address text,
  instagram text,
  facebook text,
  site_url text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_singleton CHECK (id)
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings are publicly readable" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Contact messages
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send a message" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins read messages" ON public.contact_messages FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete messages" ON public.contact_messages FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Seed data
INSERT INTO public.site_settings (id, brand_name, business_description, email, phone, whatsapp, address, instagram, facebook, site_url)
VALUES (true, 'AGR', 'AGR — Agrotech brings thoughtfully processed agricultural and natural products from Indian farms.', 'agrotech@agr.com', '9860256598', '919860256598', '[Add AGR address here]', '', '', '');

INSERT INTO public.categories (name, slug, description, sort_order) VALUES
  ('Vermicompost', 'vermicompost', 'Natural organic compost for healthy soil and sustainable agriculture.', 1),
  ('Dehydrated Fruits', 'dehydrated-fruits', 'Naturally preserved fruits with reduced moisture and extended shelf life.', 2),
  ('Freeze-Dried Fruits', 'freeze-dried-fruits', 'Lightweight, naturally preserved fruits retaining much of their original taste and texture.', 3);

INSERT INTO public.products (name, slug, category_id, short_description, description, price, unit, availability, featured, sort_order, key_features, storage_information, usage_information)
VALUES
  ('AGR Premium Vermicompost', 'agr-premium-vermicompost',
    (SELECT id FROM public.categories WHERE slug = 'vermicompost'),
    'Rich, crumbly compost for healthier soil and stronger plants.',
    'AGR Premium Vermicompost is produced through controlled composting to create a fine, crumbly soil conditioner suitable for gardens, terrace plants and field crops. [Add detailed product description here]',
    299, '5 kg', 'available', true, 1,
    ARRAY['Fine, crumbly texture','Suitable for pots, terrace gardens and fields','Improves soil structure','Easy to handle and apply'],
    'Store in a cool, dry place away from direct sunlight. Keep the pack sealed after use.',
    'Mix with soil before planting, or top-dress around existing plants. [Add recommended quantity here]'),
  ('Dehydrated Mango Slices', 'dehydrated-mango-slices',
    (SELECT id FROM public.categories WHERE slug = 'dehydrated-fruits'),
    'Sun-ripened mango, gently dried into soft, chewy slices.',
    'Dehydrated mango slices made by reducing moisture from ripe mango under controlled conditions. [Add detailed product description here]',
    249, '100 g', 'available', true, 2,
    ARRAY['Soft, chewy texture','Reduced moisture for longer shelf life','Convenient resealable pack'],
    'Store in a cool, dry place. Reseal the pack after opening.',
    'Enjoy as a snack or add to cereals, desserts and baking.'),
  ('Freeze-Dried Strawberry', 'freeze-dried-strawberry',
    (SELECT id FROM public.categories WHERE slug = 'freeze-dried-fruits'),
    'Light, crisp strawberry pieces that keep their natural colour.',
    'Freeze-dried strawberry retains much of the original taste, colour and shape of the fresh fruit. [Add detailed product description here]',
    399, '50 g', 'available', true, 3,
    ARRAY['Light and crisp','Retains natural colour','Long shelf life without refrigeration'],
    'Store in a cool, dry place. Reseal immediately after opening to avoid moisture.',
    'Eat straight from the pack, or add to breakfast bowls, shakes and desserts.'),
  ('Freeze-Dried Pineapple', 'freeze-dried-pineapple',
    (SELECT id FROM public.categories WHERE slug = 'freeze-dried-fruits'),
    'Crisp pineapple pieces with a bright, tangy character.',
    'Freeze-dried pineapple chunks with an airy, crisp texture. [Add detailed product description here]',
    379, '50 g', 'coming_soon', false, 4,
    ARRAY['Airy, crisp texture','No refrigeration needed'],
    'Store in a cool, dry place.',
    'Great as a snack or a topping for yoghurt and cereals.');