DROP POLICY IF EXISTS "Settings are publicly readable" ON public.site_settings;
CREATE POLICY "Settings are publicly readable" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (id = true);

DROP POLICY IF EXISTS "Anyone can send a message" ON public.contact_messages;
CREATE POLICY "Anyone can send a valid message" ON public.contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(btrim(name)) BETWEEN 1 AND 120
    AND char_length(btrim(message)) BETWEEN 1 AND 5000
    AND (email IS NULL OR (char_length(email) <= 255 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'))
    AND (phone IS NULL OR char_length(phone) <= 30)
  );

DROP POLICY IF EXISTS "Product images readable" ON storage.objects;
CREATE POLICY "Admins read product images" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));