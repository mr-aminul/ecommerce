import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getProducts } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { ProductPurchase } from "@/components/store/product-purchase";
import { ProductGallery } from "@/components/store/product-gallery";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/store/product-card";
import { Metadata } from "next";
import { ChevronLeft } from "lucide-react";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || product.status !== "active") {
    notFound();
  }

  const relatedProducts = (await getProducts({ status: "active" }))
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category ||
          p.collections.some((c) => product.collections.includes(c)))
    )
    .slice(0, 4);

  const hasDiscount =
    product.compare_at_price && product.compare_at_price > product.price;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/shop/products"
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Back to shop
      </Link>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery
          images={product.images}
          name={product.name}
          hasDiscount={!!hasDiscount}
        />

        <div className="flex flex-col">
          <p className="text-sm uppercase tracking-wider text-muted-foreground">
            {product.category}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compare_at_price!)}
              </span>
            )}
          </div>

          <p className="mt-6 text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {product.collections.map((collection) => (
              <Link
                key={collection}
                href={`/shop/products?collection=${collection}`}
              >
                <Badge variant="secondary" className="capitalize">
                  {collection}
                </Badge>
              </Link>
            ))}
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            {product.stock_quantity > 0 ? (
              <span className="text-green-600 dark:text-green-400">
                {product.stock_quantity} in stock
              </span>
            ) : (
              <span className="text-destructive">Out of stock</span>
            )}
            {product.sku_code && (
              <span className="ml-4">SKU: {product.sku_code}</span>
            )}
          </div>

          <div className="mt-8">
            <ProductPurchase product={product} />
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-20 border-t border-border/60 pt-16">
          <h2 className="text-xl font-semibold">You may also like</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
