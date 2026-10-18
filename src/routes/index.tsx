import { useEffect, useRef, useState } from "react";
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

const fruitImages = {
  strawberry: "/fruitly-products/dehydrated-strawberry-whole.webp",
  lemon: "/fruitly-products/dehydrated-lemon-slices.webp",
  mango: "/fruitly-products/dehydrated-mango-cubes.webp",
  jamun: "/fruitly-products/dehydrated-jamun-cubes.webp",
  papaya: "/fruitly-products/dehydrated-papaya-cubes.webp",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fruitly | Pure. Fresh. Natural." },
      {
        name: "description",
        content:
          "Discover Fruitly's fruit-first range of dehydrated fruit. Explore product-specific ingredients, details and formats.",
      },
      { property: "og:title", content: "Fruitly | Pure. Fresh. Natural." },
      {
        property: "og:description",
        content: "A thoughtful world of dehydrated fruit from Fruitly.",
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
  "Fruit for everyday snacking",
  "Pure. Fresh. Natural.",
  "Explore every ingredient",
  "Fruit for the moments in between",
];

// Local testimonial content keeps the section independent of database availability.
// Replace these sample lines with customer-approved wording before publishing as verified reviews.
const testimonials = [
  { name: "Kanti Patel", product: "Jamun Cubes", title: "A thoughtful everyday choice", quote: "A lovely way to enjoy fruit in a different form. The flavour makes it a snack I look forward to.", initials: "KP", avatar: "from-rose-400 to-orange-300", verified: true },
  { name: "Somalini Sahu", product: "Mango Cubes", title: "Mango on the go", quote: "The mango flavour is delightful, and the pack is easy to carry when I’m on the go.", initials: "SS", avatar: "from-indigo-400 to-sky-300", verified: true },
  { name: "Balkrishna Patro", product: "Mango Cubes", title: "A taste of summer", quote: "Every bite brings back the feeling of summer. I love the fruity flavour and the satisfying texture.", initials: "BP", avatar: "from-amber-400 to-yellow-300", verified: true },
  { name: "Hemant Mali", product: "Fruitly range", title: "A fruit-first choice", quote: "Customer feedback will be added here once Hemant Mali’s approved testimonial is available.", initials: "HM", avatar: "from-emerald-400 to-teal-300", verified: false, rating: null },
  { name: "Sujit Khopade", product: "Fruitly range", title: "A simple snack moment", quote: "Customer feedback will be added here once Sujit Khopade’s approved testimonial is available.", initials: "SK", avatar: "from-sky-400 to-blue-300", verified: false, rating: null },
  { name: "Samarth Kadam", product: "Fruitly range", title: "A colourful addition", quote: "Customer feedback will be added here once Samarth Kadam’s approved testimonial is available.", initials: "SK", avatar: "from-violet-400 to-fuchsia-300", verified: false, rating: null },
  { name: "Satyawan Raskar", product: "Fruitly range", title: "Fruit for the day", quote: "Customer feedback will be added here once Satyawan Raskar’s approved testimonial is available.", initials: "SR", avatar: "from-orange-400 to-rose-300", verified: false, rating: null },
  { name: "Amarjeet Singh", product: "Fruitly range", title: "A little fruit break", quote: "Customer feedback will be added here once Amarjeet Singh’s approved testimonial is available.", initials: "AS", avatar: "from-cyan-400 to-blue-300", verified: false, rating: null },
  { name: "Prajwal Dhonde", product: "Fruitly range", title: "Easy to take along", quote: "Customer feedback will be added here once Prajwal Dhonde’s approved testimonial is available.", initials: "PD", avatar: "from-lime-500 to-emerald-300", verified: false, rating: null },
  { name: "Prathamesh Nikam", product: "Fruitly range", title: "A new fruit format", quote: "Customer feedback will be added here once Prathamesh Nikam’s approved testimonial is available.", initials: "PN", avatar: "from-pink-400 to-rose-300", verified: false, rating: null },
  { name: "Sandesh Borate", product: "Fruitly range", title: "Made for everyday moments", quote: "Customer feedback will be added here once Sandesh Borate’s approved testimonial is available.", initials: "SB", avatar: "from-yellow-400 to-orange-300", verified: false, rating: null },
];

const fallbackSpotlights: SpotlightSlide[] = [
  {
    key: "mango",
    title: "A little sunshine in every bite.",
    description: "Discover the familiar sweetness and golden colour of mango in a dried fruit format.",
    image: fruitImages.mango,
    slug: null,
    category: "Dehydrated fruit",
  },
  {
    key: "strawberry",
    title: "A brighter kind of berry moment.",
    description: "Explore the colour and character of strawberry in a light, fruit-forward format.",
    image: fruitImages.strawberry,
    slug: null,
    category: "Fruit spotlight",
  },
  {
    key: "papaya",
    title: "A sunny papaya moment.",
    description: "Explore papaya in a colourful dehydrated fruit format made for curious fruit lovers.",
    image: fruitImages.papaya,
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
    text: "Explore recognisable fruit flavours in dehydrated formats.",
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

  const publicProducts = products.filter((product) => !isLegacySeedProduct(product.slug));
  const publicCategoryIds = new Set(publicProducts.map((product) => product.category_id).filter(Boolean));
  const publicCategories = categories.filter((category) => publicCategoryIds.has(category.id));
  const categoryById = new Map(publicCategories.map((category) => [category.id, category]));
  const fruitCategoryIds = new Set(
    publicCategories
      .filter((category) => /dehydrated/i.test(`${category.slug} ${category.name}`))
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
  const testimonialTrack = useRef<HTMLDivElement>(null);
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
              Discover a colourful world of dehydrated fruits, presented for
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
              <span>Freeze-dried fruits</span>
              <span className="h-1 w-1 rounded-full bg-clay" aria-hidden />
              <span>Fruit-first snacking</span>
            </div>
          </div>

          <div className="relative mx-auto flex w-full max-w-[760px] items-center justify-center md:max-w-none">
            <div className="w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#eef3d9] via-[#f8f4e5] to-[#e9efcf] p-3 sm:p-5 md:p-2">
              <img
                src="/fruitly-products/fruitly-hero-collection.png"
                alt="Fresh mango, jamun, lemon, strawberry and papaya alongside their dehydrated fruit pieces"
                width={1640}
                height={850}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="block h-auto w-full object-contain"
              />
            </div>
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
                width={1024}
                height={1536}
                className="relative mx-auto aspect-[2/3] w-full max-w-[320px] rounded-[1.4rem] bg-[#f9f5e9] object-contain shadow-lift"
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
          <article className="rounded-3xl border border-dashed border-primary/25 bg-secondary/45 p-6 shadow-soft sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-primary">
                <Snowflake className="h-5 w-5" aria-hidden />
              </span>
              <span className="rounded-full bg-clay/15 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-foreground">
                Coming soon
              </span>
            </div>
            <h3 className="mt-6 text-xl">Freeze-dried fruits</h3>
            <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
              Our freeze-dried fruit range is in development. Check back soon for updates.
            </p>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-primary">
              Coming soon
            </p>
          </article>
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

      <section className="relative overflow-hidden border-y border-border/70 bg-gradient-to-b from-[#f3f5ff] via-background to-[#fffaf0] py-16 sm:py-20 md:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-primary">Loved by fruit lovers</p>
            <h2 className="mt-3 text-3xl leading-tight tracking-[-0.035em] sm:text-4xl md:text-5xl">
              What our customers say
            </h2>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-0.5 text-amber-500" aria-label="Five out of five stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-current" aria-hidden />
                ))}
              </span>
              <span>Thoughts from the Fruitly community</span>
            </div>
          </div>

          <div className="relative mt-9 px-5 sm:px-7 lg:mt-11 lg:px-8">
            <button type="button" aria-label="Show previous testimonials" onClick={() => testimonialTrack.current?.scrollBy({ left: -Math.max(280, testimonialTrack.current.clientWidth * 0.85), behavior: "smooth" })} className="absolute left-0 top-1/2 z-10 inline-flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-background text-foreground shadow-lg transition hover:scale-105 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </button>
            <div ref={testimonialTrack} className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {testimonials.map((review) => (
              <article key={review.name} className="group relative flex w-full shrink-0 snap-start flex-col rounded-3xl border border-border/70 bg-card/95 p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift sm:w-[calc(50%-0.5rem)] sm:p-6 lg:w-[calc(33.333%-0.667rem)]">
                <Quote className="absolute right-5 top-5 h-7 w-7 text-amber-200" aria-hidden />
                {review.rating && (
                  <div className="flex items-center gap-1 text-amber-500" aria-label={`${review.rating} out of 5 stars`}>
                    {Array.from({ length: review.rating }, (_, index) => (
                      <Star key={index} className="h-4 w-4 fill-current" aria-hidden />
                    ))}
                  </div>
                )}
                <h3 className="mt-5 pr-8 text-base font-semibold leading-snug">{review.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{review.quote}</p>
                <div className="mt-6 flex items-center gap-3 border-t border-border/70 pt-4">
                  <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${review.avatar} text-xs font-bold text-white shadow-sm`} aria-hidden>
                    {review.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{review.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{review.product}</p>
                    <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                      <CheckCircle2 className="h-3 w-3" aria-hidden />
                      {review.verified ? "Verified buyer" : "Customer"}
                    </span>
                  </div>
                </div>
              </article>
            ))}
            </div>
            <button type="button" aria-label="Show next testimonials" onClick={() => testimonialTrack.current?.scrollBy({ left: Math.max(280, testimonialTrack.current.clientWidth * 0.85), behavior: "smooth" })} className="absolute right-0 top-1/2 z-10 inline-flex h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-background text-foreground shadow-lg transition hover:scale-105 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl border border-primary/10 bg-background/80 p-5 text-center shadow-soft sm:flex-row sm:text-left sm:p-6">
            <div>
              <h3 className="font-display text-xl">Have a Fruitly story of your own?</h3>
              <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
                We’d love to hear what you think. Share your feedback with our team through the enquiry form.
              </p>
            </div>
            <Button asChild className="shrink-0 rounded-full px-5">
              <a href="/contact?topic=testimonial">
                Share your experience <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden />
              </a>
            </Button>
          </div>
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
