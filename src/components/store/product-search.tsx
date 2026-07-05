"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "@bprogress/next";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { Product } from "@/lib/store/types";
import { formatPrice } from "@/lib/format";
import { Loader2 } from "lucide-react";

const RESULT_LIMIT = 8;
const DEBOUNCE_MS = 250;

export function ProductSearch({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const requestIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setIsLoading(false);
      abortRef.current?.abort();
    }
  }, [open]);

  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setResults([]);
      setIsLoading(false);
      abortRef.current?.abort();
      return;
    }

    setIsLoading(true);

    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const requestId = ++requestIdRef.current;

      try {
        const response = await fetch(
          `/api/products?status=active&q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal }
        );
        const data = (await response.json()) as Product[];

        if (requestId !== requestIdRef.current) return;

        setResults(data.slice(0, RESULT_LIMIT));
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        if (requestIdRef.current === requestId) setResults([]);
      } finally {
        if (requestIdRef.current === requestId) setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [query]);

  const handleSelect = (slug: string) => {
    onOpenChange(false);
    router.push(`/shop/products/${slug}`);
  };

  const handleViewAll = () => {
    onOpenChange(false);
    router.push(`/shop/products?q=${encodeURIComponent(query.trim())}`);
  };

  const trimmedQuery = query.trim();
  const showResults = trimmedQuery.length > 0;

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      shouldFilter={false}
      title="Search products"
      description="Search by name, category, or collection"
    >
      <CommandInput
        placeholder="Search products..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList className="min-h-[320px] max-h-[320px]">
        {!showResults && (
          <div className="flex h-[320px] items-center justify-center px-4 text-center text-sm text-muted-foreground">
            Type to search products. Press{" "}
            <kbd className="mx-1 rounded border bg-muted px-1.5 py-0.5 text-xs">
              ⌘K
            </kbd>{" "}
            anytime.
          </div>
        )}

        {showResults && (
          <div className="flex min-h-[320px] flex-col">
            {isLoading && results.length === 0 ? (
              <div className="flex flex-1 items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Searching...
              </div>
            ) : results.length === 0 && !isLoading ? (
              <CommandEmpty>No products found.</CommandEmpty>
            ) : (
              <CommandGroup heading="Products">
                {results.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={product.id}
                    onSelect={() => handleSelect(product.slug)}
                    className="gap-3"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.img}
                      alt=""
                      className="size-10 shrink-0 rounded-md object-cover"
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="line-clamp-1">{product.name}</span>
                      <span className="text-xs capitalize text-muted-foreground">
                        {product.category}
                      </span>
                    </div>
                    <span className="shrink-0 text-sm font-medium">
                      {formatPrice(product.price)}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {showResults && (
              <CommandItem
                value="__view_all__"
                onSelect={handleViewAll}
                className="mt-auto border-t justify-center text-muted-foreground"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-3 animate-spin" />
                    Searching...
                  </span>
                ) : (
                  <>View all results for &ldquo;{trimmedQuery}&rdquo;</>
                )}
              </CommandItem>
            )}
          </div>
        )}
      </CommandList>
    </CommandDialog>
  );
}
