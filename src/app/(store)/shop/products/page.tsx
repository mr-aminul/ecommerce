import { Suspense } from "react";
import {
  getCategories,
  getCollections,
  getProducts,
  type ProductSort,
} from "@/lib/store";
import {
  CategoryFilter,
  ProductGrid,
} from "@/components/store/category-filter";
import { CatalogSort } from "@/components/store/catalog-toolbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse our full product catalog",
};

type PageProps = {
  searchParams: Promise<{
    category?: string;
    collection?: string;
    q?: string;
    sort?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sort = (params.sort as ProductSort) ?? "newest";

  const products = await getProducts({
    status: "active",
    category: params.category,
    collection: params.collection,
    q: params.q,
    sort,
  });

  const allProducts = await getProducts({ status: "active" });
  const categories = getCategories(allProducts);
  const collections = getCollections(allProducts);

  const activeFilter = params.collection ?? params.category;
  const searchQuery = params.q?.trim();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {searchQuery ? (
              <>Results for &ldquo;{searchQuery}&rdquo;</>
            ) : activeFilter ? (
              <span className="capitalize">{activeFilter}</span>
            ) : (
              "All Products"
            )}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {products.length} {products.length === 1 ? "product" : "products"}{" "}
            available
          </p>
        </div>

        <Suspense fallback={<div className="h-9 w-[180px] animate-pulse rounded-md bg-muted" />}>
          <CatalogSort />
        </Suspense>
      </div>

      <Suspense fallback={<div className="mb-8 h-10 animate-pulse rounded-lg bg-muted" />}>
        <div className="mb-8">
          <CategoryFilter categories={categories} collections={collections} />
        </div>
      </Suspense>

      <ProductGrid products={products} />
    </div>
  );
}
