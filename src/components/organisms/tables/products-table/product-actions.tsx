"use client";

import { useRouter } from "@bprogress/next";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/store/types";
import { Loader, MoreHorizontal } from "lucide-react";

type ProductActionsProps = {
  product: Product;
  onMutate: () => void;
  onDeleteRequest: (product: Product) => void;
};

export function ProductActions({
  product,
  onMutate,
  onDeleteRequest,
}: ProductActionsProps) {
  const router = useRouter();

  const handleToggleStatus = async () => {
    const nextStatus = product.status === "active" ? "inactive" : "active";

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

      toast("Status updated", {
        description: `${product.name} is now ${nextStatus}.`,
      });
      onMutate();
    } catch (error) {
      toast("Failed to update status", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  return (
    <div className="flex justify-end" onClick={(event) => event.stopPropagation()}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="z-[100] w-48">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onSelect={() => router.push(`/products/${product.id}`)}
          >
            View details
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => router.push(`/products/${product.id}/edit`)}
          >
            Edit product
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleToggleStatus}>
            Mark as {product.status === "active" ? "inactive" : "active"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              void navigator.clipboard.writeText(product.id);
              toast("Copied", { description: "Product ID copied to clipboard." });
            }}
          >
            Copy product ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => window.open(`/shop/products/${product.slug}`, "_blank")}
          >
            View in store
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => onDeleteRequest(product)}
          >
            Delete product
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
