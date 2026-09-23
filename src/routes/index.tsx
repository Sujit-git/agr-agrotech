import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Leaf, Sprout, Snowflake, ShieldCheck, Recycle, FlaskConical } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";
import { categoriesQuery, productsQuery } from "@/lib/catalog";
import heroImage from "@/assets/hero-agr.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AGR Agrotech | From Agriculture to Nutrition, Naturally" },
      {
        name: "description",
        content:
          "AGR Agrotech connects Indian agriculture to nutrition through sustainable soil inputs, dehydrated and freeze-dried fruits, and plant-based ingredients.",
      },
      { property: "og:title", content: "AGR Agrotech | From Agriculture to Nutrition, Naturally" },
      {
        property: "og:description",
        content:
          "Sustainable agricultural inputs, preserved fruits and plant-based nutrition ingredients from AGR Agrotech.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const categoryIcons = [Sprout, Leaf, Snowflake];

const whyPoints = [
  {
    icon: ShieldCheck,
    title: "Quality Focus",
    text: "Every batch is checked for consistency before it is packed and dispatched.",
  },
  {
    icon: Leaf,
    title: "Natural Products",
    text: "Agricultural and food products built around what the farm already gives us.",
  },
  {
    icon: FlaskConical,
    title: "Thoughtful Processing",
    text: "Dehydration and freeze-drying done with care to protect taste and texture.",
  },
  {
    icon: Recycle,
    title: "Sustainable Approach",
    text: "Composting and low-waste practices sit at the centre of how we work.",
  },
];

function Home() {
  const { data: products = [] } = useQuery(productsQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);

  const featured = products.filter((p) => p.featured).slice(0, 4);
  const shown = featured.length ? featured : products.slice(0, 4);
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-secondary/40">
        <div className="container-page grid items-center gap-10 py-14 md:grid-cols-2 md:py-24">
          <div className="rise-in">
            <p className="eyebrow">AGR Agrotech</p>
            <h1 className="mt-4 font-display text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">
              Growing Agriculture.
              <br />
              Advancing Nutrition.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Creating value from agriculture to nutrition through sustainable soil inputs,
              dehydrated and freeze-dried fruits, and an expanding range of plant-based ingredients.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/products">Explore Products</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/about">Know Our Story</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <img
              src={heroImage}
              alt="Dried fruit and rich compost on a farm at golden hour"
              width={1600}
              height={1104}
              fetchPriority="high"
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow">What we make</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">Our product ranges</h2>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, i) => {
            const Icon = categoryIcons[i % categoryIcons.length] ?? Sprout;
            const count = products.filter((p) => p.category_id === category.id).length;
            return (
              <Link
                key={category.id}
                to="/products/$category"
                params={{ category: category.slug }}
                className="group rounded-2xl border border-border bg-card p-7 shadow-soft transition-shadow hover:shadow-lift"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-xl">{category.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {category.description}
                </p>
                <p className="mt-5 text-sm font-medium text-primary underline-offset-4 group-hover:underline">
                  {count} {count === 1 ? "product" : "products"} &rarr;
                </p>
              </Link>
            );
          })}
          {categories.length === 0 && (
            <p className="text-sm text-muted-foreground">Product ranges will appear here soon.</p>
          )}
        </div>
      </section>

      {/* Featured */}
      <section className="border-y border-border bg-secondary/40 py-16 md:py-24">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Selected for you</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl">Featured products</h2>
            </div>
            <Link
              to="/products"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              View all products &rarr;
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {shown.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                category={
                  product.category_id ? categoryById.get(product.category_id) : undefined
                }
              />
            ))}
            {shown.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No products have been published yet.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Why AGR */}
      <section className="container-page py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow">Why AGR</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            From agriculture to nutrition, naturally
          </h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyPoints.map((point) => (
            <div key={point.title} className="rounded-2xl border border-border bg-card p-6">
              <point.icon className="h-5 w-5 text-primary" aria-hidden />
              <h3 className="mt-4 font-display text-lg">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{point.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-4">
        <div className="rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
          <h2 className="font-display text-3xl sm:text-4xl">Looking for bulk or trade enquiries?</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed opacity-90 sm:text-base">
            Tell us what you need and we will get back to you with availability, pack sizes and
            pricing.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" variant="secondary">
              <Link to="/contact">Contact AGR</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
