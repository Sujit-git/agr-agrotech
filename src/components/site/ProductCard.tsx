import { Link } from "@tanstack/react-router";
import { ImageOff, ArrowUpRight } from "lucide-react";

import {
  type Product,
  type Category,
  availabilityLabel,
  formatPrice,
  productImage,
} from "@/lib/catalog";

function AvailabilityBadge({ value }: { value: string }) {
  const tone =
    value === "available"
      ? "bg-accent/70 text-accent-foreground"
      : value === "coming_soon"
        ? "bg-clay/15 text-foreground"
        : "bg-muted text-muted-foreground";
  return (
    <span className={`rounded-full px-2.5 py-1 text-[0.68rem] font-semibold tracking-wide ${tone}`}>
      {availabilityLabel(value)}
    </span>
  );
}

export function ProductCard({
  product,
  category,
}: {
  product: Product;
  category?: Category | undefined;
}) {
  const image = productImage(product);

  return (
    <article className="fruitly-product-card group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="block aspect-square overflow-hidden bg-secondary"
        tabIndex={-1}
        aria-hidden
      >
        {image ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            width={1008}
            height={1008}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageOff className="h-8 w-8" />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {category && <p className="eyebrow text-[0.62rem]">{category.name}</p>}
        <h3 className="mt-2 text-xl leading-snug">
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="transition-colors hover:text-primary"
          >
            {product.name}
          </Link>
        </h3>
        {product.short_description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {product.short_description}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-baseline gap-x-2">
          <span className="font-display text-2xl">{formatPrice(product.price, product.currency)}</span>
          {product.unit && <span className="text-sm text-muted-foreground">/ {product.unit}</span>}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <AvailabilityBadge value={product.availability} />
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="relative z-10 inline-flex items-center gap-1 text-sm font-bold text-primary transition-colors hover:text-foreground"
          >
            View details <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
