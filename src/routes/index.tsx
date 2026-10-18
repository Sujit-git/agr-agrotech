import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Apple,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Leaf,
  PackageCheck,
  Quote,
  Snowflake,
  Star,
} from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";
import { categoriesQuery, isLegacySeedProduct, productImage, productsQuery } from "@/lib/catalog";
import { customerReviewsQuery } from "@/lib/site";

const mangoImage = "/fruitly-products/dehydrated-mango-cubes.webp";
const strawberryImage = "/fruitly-products/dehydrated-strawberry-whole.webp";
const pineappleImage = "/fruitly-products/dehydrated-papaya-cubes.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fruitly | Pure. Fresh. Natural." },
      {
        name: "description",
        content:
          "Discover Fruitly's fruit-first range of dehydrated and freeze-dried fruit. Explore product-specific ingredients, details and formats.",
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

const categoryIcons = [Leaf, Apple, Snowflake];

const marqueeItems = [
  "Fruit-first snacking",
  "Dehydrated fruit",
  "Freeze-dried fruit",
  "Pure. Fresh. Natural.",
  "Explore every ingredient",
  "Fruit for the moments in between",
];

const fallbackSpotlights: SpotlightSlide[] = [
  {
    key: "mango",
    title: "A little sunshine in every bite.",
    description: "Discover the familiar sweetness and golden colour of mango in a dried fruit format.",
    image: mangoImage,
    slug: null,
    category: "Dehydrated fruit",
  },
  {
    key: "strawberry",
    title: "A brighter kind of berry moment.",
    description: "Explore the colour and character of strawberry in a light, fruit-forward format.",
    image: strawberryImage,
    slug: null,
    category: "Fruit spotlight",
  },
  {
    key: "pineapple",
    title: "A little tropical something.",
    description: "Get to know pineapple in a distinctive format made for curious fruit lovers.",
    image: pineappleImage,
    slug: null,
    category: "Fruit spotlight",
  },
];

type SpotlightSlide = {
  key: string;
  title: string;
  description: string;
  image: string;
  slug: string | null;
  category: string;
};

const storyPoints = [
  {
    icon: Apple,
    title: "Fruit-forward choices",
    text: "Explore recognisable fruit flavours in dehydrated and freeze-dried formats.",
  },
  {
    icon: CheckCircle2,
    title: "Know what is inside",
    text: "Ingredients and product details can differ by recipe. Check each product page for the information relevant to that pack.",
  },
  {
    icon: PackageCheck,
    title: "Find your kind of bite",
    text: "Compare the texture, format and pack information to discover what suits your own snack routine.",
  },
];

function Home() {
  const { data: products = [] } = useQuery(productsQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: customerReviews = [] } = useQuery(customerReviewsQuery);

  const publicProducts = products.filter((product) => !isLegacySeedProduct(product.slug));
  const publicCategoryIds = new Set(publicProducts.map((product) => product.category_id).filter(Boolean));
  const publicCategories = categories.filter((category) => publicCategoryIds.has(category.id));
  const categoryById = new Map(publicCategories.map((category) => [category.id, category]));
  const fruitCategoryIds = new Set(
    publicCategories
      .filter((category) => /dehydrated|freeze-dried/i.test(`${category.slug} ${category.name}`))
      .map((category) => category.id),
  );
  const fruitProducts = publicProducts
    .filter((product) => product.category_id && fruitCategoryIds.has(product.category_id))
    .filter((product) => Boolean(productImage(product)))
    .sort(
      (a, b) =>
        Number(b.featured) - Number(a.featured) || a.sort_order - b.sort_order,
    );

  // Admins can replace these spotlight photos through Admin → Products.
  // Product images and the featured flag are read from the existing catalogue.
  const spotlights: SpotlightSlide[] = fruitProducts.length
    ? fruitProducts.slice(0, 5).map((product) => ({
        key: product.id,
        title: product.name,
        description:
          product.short_description ||
          "Explore this fruit in a distinctive format, with the details for this product close at hand.",
        image: productImage(product) ?? mangoImage,
        slug: product.slug,
        category: categoryById.get(product.category_id ?? "")?.name ?? "Fruitly selection",
      }))
    : fallbackSpotlights;

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (activeSlide >= spotlights.length) setActiveSlide(0);
  }, [activeSlide, spotlights.length]);

  useEffect(() => {
    if (spotlights.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % spotlights.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [spotlights.length]);

  const currentSlide: SpotlightSlide = spotlights[activeSlide] ?? spotlights[0]!;
  const featured = publicProducts.filter((product) => product.featured).slice(0, 4);
  const shown = featured.length ? featured : publicProducts.slice(0, 4);

  return (
    <SiteLayout>
      <section className="fruitly-hero-surface relative overflow-hidden border-b border-border/70">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-primary/10 md:h-96 md:w-96" aria-hidden />
        <div className="pointer-events-none absolute -bottom-28 left-[42%] h-64 w-64 rounded-full bg-accent/30 blur-3xl" aria-hidden />
        <div className="container-page relative grid items-center gap-12 py-12 sm:py-16 md:grid-cols-[0.92fr_1.08fr] md:gap-10 md:py-20 lg:gap-16 lg:py-24">
          <div className="rise-in relative z-10">
            <p className="eyebrow inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/75 px-4 py-2">
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
                <Link to="/products">
                  Explore the range <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden />
                </Link>
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

      <section className="container-page py-12 sm:py-16 md:py-20" aria-label="Fruitly spotlight">
        <div className="fruitly-spotlight-shell relative overflow-hidden rounded-[2rem] text-primary-foreground shadow-lift">
          <div className="grid min-h-[330px] md:grid-cols-[0.92fr_1.08fr]">
            <div className="relative overflow-hidden bg-background/10 p-4 sm:p-6 md:p-8">
              <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10" aria-hidden />
              <img
                key={currentSlide.key}
                src={currentSlide.image}
                alt={currentSlide.title}
                loading="lazy"
                width={1008}
                height={1008}
                className="relative aspect-square w-full rounded-[1.4rem] object-cover shadow-lift"
              />
              <span className="absolute left-7 top-7 rounded-full bg-background/95 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-primary shadow-soft sm:left-9 sm:top-9">
                {currentSlide.category}
              </span>
            </div>

            <div className="relative flex flex-col justify-center px-6 py-8 sm:px-9 sm:py-10 md:px-12 lg:px-16">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-white/75">
                The Fruitly spotlight
              </p>
              <h2 className="mt-4 max-w-xl text-3xl leading-[1.08] tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
                {currentSlide.title}
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-white/80 sm:text-base">
                {currentSlide.description}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" variant="secondary" className="rounded-full px-6">
                  {currentSlide.slug ? (
                    <Link to="/product/$slug" params={{ slug: currentSlide.slug }}>
                      Discover this fruit <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden />
                    </Link>
                  ) : (
                    <Link to="/products">
                      Explore fruit <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden />
                    </Link>
                  )}
                </Button>
                {spotlights.length > 1 && (
                  <div className="ml-auto flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Previous spotlight"
                      onClick={() => setActiveSlide((current) => (current - 1 + spotlights.length) % spotlights.length)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      aria-label="Next spotlight"
                      onClick={() => setActiveSlide((current) => (current + 1) % spotlights.length)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
                    >
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                )}
              </div>
              {spotlights.length > 1 && (
                <div className="mt-7 flex items-center gap-2" aria-label="Choose spotlight slide">
                  {spotlights.map((spotlight, index) => (
                    <button
                      key={spotlight.key}
                      type="button"
                      aria-label={`Show spotlight ${index + 1}: ${spotlight.title}`}
                      aria-current={activeSlide === index ? "true" : undefined}
                      onClick={() => setActiveSlide(index)}
                      className={`h-2.5 rounded-full transition-all ${activeSlide === index ? "w-8 bg-white" : "w-2.5 bg-white/40 hover:bg-white/70"}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          Spotlight photography follows the product images managed in Admin → Products. Update a product image there to refresh the homepage visual without changing code.
        </p>
      </section>

      <div className="fruitly-marquee" aria-label="Fruitly highlights">
        <div className="fruitly-marquee-track">
          {[0, 1].map((copy) => (
            <div className="fruitly-marquee-group" key={copy} aria-hidden={copy === 1}>
              {marqueeItems.map((item, index) => (
                <span className="fruitly-marquee-item" key={item}>
                  {item}
                  <span className="fruitly-marquee-star" aria-hidden>✳</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

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
          {publicCategories.map((category, i) => {
            const Icon = categoryIcons[i % categoryIcons.length] ?? Apple;
            const count = publicProducts.filter((product) => product.category_id === category.id).length;
            return (
              <Link
                key={category.id}
                to="/products/$category"
                params={{ category: category.slug }}
                className="group rounded-3xl border border-border/80 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-accent/70 hover:shadow-lift sm:p-7"
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
          <p className="eyebrow">A thoughtful way to snack</p>
          <h2 className="mt-3 text-3xl leading-tight sm:text-4xl md:text-5xl">Fruit at the centre. Clear details at every step.</h2>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
            A snack choice is personal. We focus on fruit-forward options and clear product information, so you can compare the details and choose what works for you.
          </p>
        </div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {storyPoints.map((point, index) => (
            <article key={point.title} className="rounded-3xl border border-border/80 bg-card p-6 transition-colors hover:bg-secondary/40 sm:p-7">
              <p className="font-display text-sm text-clay">0{index + 1}</p>
              <point.icon className="mt-5 h-5 w-5 text-primary" aria-hidden />
              <h3 className="mt-4 text-lg">{point.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{point.text}</p>
            </article>
          ))}
        </div>
        <p className="mt-5 text-xs leading-5 text-muted-foreground">
          Product ingredients and nutrition vary by recipe. Please read the individual pack label and product information before choosing.
        </p>
      </section>

      <section className="border-y border-border/70 bg-secondary/35 py-16 sm:py-20 md:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Words from our community</p>
            <h2 className="mt-3 text-3xl leading-tight sm:text-4xl md:text-5xl">Good fruit deserves honest feedback.</h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              We publish customer words only after the feedback is confirmed and approved. Every review shown here comes from a real customer note—not invented review copy.
            </p>
          </div>

          {customerReviews.length > 0 ? (
            <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
              {customerReviews.map((review) => (
                <article key={review.id} className="flex w-[min(86vw,360px)] shrink-0 snap-start flex-col rounded-3xl border border-border/80 bg-card p-6 shadow-soft sm:w-[340px] sm:p-7">
                  <div className="flex items-center gap-1 text-clay" aria-label={`${review.rating} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Star key={rating} className={`h-4 w-4 ${rating <= review.rating ? "fill-current" : "opacity-25"}`} aria-hidden />
                    ))}
                  </div>
                  <Quote className="mt-5 h-5 w-5 text-accent" aria-hidden />
                  <p className="mt-3 flex-1 text-sm leading-7 text-foreground">{review.quote}</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/70 text-xs font-bold text-primary" aria-hidden>
                      {review.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{review.name}</p>
                      {review.verified_buyer && <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-primary"><CheckCircle2 className="h-3 w-3" aria-hidden /> Verified buyer</p>}
                      {review.product && <p className="mt-0.5 text-xs text-muted-foreground">{review.product}</p>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-9 max-w-3xl rounded-[2rem] border border-dashed border-border bg-card px-6 py-8 text-center sm:px-10 sm:py-10">
              <Quote className="mx-auto h-7 w-7 text-primary/70" aria-hidden />
              <h3 className="mt-4 text-xl">Your Fruitly story belongs here.</h3>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
                Customer names have been added to the admin review list. Add each person’s actual feedback and publish it from Admin → Settings when they have approved the wording.
              </p>
              <Button asChild variant="outline" className="mt-5 rounded-full">
                <Link to="/contact">Share your feedback</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="container-page pb-6 pt-16 sm:pt-20 md:pt-24">
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
