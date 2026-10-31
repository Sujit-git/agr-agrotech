import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ImageOff, ArrowUpRight } from "lucide-react";

import {
  type Product,
  type Category,
  availabilityLabel,
  discountPercentage,
  formatPrice,
  productImage,
  productTagsQuery,
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
  const { data: tags = [] } = useQuery(productTagsQuery);
  const visibleTags = tags.filter((tag) => product.tags?.includes(tag.slug));
  const discount = discountPercentage(product.original_price, product.price);

  return (
    <article className="fruitly-product-card group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="block aspect-[2/3] overflow-hidden rounded-2xl bg-[#f8f4e9]"
        tabIndex={-1}
        aria-hidden
      >
        {image ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            width={1024}
            height={1536}
            className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.015]"
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
        {visibleTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {visibleTags.map((tag) => (
              <span key={tag.id} className="rounded-full bg-accent/70 px-2.5 py-1 text-[0.65rem] font-semibold text-accent-foreground">
                {tag.name}
              </span>
            ))}
          </div>
        )}
        {product.short_description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {product.short_description}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-baseline gap-x-2">
          {discount !== null && (
            <span className="text-sm text-muted-foreground line-through">{formatPrice(product.original_price, product.currency)}</span>
          )}
          <span className="font-display text-2xl">{formatPrice(product.price, product.currency)}</span>
          {discount !== null && <span className="rounded-full bg-emerald-50 px-2 py-1 text-[0.65rem] font-bold text-emerald-700">{discount}% OFF</span>}
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
