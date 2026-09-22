import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const staticPaths = ["/", "/products", "/about", "/contact", "/privacy-policy", "/terms"];

function urlEntry(origin: string, path: string, lastmod?: string) {
  return `  <url><loc>${origin}${path}</loc>${lastmod ? `<lastmod>${lastmod.slice(0, 10)}</lastmod>` : ""}</url>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = process.env["PUBLIC_SITE_URL"] || new URL(request.url).origin;

        const supabase = createClient(
          process.env["SUPABASE_URL"]!,
          process.env["SUPABASE_PUBLISHABLE_KEY"]!,
          { auth: { persistSession: false, autoRefreshToken: false } },
        );

        const [{ data: products }, { data: categories }] = await Promise.all([
          supabase.from("products").select("slug,updated_at"),
          supabase.from("categories").select("slug,updated_at"),
        ]);

        const body = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...staticPaths.map((path) => urlEntry(origin, path)),
          ...(categories ?? []).map((c) => urlEntry(origin, `/products/${c.slug}`, c.updated_at)),
          ...(products ?? []).map((p) => urlEntry(origin, `/product/${p.slug}`, p.updated_at)),
          "</urlset>",
        ].join("\n");

        return new Response(body, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
