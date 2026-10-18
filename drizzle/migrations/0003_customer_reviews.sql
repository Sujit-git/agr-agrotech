-- Admin-managed customer feedback. Drafts stay private until a real quote is approved.
CREATE TABLE public.customer_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  quote text NOT NULL DEFAULT '',
  product text,
  rating integer NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  is_published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.customer_reviews TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.customer_reviews TO authenticated;
GRANT ALL ON public.customer_reviews TO service_role;
ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published customer reviews are publicly readable"
  ON public.customer_reviews
  FOR SELECT TO anon, authenticated
  USING (
    is_published = true
    AND char_length(btrim(quote)) >= 8
    AND rating BETWEEN 1 AND 5
  );

CREATE POLICY "Admins manage customer reviews"
  ON public.customer_reviews
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER customer_reviews_updated_at
  BEFORE UPDATE ON public.customer_reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed customer names as unpublished drafts. The admin must enter approved review text
-- and the customer's actual rating before publishing; no testimonials are fabricated.
INSERT INTO public.customer_reviews (name, quote, product, rating, is_published, sort_order)
VALUES
  ('Hemant Mali', '', NULL, 0, false, 1),
  ('Sujit Khopade', '', NULL, 0, false, 2),
  ('Samarth Kadam', '', NULL, 0, false, 3),
  ('Satyawan Raskar', '', NULL, 0, false, 4),
  ('Amarjeet Singh', '', NULL, 0, false, 5),
  ('Prajwal Dhonde', '', NULL, 0, false, 6),
  ('Prathamesh Nikam', '', NULL, 0, false, 7),
  ('Sandesh Borate', '', NULL, 0, false, 8);
