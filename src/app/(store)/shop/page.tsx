import {
  getCollections,
  getProducts,
  getStoreSettings,
} from "@/lib/store";
import { StoreHero, FeaturedProducts } from "@/components/store/hero";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse our curated collection of quality products",
};

export default async function ShopHomePage() {
  const [store, products] = await Promise.all([
    getStoreSettings(),
    getProducts({ status: "active" }),
  ]);

  const collections = getCollections(products).slice(0, 6);

  return (
    <>
      <StoreHero storeName={store.name} />
      <FeaturedProducts products={products} />

      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            Shop by Category
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore our collections
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {collections.map((collection) => (
              <Link
                key={collection}
                href={`/shop/products?collection=${collection}`}
                className="group flex flex-col items-center justify-center rounded-xl border border-border/60 bg-card p-6 text-center transition-all duration-300 hover:border-foreground hover:shadow-sm"
              >
                <span className="text-2xl font-light text-muted-foreground group-hover:text-foreground">
                  {collection.charAt(0).toUpperCase()}
                </span>
                <span className="mt-2 text-sm font-medium capitalize">
                  {collection}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
