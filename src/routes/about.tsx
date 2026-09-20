import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import farmImage from "@/assets/about-farm.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About AGR \u2014 Agrotech" },
      {
        name: "description",
        content:
          "AGR \u2014 Agrotech is an agriculture and food-products brand focused on natural, sustainable and value-added products from Indian farms.",
      },
      { property: "og:title", content: "About AGR \u2014 Agrotech" },
      {
        property: "og:description",
        content: "Our purpose, our approach to processing, and where AGR is headed next.",
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
          <h1 className="mt-3 max-w-2xl font-display text-4xl sm:text-5xl">
            An agriculture brand built around care
          </h1>
        </div>
      </section>

      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1.1fr_1fr] lg:gap-16 md:py-20">
        <div className="space-y-10">
          <section>
            <h2 className="font-display text-2xl">Our purpose</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              AGR &mdash; Agrotech works at the meeting point of agriculture and thoughtful
              processing. We take what the farm produces and turn it into products that keep well,
              travel well and stay close to their natural character &mdash; from compost that
              returns nutrition to the soil, to fruit preserved through dehydration and
              freeze-drying.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">[Add AGR company story here]</p>
          </section>

          <section>
            <h2 className="font-display text-2xl">Our approach</h2>
            <ul className="mt-4 space-y-4">
              <li>
                <h3 className="font-display text-lg">Agriculture first</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  We start with the crop and the soil, not with a shelf. [Add sourcing details here]
                </p>
              </li>
              <li>
                <h3 className="font-display text-lg">Modern processing</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Dehydration and freeze-drying are used to reduce moisture while protecting taste
                  and texture. [Add processing details here]
                </p>
              </li>
              <li>
                <h3 className="font-display text-lg">Sustainability</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Composting and low-waste practices are part of how we work day to day. [Add
                  sustainability details here]
                </p>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl">Where we are headed</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Our catalogue starts with vermicompost, dehydrated fruits and freeze-dried fruits.
              Fruit bars, fruit powders and vegetable powders are on the roadmap, and the range will
              grow as our processing capacity does.
            </p>
            <Button asChild className="mt-6">
              <Link to="/products">See what we make today</Link>
            </Button>
          </section>
        </div>

        <div>
          <img
            src={farmImage}
            alt="Farmland in India at early morning light"
            loading="lazy"
            width={1408}
            height={912}
            className="w-full rounded-3xl object-cover shadow-soft"
          />
          <div className="mt-6 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg">Talk to us</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Questions about a product, pack size or a bulk requirement? We&apos;re happy to help.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/contact">Contact AGR</Link>
            </Button>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
