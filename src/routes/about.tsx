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
          "Discover AGR Agrotech, building a sustainable value chain from Indian agriculture to natural nutrition through responsible sourcing and modern processing.",
      },
      { property: "og:title", content: "About AGR \u2014 Agrotech" },
      {
        property: "og:description",
        content: "Our business, approach and vision: from agriculture to nutrition, naturally.",
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
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">About AGR Agrotech</h1>
          <p className="mt-4 font-display text-xl text-primary sm:text-2xl">
            Growing Agriculture. Advancing Nutrition. Creating Value.
          </p>
        </div>
      </section>

      <section className="container-page grid gap-10 py-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16 md:py-20">
        <div className="max-w-2xl space-y-5 leading-relaxed text-muted-foreground">
          <p>
            AGR Agrotech is an emerging agri-business focused on building a sustainable value chain
            from agriculture to nutrition. We combine responsible sourcing, modern processing
            technologies, and quality-driven practices to develop products for both domestic and
            global markets.
          </p>
          <p>
            Our business spans sustainable agricultural inputs, dehydrated and freeze-dried fruits,
            and plant-based nutrition ingredients, with a focus on delivering consistent quality,
            natural value, and scalable solutions.
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
          <p className="eyebrow">What we do</p>
          <h2 className="mt-3 font-display text-3xl">Our Business</h2>
          <div className="mt-9 grid gap-8 md:grid-cols-3">
            <div className="border-t border-primary pt-5">
              <h3 className="font-display text-xl">Sustainable Agriculture</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                We develop organic soil-enrichment products, including vermicompost and organic
                manure, supporting healthier soil and more sustainable farming practices.
              </p>
            </div>
            <div className="border-t border-primary pt-5">
              <h3 className="font-display text-xl">Dehydrated &amp; Freeze-Dried Fruits</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Using advanced preservation technologies, we transform quality fruits into
                convenient, shelf-stable ingredients while maintaining their natural taste, color,
                and nutritional characteristics.
              </p>
            </div>
            <div className="border-t border-primary pt-5">
              <h3 className="font-display text-xl">Plant-Based Nutrition</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Our expanding portfolio will include fruit, vegetable, and superfood powders
                designed for food, wellness, and functional nutrition applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page grid gap-12 py-14 md:grid-cols-2 md:gap-16 md:py-20">
        <section>
          <h2 className="font-display text-2xl">Our Approach</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            At AGR Agrotech, we focus on building reliable, quality-driven and scalable agricultural
            value chains. From sourcing and processing to packaging and delivery, we emphasize
            consistency, traceability, food safety, and responsible production.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl">Our Vision</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            To build a trusted, globally recognized agri-nutrition company that connects Indian
            agricultural potential with growing global demand for natural, nutritious, and
            value-added products.
          </p>
        </section>
      </div>

      <section className="border-t border-border bg-secondary/40 py-14 md:py-20">
        <div className="container-page max-w-4xl">
          <h2 className="font-display text-2xl">Our Commitment</h2>
          <p className="mt-4 font-display text-xl text-primary">Quality • Innovation • Sustainability • Integrity</p>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            We are committed to creating long-term value for farmers, business partners, customers,
            and stakeholders while contributing to a more sustainable and nutrition-conscious future.
          </p>
          <p className="mt-8 font-display text-xl">AGR Agrotech — From Agriculture to Nutrition, Naturally.</p>
          <Button asChild className="mt-7">
            <Link to="/contact">Contact AGR</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
