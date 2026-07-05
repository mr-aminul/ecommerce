"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/providers/cart-provider";
import type { Product } from "@/lib/store/types";
import { ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export function AddToCartButton({
  product,
  quantity = 1,
  size = "default",
  openCartOnAdd = true,
}: {
  product: Product;
  quantity?: number;
  size?: "default" | "lg";
  openCartOnAdd?: boolean;
}) {
  const { addItem, isInCart, openCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = isInCart(product.id);

  const handleAdd = () => {
    addItem(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        img: product.img,
        price: product.price,
      },
      quantity
    );
    setJustAdded(true);
    toast.success("Added to cart", {
      description: `${product.name} × ${quantity}`,
    });
    if (openCartOnAdd) {
      openCart();
    }
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <Button
      size={size}
      className="w-full gap-2"
      onClick={handleAdd}
      disabled={product.stock_quantity <= 0}
    >
      {justAdded ? (
        <Check className="size-4" />
      ) : (
        <ShoppingBag className="size-4" />
      )}
      {product.stock_quantity <= 0
        ? "Out of Stock"
        : justAdded
          ? "Added!"
          : inCart
            ? "Add More"
            : "Add to Cart"}
    </Button>
  );
}
