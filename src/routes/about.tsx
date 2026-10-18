import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import farmImage from "@/assets/about-farm.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About FRUITLY | Goodness in Every Bite" },
      {
        name: "description",
        content:
          "Meet FRUITLY, a natural fruit brand specializing in dehydrated and freeze-dried fruits. Goodness in Every Bite.",
      },
      { property: "og:title", content: "About FRUITLY | Goodness in Every Bite" },
      {
        property: "og:description",
        content: "Natural dehydrated fruits and freeze-dried fruits from FRUITLY.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page py-12 md:py-16">
          <p className="eyebrow">About us</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">About FRUITLY</h1>
          <p className="mt-4 font-display text-xl text-primary sm:text-2xl">
            Goodness in Every Bite.
          </p>
        </div>
      </section>

      <section className="container-page grid gap-10 py-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16 md:py-20">
        <div className="max-w-2xl space-y-5 leading-relaxed text-muted-foreground">
          <p>
            FRUITLY is a natural fruit brand specialising in dehydrated and freeze-dried fruits.
            We bring fruit into focus with a thoughtful range made for little everyday moments of
            goodness.
          </p>
          <p>
            Every product is centred on fruit: familiar flavours, thoughtfully preserved and ready
            to enjoy whenever you need a naturally fruity bite.
          </p>
        </div>
        <img
          src={farmImage}
          alt="Farmland in India at early morning light"
          loading="lazy"
          width={1408}
          height={912}
          className="w-full max-h-[28rem] rounded-lg object-cover"
        />
      </section>

      <section className="border-y border-border bg-secondary/40 py-14 md:py-20">
        <div className="container-page">
          <p className="eyebrow">Fruit, thoughtfully made</p>
          <h2 className="mt-3 font-display text-3xl">Our Fruit Range</h2>
          <div className="mt-9 grid gap-8 md:grid-cols-3">
            <div className="border-t border-primary pt-5">
              <h3 className="font-display text-xl">Dehydrated Fruits</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Discover fruit prepared through dehydration for an easy-to-enjoy fruit snack.
              </p>
            </div>
            <div className="border-t border-primary pt-5">
              <h3 className="font-display text-xl">Dehydrated &amp; Freeze-Dried Fruits</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Discover fruits preserved through freeze-drying, ready to enjoy as a light, crisp
                fruit snack.
              </p>
            </div>
            <div className="border-t border-primary pt-5">
              <h3 className="font-display text-xl">Made for Fruit Lovers</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                FRUITLY brings together a fruit-first selection for curious snackers and lovers of
                naturally fruity flavours.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page grid gap-12 py-14 md:grid-cols-2 md:gap-16 md:py-20">
        <section>
          <h2 className="font-display text-2xl">Our Approach</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            FRUITLY celebrates fruit in two distinctive forms: dehydrated and freeze-dried. Our
            focus is on the fruit, its flavour, and a satisfying bite.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl">Our Vision</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            To make fruit a delightful part of more everyday moments, with a considered selection
            of dehydrated and freeze-dried fruits.
          </p>
        </section>
      </div>

      <section className="border-t border-border bg-secondary/40 py-14 md:py-20">
        <div className="container-page max-w-4xl">
          <h2 className="font-display text-2xl">The FRUITLY Promise</h2>
          <p className="mt-4 font-display text-xl text-primary">Quality • Innovation • Sustainability • Integrity</p>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            We are here for the simple goodness of fruit, thoughtfully brought to you in every bite.
          </p>
          <p className="mt-8 font-display text-xl">FRUITLY — Goodness in Every Bite.</p>
          <Button asChild className="mt-7">
            <Link to="/contact">Contact FRUITLY</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
