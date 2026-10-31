import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Apple,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Leaf,
  Quote,
  Snowflake,
  Star,
} from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";
import { categoriesQuery, isLegacySeedProduct, productImage, productsQuery } from "@/lib/catalog";


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
  "Pocket-sized sunshine",
  "Nature's sweetness",
  "Explore every ingredient",
  "Fruit for the moments in between",
];

// Customer-provided testimonial copy is kept locally; entries without approved feedback remain pending.
const testimonials = [
  { name: "Sujit Khopade", initials: "SK", avatar: "from-sky-400 to-blue-300", product: "Freeze-dried Mangoes", quote: "Fruitly's freeze-dried mangoes are a perfect match for my busy lifestyle. The packaging is travel-friendly, the taste is top-notch.", rating: null, verified: false },
  { name: "Satyawan Raskar", initials: "HM", avatar: "from-emerald-400 to-teal-300", product: "Fruitly fruit snack", quote: "Such an incredible alternative to junk food! It satisfies my evening cravings completely without any guilt. Absolutely love the natural crunch.", rating: null, verified: false },
  { name: "Sachin Ghanwat", initials: "SG", avatar: "from-amber-400 to-yellow-300", product: "Fruitly fruit snack", quote: "It’s not baked or fried, totally healthy and the taste is amazing. I can’t stop my hand, I just eat, eat, eat…", rating: null, verified: false },
  { name: "Turshar Patil", initials: "SR", avatar: "from-orange-400 to-rose-300", product: "Fruitly fruit snacks", quote: "I never knew that eating this healthy snack can make my sugar control so soon. It’s a bless.", rating: null, verified: false },
  { name: "Amarjeet Singh", initials: "AS", avatar: "from-cyan-400 to-blue-300", product: "Fruitly fruit snacks", quote: "Finally - I got something that is healthy and delicious to meet my travel needs. Thanks, Fruitly for bringing this amazing product. in love with it.", rating: null, verified: false },
  { name: "Prajwal Dhonde", initials: "PD", avatar: "from-lime-500 to-emerald-300", product: "Freeze-dried fruit snacks", quote: "Fruitly’s freeze-dried snacks are a perfect match for my busy lifestyle. The packaging is travel-friendly, the taste is top-notch.", rating: null, verified: false },
  { name: "Prathamesh Nikam", initials: "PN", avatar: "from-pink-400 to-rose-300", product: "Fruitly fruit snacks", quote: "I never knew that eating this healthy snack can satisfy my sweet cravings so soon. It’s a absolute blessing.", rating: null, verified: false },
  { name: "Sandesh Borate", initials: "SB", avatar: "from-yellow-400 to-orange-300", product: "Fruitly fruit snacks", quote: "Super crunchy, fresh, and bursting with natural fruit flavor. Great quality and very easy to carry around during hectic work days.", rating: null, verified: false },
];


type SpotlightSlide = {
  key: string;
  title: string;
  description: string;
  image: string;
  slug: string | null;
  category: string;
};

function Home() {
  const { data: products = [] } = useQuery(productsQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);

  const publicProducts = products.filter((product) => !isLegacySeedProduct(product.slug));
  const publicCategoryIds = new Set(publicProducts.map((product) => product.category_id).filter(Boolean));
  const publicCategories = categories.filter((category) => publicCategoryIds.has(category.id));
  const categoryById = new Map(publicCategories.map((category) => [category.id, category]));
  const spotlightCategoryIds = new Set(
    publicCategories.filter((category) => category.featured).map((category) => category.id),
  );
  const spotlightProducts = publicProducts
    .filter((product) => !product.spotlight_hidden)
    .filter((product) =>
      product.featured || (product.category_id && spotlightCategoryIds.has(product.category_id)),
    )
    .filter((product) => Boolean(productImage(product)))
    .sort(
      (a, b) =>
        Number(b.featured) - Number(a.featured) || a.sort_order - b.sort_order,
    );

  // A product is included when it is explicitly featured or its category is featured.
  const spotlights: SpotlightSlide[] = spotlightProducts.slice(0, 8).map((product) => ({
    key: product.id,
    title: product.name,
    description:
      product.short_description ||
      "Explore this fruit in a distinctive format, with the details for this product close at hand.",
    image: productImage(product)!,
    slug: product.slug,
    category: categoryById.get(product.category_id ?? "")?.name ?? "Fruitly selection",
  }));

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
            <div className="mt-9 hidden flex-wrap items-center gap-x-5 gap-y-2 border-t border-primary/10 pt-5 text-xs font-semibold uppercase tracking-[0.13em] text-muted-foreground md:flex">
              <span>Dehydrated fruit</span>
              <span className="h-1 w-1 rounded-full bg-clay" aria-hidden />
              <span>Freeze-dried fruits</span>
              <span className="h-1 w-1 rounded-full bg-clay" aria-hidden />
              <span>Fruit-first snacking</span>
            </div>
            <div className="mt-8 flex items-center gap-3 border-t border-primary/10 pt-5 md:hidden">
              <div className="min-w-0 flex-1">
                <p className="text-[0.62rem] font-bold uppercase leading-5 tracking-[0.12em] text-muted-foreground">
                  Dehydrated fruit <span className="mx-1 text-clay">•</span> Fruit-first snacking
                </p>
                <p className="mt-1 text-[0.62rem] font-bold uppercase leading-5 tracking-[0.12em] text-muted-foreground">
                  Freeze-dried fruits
                </p>
                <p className="mt-2 text-xs font-semibold text-primary">Goodness in every bite.</p>
              </div>
              <div className="relative flex h-[112px] w-[138px] shrink-0 items-center justify-center overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-[#eef3d9] via-[#f8f4e5] to-[#e9efcf] p-1">
                <img
                  src="/fruitly-products/fruitly-hero-collection.png"
                  alt="A compact assortment of Fruitly fruit snacks"
                  width={1640}
                  height={850}
                  loading="eager"
                  decoding="async"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>

          <div className="relative mx-auto hidden w-full max-w-[760px] items-center justify-center md:flex md:max-w-none">
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

      {spotlights.length > 0 && (
        <section className="container-page py-6 sm:py-16 md:py-20" aria-label="Fruitly spotlight">
          <div className="fruitly-spotlight-shell relative overflow-hidden rounded-[2rem] text-primary-foreground shadow-lift">
            <div className="grid min-h-0 md:min-h-[330px] md:grid-cols-[0.92fr_1.08fr]">
              <div className="relative overflow-hidden bg-background/10 p-3 sm:p-6 md:p-8">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10" aria-hidden />
                <img
                  key={currentSlide.key}
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  loading="lazy"
                  width={1024}
                  height={1536}
                  className="relative mx-auto h-[260px] w-full max-w-[320px] rounded-[1.1rem] bg-[#f9f5e9] object-contain shadow-lift sm:h-[320px] sm:rounded-[1.4rem] md:aspect-[2/3] md:h-auto"
                />
                <span className="absolute left-7 top-7 rounded-full bg-background/95 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-primary shadow-soft sm:left-9 sm:top-9">
                  {currentSlide.category}
                </span>
              </div>
  
              <div className="relative flex flex-col justify-center px-5 py-5 sm:px-9 sm:py-10 md:px-12 lg:px-16">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-white/75">
                  The Fruitly spotlight
                </p>
                <h2 className="mt-2 max-w-xl text-2xl leading-[1.08] tracking-[-0.035em] text-white sm:mt-4 sm:text-4xl lg:text-5xl">
                  {currentSlide.title}
                </h2>
                <p className="mt-2 max-w-lg text-sm leading-6 text-white/80 sm:mt-4 sm:leading-7 sm:text-base">
                  {currentSlide.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3 sm:mt-7">
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
                  <div className="mt-4 flex items-center gap-2 sm:mt-7" aria-label="Choose spotlight slide">
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
        </section>
  
        )}

      <section className="container-page py-10 sm:py-20 md:py-24">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">Find your kind of fruit</p>
            <h2 className="mt-2 text-3xl leading-tight sm:mt-3 sm:text-4xl md:text-5xl">A range worth reaching for.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:mt-4 sm:text-base sm:leading-7">
              Explore the formats and flavours in the Fruitly collection.
            </p>
          </div>
          <Link to="/products" className="inline-flex items-center gap-2 self-start text-sm font-bold text-primary transition-colors hover:text-foreground md:self-auto">
            View all products <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:mt-9 sm:grid-cols-2 sm:gap-4 lg:mt-12 lg:grid-cols-3">
          {publicCategories.map((category, i) => {
            const Icon = categoryIcons[i % categoryIcons.length] ?? Apple;
            const count = publicProducts.filter((product) => product.category_id === category.id).length;
            return (
              <Link
                key={category.id}
                to="/products/$category"
                params={{ category: category.slug }}
                className="group rounded-[1.6rem] border border-border/80 bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-accent/70 hover:shadow-lift sm:rounded-3xl sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/60 text-primary transition-colors group-hover:bg-accent sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
                </div>
                <h3 className="mt-5 text-xl sm:mt-6">{category.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground sm:min-h-12">
                  {category.description}
                </p>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-primary sm:mt-5">
                  {count} {count === 1 ? "product" : "products"}
                </p>
              </Link>
            );
          })}
          <article className="rounded-[1.6rem] border border-dashed border-primary/25 bg-secondary/45 p-5 shadow-soft sm:rounded-3xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-background text-primary sm:h-12 sm:w-12">
                <Snowflake className="h-5 w-5" aria-hidden />
              </span>
              <span className="rounded-full bg-clay/15 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-foreground">
                Coming soon
              </span>
            </div>
            <h3 className="mt-5 text-xl sm:mt-6">Freeze-dried fruits</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground sm:min-h-12">
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

          <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-9 sm:grid-cols-2 sm:gap-5 lg:mt-12 lg:grid-cols-4">
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

      <section className="relative overflow-hidden border-y border-border/70 bg-gradient-to-b from-[#f3f5ff] via-background to-[#fffaf0] py-16 sm:py-20 md:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/80 px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-primary shadow-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-clay" aria-hidden />
              Loved By Fruit Lovers
            </p>
            <h2 className="mt-3 text-3xl leading-tight tracking-[-0.035em] sm:text-4xl md:text-5xl">
              What our customers say
            </h2>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>Meet the Fruitly community</span>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2" aria-label="Current Fruitly products">
              {["Jamun Cubes", "Mango Cubes", "Strawberry Whole", "Lemon Slices", "Papaya Cubes"].map((product) => (
                <span key={product} className="rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground">{product}</span>
              ))}
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
                <h3 className="mt-5 pr-8 text-base font-semibold leading-snug">{review.product ?? "Customer feedback"}</h3>
                {review.quote ? (
                  <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">“{review.quote}”</p>
                ) : (
                  <div className="mt-3 flex flex-1 flex-col justify-center rounded-2xl border border-dashed border-border/80 bg-secondary/30 px-4 py-5">
                    <p className="text-sm font-semibold text-foreground">Review pending approval</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">We’ll share this customer’s feedback here once their review is received and approved.</p>
                    <Link to="/contact?topic=testimonial" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                      Share feedback <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  </div>
                )}
                <div className="mt-6 flex items-center gap-3 border-t border-border/70 pt-4">
                  <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${review.avatar} text-xs font-bold text-white shadow-sm`} aria-hidden>
                    {review.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{review.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{review.quote ? "Customer feedback" : "Awaiting approved feedback"}</p>
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
