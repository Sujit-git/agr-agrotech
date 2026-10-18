import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Apple,
  Citrus,
  Snowflake,
  ShieldCheck,
  Sparkles,
  PackageCheck,
  ArrowUpRight,
} from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";
import { categoriesQuery, productsQuery } from "@/lib/catalog";
import mangoImage from "@/assets/product-dehydrated-mango.jpg";
import strawberryImage from "@/assets/product-freeze-dried-strawberry.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fruitly | Pure. Fresh. Natural." },
      {
        name: "description",
        content:
          "Explore Fruitly's fruit-first range of dehydrated and freeze-dried fruit snacks. Pure. Fresh. Natural.",
      },
      { property: "og:title", content: "Fruitly | Pure. Fresh. Natural." },
      {
        property: "og:description",
        content: "A thoughtful world of dehydrated and freeze-dried fruit from Fruitly.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const categoryIcons = [Citrus, Apple, Snowflake];

const whyPoints = [
  {
    icon: ShieldCheck,
    title: "Quality in focus",
    text: "Clear product information and careful attention to the details that matter.",
  },
  {
    icon: Apple,
    title: "Fruit comes first",
    text: "A fruit-led range celebrating familiar flavours, colours and textures.",
  },
  {
    icon: Snowflake,
    title: "Two ways to preserve",
    text: "Explore the distinctive character of dehydrated and freeze-dried fruit.",
  },
  {
    icon: PackageCheck,
    title: "Made to explore",
    text: "Product details and availability help you find the fruit format that suits you.",
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
      <section className="fruitly-hero-surface relative overflow-hidden border-b border-border/70">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-primary/10 md:h-96 md:w-96" aria-hidden />
        <div className="pointer-events-none absolute -bottom-28 left-[42%] h-64 w-64 rounded-full bg-accent/30 blur-3xl" aria-hidden />
        <div className="container-page relative grid items-center gap-12 py-12 sm:py-16 md:grid-cols-[0.92fr_1.08fr] md:gap-10 md:py-20 lg:gap-16 lg:py-24">
          <div className="rise-in relative z-10">
            <p className="eyebrow inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/70 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-clay" aria-hidden />
              Fruitly · Pure. Fresh. Natural.
            </p>
            <h1 className="mt-6 max-w-xl text-5xl leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-[4.6rem]">
              Real fruit.
              <br />
              Remarkable
              <br />
              little bites.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Discover a colourful world of dehydrated and freeze-dried fruits, presented for
              curious snackers and everyday fruit lovers.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-6 shadow-soft">
                <Link to="/products">Explore the range <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-primary/20 bg-background/60 px-6">
                <Link to="/about">Meet Fruitly</Link>
              </Button>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-primary/10 pt-5 text-xs font-semibold uppercase tracking-[0.13em] text-muted-foreground">
              <span>Dehydrated fruit</span>
              <span className="h-1 w-1 rounded-full bg-clay" aria-hidden />
              <span>Freeze-dried fruit</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[640px] md:max-w-none">
            <div className="absolute inset-5 rotate-[-4deg] rounded-[2.5rem] bg-accent/60 md:inset-8" aria-hidden />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-background p-2.5 shadow-lift sm:p-3">
              <img
                src={mangoImage}
                alt="Golden dried mango pieces served in a ceramic bowl"
                width={1008}
                height={1008}
                fetchPriority="high"
                className="fruitly-hero-photo aspect-[5/4] w-full rounded-[1.45rem] object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-3 flex max-w-[245px] items-center gap-3 rounded-2xl border border-white/80 bg-background/95 p-3.5 shadow-lift sm:bottom-5 sm:-left-5 sm:p-4">
              <img
                src={strawberryImage}
                alt=""
                width={120}
                height={120}
                loading="lazy"
                className="h-14 w-14 rounded-xl object-cover sm:h-16 sm:w-16"
              />
              <div>
                <p className="eyebrow text-[0.6rem]">A fruit-forward favourite</p>
                <p className="mt-1 font-display text-lg leading-tight">Made for little moments</p>
              </div>
            </div>
            <p className="absolute -right-2 top-5 hidden rounded-full border border-white/80 bg-background/90 px-4 py-2 text-xs font-semibold tracking-wide text-primary shadow-soft lg:block">
              Pure. Fresh. Natural.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20 md:py-24">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">Find your kind of fruit</p>
            <h2 className="mt-3 text-3xl leading-tight sm:text-4xl md:text-5xl">A range worth reaching for.</h2>
            <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
              Explore the formats and flavours in the Fruitly collection.
            </p>
          </div>
          <Link to="/products" className="inline-flex items-center gap-2 self-start text-sm font-bold text-primary transition-colors hover:text-foreground md:self-auto">
            View all products <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {categories.map((category, i) => {
            const Icon = categoryIcons[i % categoryIcons.length] ?? Apple;
            const count = products.filter((p) => p.category_id === category.id).length;
            return (
              <Link
                key={category.id}
                to="/products/$category"
                params={{ category: category.slug }}
                className="group rounded-3xl border border-border/80 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-clay/50 hover:shadow-lift sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/60 text-primary transition-colors group-hover:bg-accent">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
                </div>
                <h3 className="mt-6 text-xl">{category.name}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
                  {category.description}
                </p>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-primary">
                  {count} {count === 1 ? "product" : "products"}
                </p>
              </Link>
            );
          })}
          {categories.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
              Product ranges will appear here soon.
            </p>
          )}
        </div>
      </section>

      <section className="border-y border-border/70 bg-card py-16 sm:py-20 md:py-24">
        <div className="container-page">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">The Fruitly edit</p>
              <h2 className="mt-3 text-3xl leading-tight sm:text-4xl md:text-5xl">A few favourites to start with.</h2>
            </div>
            <Link to="/products" className="inline-flex items-center gap-2 self-start text-sm font-bold text-primary transition-colors hover:text-foreground">
              Discover the full range <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            {shown.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                category={product.category_id ? categoryById.get(product.category_id) : undefined}
              />
            ))}
            {shown.length === 0 && (
              <p className="text-sm text-muted-foreground">Products will be featured here as they are published.</p>
            )}
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20 md:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow">Why Fruitly</p>
          <h2 className="mt-3 text-3xl leading-tight sm:text-4xl md:text-5xl">A little more fruit in your everyday.</h2>
        </div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {whyPoints.map((point, index) => (
            <div key={point.title} className="rounded-3xl border border-border/80 bg-card p-6 transition-colors hover:bg-secondary/40 sm:p-7">
              <p className="font-display text-sm text-clay">0{index + 1}</p>
              <point.icon className="mt-5 h-5 w-5 text-primary" aria-hidden />
              <h3 className="mt-4 text-lg">{point.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{point.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-12 text-primary-foreground shadow-lift sm:px-12 sm:py-16 md:px-16">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/15 md:h-80 md:w-80" aria-hidden />
          <div className="pointer-events-none absolute right-20 top-12 h-32 w-32 rounded-full bg-white/5 blur-2xl" aria-hidden />
          <div className="relative max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">For homes, retailers and partners</p>
            <h2 className="mt-4 text-3xl leading-tight sm:text-4xl md:text-5xl">Let's talk fruit.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
              Looking for product details, availability or a trade enquiry? Our team would be happy to hear from you.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-7 rounded-full px-6">
              <Link to="/contact">Contact Fruitly <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden /></Link>
            </Button>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-white/65">Pure. Fresh. Natural.</p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
