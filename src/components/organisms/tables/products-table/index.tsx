"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "@bprogress/next";
import DataTable from "@/components/molecules/data-table";
import { getProductColumns } from "./columns";
import { DataTableToolbarFilters } from "@/components/molecules/data-table/data-table-toolbar";
import type { Product } from "@/lib/store/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader } from "lucide-react";

export default function ProductsTable() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/products");

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to load products");
      }

      const data: Product[] = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDeleteRequest = useCallback((product: Product) => {
    setProductToDelete(product);
  }, []);

  const handleDelete = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error ?? "Failed to delete product");
      }

      toast("Product deleted", {
        description: `${productToDelete.name} has been removed.`,
      });
      setProductToDelete(null);
      await fetchProducts();
    } catch (error) {
      toast("Failed to delete product", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRowClick = useCallback(
    (product: Product) => {
      router.push(`/products/${product.id}`);
    },
    [router]
  );

  const columns = useMemo(
    () => getProductColumns(fetchProducts, handleDeleteRequest),
    [fetchProducts, handleDeleteRequest]
  );

  const filters: DataTableToolbarFilters[] = [
    {
      columnName: "status",
      title: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button className="mt-4" variant="outline" onClick={fetchProducts}>
          Try again
        </Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <p className="text-lg font-medium">No products yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first product to get started.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/products/create">Create product</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <DataTable
        columns={columns}
        toolbar={{
          searchColumn: "name",
          searchPlaceholder: "Filter products...",
          filters,
        }}
        data={products}
        onRowClick={handleRowClick}
      />

      <Dialog
        open={productToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setProductToDelete(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete product</DialogTitle>
            <DialogDescription>
              This will permanently remove{" "}
              <strong>{productToDelete?.name}</strong> from your catalog. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProductToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader className="mr-2 size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete product"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
