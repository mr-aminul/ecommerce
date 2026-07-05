import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/store/types";
import { ProductCard } from "./product-card";

export function StoreHero({ storeName }: { storeName: string }) {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-muted via-background to-background" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            New Season Collection
          </p>
          <h1 className="text-4xl font-light tracking-tight sm:text-5xl lg:text-6xl">
            Discover quality at{" "}
            <span className="font-semibold">{storeName}</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Thoughtfully curated essentials — from everyday apparel to modern
            accessories. Free shipping on orders over $75.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/shop/products">
                Shop Now
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/shop/products?collection=accessories">
                View Accessories
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturedProducts({
  products,
  title = "Featured Products",
}: {
  products: Product[];
  title?: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Handpicked favorites from our collection
          </p>
        </div>
        <Link
          href="/shop/products"
          className="hidden text-sm font-medium underline underline-offset-4 sm:block"
        >
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
