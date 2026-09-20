import { Link } from "@tanstack/react-router";
import { ImageOff } from "lucide-react";

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
      ? "bg-accent text-accent-foreground"
      : value === "coming_soon"
        ? "bg-clay/15 text-clay"
        : "bg-muted text-muted-foreground";
  return (
    <span className={`rounded-full px-2.5 py-1 text-[0.7rem] font-medium ${tone}`}>
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
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-shadow hover:shadow-lift">
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
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageOff className="h-8 w-8" />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {category && <p className="eyebrow">{category.name}</p>}
        <h3 className="mt-2 font-display text-lg leading-snug">
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="after:absolute hover:underline"
          >
            {product.name}
          </Link>
        </h3>
        {product.short_description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {product.short_description}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-baseline gap-x-2">
          <span className="font-display text-xl">{formatPrice(product.price, product.currency)}</span>
          {product.unit && <span className="text-sm text-muted-foreground">/ {product.unit}</span>}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 pt-1">
          <AvailabilityBadge value={product.availability} />
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            View Product
          </Link>
        </div>
      </div>
    </article>
  );
}
