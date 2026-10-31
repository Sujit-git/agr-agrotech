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
    <span className={`rounded-full px-2 py-0.5 text-[0.58rem] font-semibold tracking-wide sm:px-2.5 sm:py-1 sm:text-[0.68rem] ${tone}`}>
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
    <article className="fruitly-product-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-soft sm:rounded-3xl">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="block aspect-square overflow-hidden bg-[#f8f4e9] sm:aspect-[2/3] sm:rounded-2xl"
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

      <div className="flex flex-1 flex-col p-3 sm:p-6">
        {category && <p className="eyebrow text-[0.62rem]">{category.name}</p>}
        <h3 className="mt-1.5 text-base leading-snug sm:mt-2 sm:text-xl">
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="transition-colors hover:text-primary"
          >
            {product.name}
          </Link>
        </h3>
        {visibleTags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {visibleTags.map((tag) => (
              <span key={tag.id} className="rounded-full border border-lime-200 bg-lime-50 px-2 py-0.5 text-[0.58rem] font-semibold leading-4 text-emerald-800 sm:px-2.5 sm:py-1 sm:text-[0.65rem]">
                {tag.name}
              </span>
            ))}
          </div>
        )}
        {product.short_description && (
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
            {product.short_description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-baseline gap-x-1.5 sm:mt-5 sm:gap-x-2">
          {discount !== null && (
            <span className="text-sm text-muted-foreground line-through">{formatPrice(product.original_price, product.currency)}</span>
          )}
          <span className="font-display text-xl sm:text-2xl">{formatPrice(product.price, product.currency)}</span>
          {discount !== null && <span className="rounded-full bg-emerald-50 px-2 py-1 text-[0.65rem] font-bold text-emerald-700">{discount}% OFF</span>}
          {product.unit && <span className="text-sm text-muted-foreground">/ {product.unit}</span>}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3 sm:gap-3 sm:pt-5">
          <AvailabilityBadge value={product.availability} />
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="relative z-10 inline-flex items-center gap-1 text-xs font-bold text-primary transition-colors hover:text-foreground sm:text-sm"
          >
            View details <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
