"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { buildShopProductsUrl } from "@/lib/shop-url";
import type { ProductSort } from "@/lib/store/types";

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name: A–Z" },
];

export function CatalogSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = (searchParams.get("sort") as ProductSort) ?? "newest";

  const handleSortChange = (sort: ProductSort) => {
    router.push(
      buildShopProductsUrl({
        collection: searchParams.get("collection") ?? undefined,
        category: searchParams.get("category") ?? undefined,
        q: searchParams.get("q") ?? undefined,
        sort,
      })
    );
  };

  return (
    <Select value={currentSort} onValueChange={(v) => handleSortChange(v as ProductSort)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
