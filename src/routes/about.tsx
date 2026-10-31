import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Apple, Handshake, PackageCheck } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";

// Keep the established Fruitly pouch collage in the Our Story hero.
const mangoImage = "/fruitly-products/dehydrated-mango-cubes.webp";
const strawberryImage = "/fruitly-products/dehydrated-strawberry-whole.webp";
const papayaImage = "/fruitly-products/dehydrated-papaya-cubes.webp";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story | Fruitly - Pure. Fresh. Natural." },
      {
        name: "description",
        content:
          "Meet Fruitly, a fruit-first consumer brand from AGR Agrotech, focused on dehydrated fruit.",
      },
      { property: "og:title", content: "Our Story | Fruitly" },
      {
        property: "og:description",
        content: "Discover the thinking behind Fruitly's fruit-first range.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const approach = [
  {
    icon: Apple,
    title: "Fruit at the centre",
    text: "We build the range around fruit, its familiar flavours and the different textures each format offers.",
    image: "/our-story/fruit_at_the_centre.png",
    imageAlt: "Fruitly fruit selected for the Fruitly approach",
  },
  {
    icon: Handshake,
    title: "Partner-led processing",
    text: "We work with manufacturing partners for product processing, while keeping the Fruitly range and brand experience in focus.",
    image: "/our-story/partner_led_processing.png",
    imageAlt: "Fruitly partner-led fruit processing",
  },
  {
    icon: PackageCheck,
    title: "Clear product details",
    text: "Product-specific ingredients, pack information and availability belong with each product, so customers can explore with confidence.",
    image: "/our-story/clear_product_details.png",
    imageAlt: "Fresh mango selected for a Fruitly product",
  },
];

function About() {
  const mangoHeroImage = mangoImage;
  const strawberryHeroImage = strawberryImage;
  const papayaHeroImage = papayaImage;

  return (
    <SiteLayout>
      <section className="fruitly-hero-surface relative overflow-hidden border-b border-border/70">
        <div className="container-page grid items-center gap-10 py-12 sm:py-16 md:grid-cols-[1fr_0.92fr] md:gap-16 md:py-20">
          <div className="rise-in">
            <p className="eyebrow">A little about us</p>
            <h1 className="mt-4 text-4xl leading-[1.06] tracking-[-0.045em] sm:text-5xl md:text-6xl">
              Fruit is our
              <br />
              favourite place
              <br />
              to start.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Fruitly is a fruit-first consumer brand from AGR Agrotech Pvt. Ltd., bringing together
              a considered range of dehydrated fruits.
            </p>
            <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
              Our idea is simple: celebrate fruit through thoughtful product choices, clear
              information and a premium, easy-to-explore experience.
            </p>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-primary">Pure. Fresh. Natural.</p>
          </div>

          <div className="grid grid-cols-[1.15fr_0.85fr] items-center gap-3 sm:gap-4">
            <img
              src={mangoHeroImage}
              alt="Fruitly dehydrated mango cubes pouch"
              width={1024}
              height={1536}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="aspect-[4/5] w-full rounded-[1.75rem] bg-[#f8f4e9] object-contain p-2 shadow-lift"
            />
            <div className="grid gap-3 sm:gap-4">
              <img
                src={strawberryHeroImage}
                alt="Fruitly dehydrated strawberry whole pouch"
                width={1024}
                height={1536}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full rounded-[1.5rem] bg-[#f8f4e9] object-contain p-2 shadow-soft"
              />
              <img
                src={papayaHeroImage}
                alt="Fruitly dehydrated papaya cubes pouch"
                width={1024}
                height={1536}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full rounded-[1.5rem] bg-[#f8f4e9] object-contain p-2 shadow-soft"
              />
            </div>
            <p className="col-span-2 text-right text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Different fruits. Distinctive textures. One fruit-first idea.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page grid gap-8 py-16 sm:py-20 md:grid-cols-[0.72fr_1.28fr] md:gap-16 md:py-24">
        <div>
          <p className="eyebrow">Why we exist</p>
          <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">Make fruit the interesting part.</h2>
        </div>
        <div className="space-y-5 text-base leading-8 text-muted-foreground">
          <p>
            Fruit comes in remarkable colours, flavours and textures. Fruitly brings that variety
            into a focused range of fruit snacks, including dehydrated formats.
          </p>
          <p>
            AGR Agrotech works with manufacturing partners for processing. Fruitly brings the
            consumer-facing brand, product presentation and customer experience together, with
            product-specific details available in the catalogue.
          </p>
        </div>
      </section>

      <section className="border-y border-border/70 bg-card py-16 sm:py-20 md:py-24">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="eyebrow">The Fruitly approach</p>
            <h2 className="mt-3 text-3xl leading-tight sm:text-4xl md:text-5xl">Thoughtful from product to page.</h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              The way we present our range should be as clear and considered as the fruit itself.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {approach.map((item, index) => (
              <article key={item.title} className="rounded-3xl border border-border/80 bg-background p-5 shadow-soft sm:p-6">
                <div className="mb-5 flex aspect-[11/10] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#eef3d9] via-[#f8f4e5] to-[#e9efcf]">
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    width={420}
                    height={381}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/60 text-primary">
                    <item.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="font-display text-sm text-clay">0{index + 1}</span>
                </div>
                <h3 className="mt-5 text-xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20 md:py-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-12 text-primary-foreground sm:px-12 sm:py-14 md:px-16">
          <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border border-white/15 md:h-72 md:w-72" aria-hidden />
          <div className="relative max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">The Fruitly promise</p>
            <h2 className="mt-4 text-3xl leading-tight sm:text-4xl">A clear, considered way to discover fruit.</h2>
            <p className="mt-4 leading-7 text-white/80">
              We are here to make it easier to explore our range, understand each product and get
              the information you need before making an enquiry.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary" className="rounded-full px-6">
                <Link to="/products">Explore products <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/30 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white">
                <Link to="/contact">Talk to Fruitly</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
