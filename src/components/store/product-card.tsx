import Link from "next/link";
import type { Product } from "@/lib/store/types";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product }: { product: Product }) {
  const hasDiscount =
    product.compare_at_price && product.compare_at_price > product.price;

  return (
    <Link
      href={`/shop/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300 hover:border-border hover:shadow-md"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.img}
          alt={product.name}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {hasDiscount && (
          <Badge className="absolute left-3 top-3 bg-foreground text-background">
            Sale
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {product.category}
        </p>
        <h3 className="line-clamp-2 text-sm font-medium leading-snug group-hover:underline">
          {product.name}
        </h3>
        <div className="mt-auto flex items-center gap-2 pt-2">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compare_at_price!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
