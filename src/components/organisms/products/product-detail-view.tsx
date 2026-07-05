"use client";

import Link from "next/link";
import { useRouter } from "@bprogress/next";
import { useState } from "react";
import { toast } from "sonner";
import {
  DashboardHeader,
  DashboardTitle,
} from "@/components/layout/dashboard/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/store/types";
import { ExternalLink, Loader, Pencil, Trash2 } from "lucide-react";

type ProductDetailViewProps = {
  product: Product;
};

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const router = useRouter();
  const [status, setStatus] = useState(product.status);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleToggleStatus = async () => {
    const nextStatus = status === "active" ? "inactive" : "active";
    setIsTogglingStatus(true);

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error ?? "Failed to update status");
      }

      setStatus(nextStatus);
      toast("Status updated", {
        description: `${product.name} is now ${nextStatus}.`,
      });
    } catch (error) {
      toast("Failed to update status", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error ?? "Failed to delete product");
      }

      toast("Product deleted", { description: `${product.name} has been removed.` });
      router.push("/products");
    } catch (error) {
      toast("Failed to delete product", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  };

  return (
    <>
      <DashboardHeader>
        <DashboardTitle
          enableBack
          title={product.name}
          description={`Product ID: ${product.id}`}
        />
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href={`/shop/products/${product.slug}`} target="_blank">
              <ExternalLink className="mr-2 size-4" />
              View in store
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={handleToggleStatus}
            disabled={isTogglingStatus}
          >
            {isTogglingStatus ? (
              <Loader className="mr-2 size-4 animate-spin" />
            ) : null}
            Mark as {status === "active" ? "inactive" : "active"}
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/products/${product.id}/edit`}>
              <Pencil className="mr-2 size-4" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="mr-2 size-4" />
            Delete
          </Button>
        </div>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {product.images.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="aspect-square overflow-hidden rounded-lg border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`${product.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p className="mt-2 whitespace-pre-wrap">{product.description}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={status === "active" ? "secondary" : "outline"}>
                {status === "active" && (
                  <span className="mr-1.5 inline-block size-1.5 rounded-full bg-green-500" />
                )}
                {status}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price</span>
                <span className="font-medium">
                  {formatPrice({ price: product.price, locale: "en-US" })}
                </span>
              </div>
              {product.compare_at_price != null && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Compare at</span>
                  <span className="font-medium line-through">
                    {formatPrice({
                      price: product.compare_at_price,
                      locale: "en-US",
                    })}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stock</span>
                <span className="font-medium">{product.stock_quantity}</span>
              </div>
              {product.sku_code && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SKU</span>
                  <span className="font-mono text-sm">{product.sku_code}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="capitalize">{product.category}</span>
              </div>
              <Separator />
              <div>
                <span className="text-sm text-muted-foreground">Collections</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.collections.map((collection) => (
                    <Badge key={collection} variant="outline" className="capitalize">
                      {collection}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Slug</span>
                <span className="font-mono">{product.slug}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created</span>
                <span>
                  {Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
                    new Date(product.created_at)
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete product</DialogTitle>
            <DialogDescription>
              This will permanently remove <strong>{product.name}</strong> from your
              catalog. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
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
