type ShopProductsParams = {
  collection?: string;
  category?: string;
  q?: string;
  sort?: string;
};

export function buildShopProductsUrl(params: ShopProductsParams = {}): string {
  const search = new URLSearchParams();

  if (params.collection) search.set("collection", params.collection);
  if (params.category) search.set("category", params.category);
  if (params.q) search.set("q", params.q);
  if (params.sort && params.sort !== "newest") search.set("sort", params.sort);

  const query = search.toString();
  return query ? `/shop/products?${query}` : "/shop/products";
}
