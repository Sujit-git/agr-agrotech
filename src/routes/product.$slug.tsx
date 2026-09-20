import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Check, ImageOff, MessageCircle, Package, Info, Sparkles } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import {
  categoriesQuery,
  productsQuery,
  availabilityLabel,
  formatPrice,
  productImage,
} from "@/lib/catalog";
import { settingsQuery, fallbackSettings, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => {
    const label = params.slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `${label} | AGR \u2014 Agrotech` },
        {
          name: "description",
          content: `${label} from AGR \u2014 Agrotech. See price, pack size, availability and product information, and enquire directly.`,
        },
        { property: "og:title", content: `${label} | AGR \u2014 Agrotech` },
        {
          property: "og:description",
          content: `${label} from AGR \u2014 Agrotech. Price, pack size and availability.`,
        },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductDetails,
});

function ProductDetails() {
  const { slug } = useParams({ from: "/product/$slug" });
  const { data: products = [], isLoading, isError } = useQuery(productsQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: settings } = useQuery(settingsQuery);
  const s = settings ?? fallbackSettings;

  const product = products.find((p) => p.slug === slug);
  const category = categories.find((c) => c.id === product?.category_id);

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="container-page grid gap-10 py-14 md:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-3xl bg-secondary" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-secondary" />
            <div className="h-4 w-full animate-pulse rounded bg-secondary" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-secondary" />
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (isError || !product) {
    return (
      <SiteLayout>
        <div className="container-page py-24 text-center">
          <h1 className="font-display text-3xl">Product not found</h1>
          <p className="mt-3 text-muted-foreground">
            This product may have been renamed or is no longer listed.
          </p>
          <Button asChild className="mt-6">
            <Link to="/products">Browse all products</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  const image = productImage(product);
  const enquiry = whatsappLink(
    s.whatsapp,
    `Hi AGR, I am interested in ${product.name}. Please share more details.`,
  );

  return (
    <SiteLayout>
      <div className="container-page py-8 md:py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <Link to="/products" className="hover:text-foreground">
            Products
          </Link>
          {category && (
            <>
              <span aria-hidden> / </span>
              <Link
                to="/products/$category"
                params={{ category: category.slug }}
                className="hover:text-foreground"
              >
                {category.name}
              </Link>
            </>
          )}
          <span aria-hidden> / </span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="overflow-hidden rounded-3xl border border-border bg-secondary">
            {image ? (
              <img
                src={image}
                alt={product.name}
                width={1008}
                height={1008}
                className="aspect-square w-full object-cover"
              />
            ) : (
              <div className="flex aspect-square w-full items-center justify-center text-muted-foreground">
                <ImageOff className="h-10 w-10" />
              </div>
            )}
          </div>

          <div>
            {category && <p className="eyebrow">{category.name}</p>}
            <h1 className="mt-3 font-display text-3xl sm:text-4xl">{product.name}</h1>
            {product.short_description && (
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {product.short_description}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-display text-3xl">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.unit && (
                <span className="text-muted-foreground">per {product.unit}</span>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm">
              <span
                aria-hidden
                className={`h-2 w-2 rounded-full ${
                  product.availability === "available"
                    ? "bg-primary"
                    : product.availability === "coming_soon"
                      ? "bg-clay"
                      : "bg-muted-foreground"
                }`}
              />
              <span className="font-medium">{availabilityLabel(product.availability)}</span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href={enquiry} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" aria-hidden />
                  Enquire on WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Online ordering is not available yet. Reach out and we&apos;ll help you directly.
            </p>

            {product.key_features.length > 0 && (
              <div className="mt-10">
                <h2 className="flex items-center gap-2 font-display text-lg">
                  <Sparkles className="h-4 w-4 text-primary" aria-hidden />
                  Key features
                </h2>
                <ul className="mt-4 space-y-2">
                  {product.key_features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {product.description && (
            <section className="rounded-2xl border border-border bg-card p-6 md:col-span-3">
              <h2 className="flex items-center gap-2 font-display text-lg">
                <Info className="h-4 w-4 text-primary" aria-hidden />
                Product information
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </section>
          )}
          {product.storage_information && (
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-lg">Storage</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {product.storage_information}
              </p>
            </section>
          )}
          {product.usage_information && (
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-lg">How to use</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {product.usage_information}
              </p>
            </section>
          )}
          {product.unit && (
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 font-display text-lg">
                <Package className="h-4 w-4 text-primary" aria-hidden />
                Pack size
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.unit}</p>
            </section>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
