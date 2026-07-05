"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/lib/store/types";
import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";
import { buildShopProductsUrl } from "@/lib/shop-url";

export function CategoryFilter({
  collections,
}: {
  categories: string[];
  collections: string[];
}) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");
  const activeCollection = searchParams.get("collection");
  const q = searchParams.get("q") ?? undefined;
  const sort = searchParams.get("sort") ?? undefined;

  const baseParams = { q, sort };

  const filters = [
    {
      label: "All",
      href: buildShopProductsUrl(baseParams),
      active: !activeCategory && !activeCollection,
    },
    ...collections.map((c) => ({
      label: c,
      href: buildShopProductsUrl({ ...baseParams, collection: c }),
      active: activeCollection === c,
    })),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Link
          key={filter.href}
          href={filter.href}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm capitalize transition-colors duration-200",
            filter.active
              ? "border-foreground bg-foreground text-background"
              : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
          )}
        >
          {filter.label}
        </Link>
      ))}
    </div>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium">No products found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try a different filter or search term.
        </p>
        <Link
          href="/shop/products"
          className="mt-4 text-sm font-medium underline underline-offset-4"
        >
          View all products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both"
          style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
