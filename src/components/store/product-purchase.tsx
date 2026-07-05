"use client";

import { useState } from "react";
import type { Product } from "@/lib/store/types";
import { AddToCartButton } from "./add-to-cart-button";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

export function ProductPurchase({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const maxQuantity = Math.max(product.stock_quantity, 0);

  const decrease = () => setQuantity((q) => Math.max(1, q - 1));
  const increase = () => setQuantity((q) => Math.min(maxQuantity, q + 1));

  return (
    <div className="space-y-4">
      {maxQuantity > 0 && (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Quantity</span>
          <div className="flex items-center rounded-lg border">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9 rounded-none"
              onClick={decrease}
              disabled={quantity <= 1}
            >
              <Minus className="size-3" />
            </Button>
            <span className="w-10 text-center text-sm font-medium">{quantity}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9 rounded-none"
              onClick={increase}
              disabled={quantity >= maxQuantity}
            >
              <Plus className="size-3" />
            </Button>
          </div>
          {maxQuantity <= 10 && (
            <span className="text-xs text-muted-foreground">
              Only {maxQuantity} left
            </span>
          )}
        </div>
      )}

      <AddToCartButton product={product} quantity={quantity} size="lg" />
    </div>
  );
}
