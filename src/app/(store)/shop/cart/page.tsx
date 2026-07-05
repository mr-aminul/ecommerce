"use client";

import Link from "next/link";
import { useCart } from "@/providers/cart-provider";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="size-7 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Button className="mt-8" asChild>
          <Link href="/shop/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">
        Shopping Cart
        <span className="ml-2 text-lg font-normal text-muted-foreground">
          ({itemCount} {itemCount === 1 ? "item" : "items"})
        </span>
      </h1>

      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex gap-4 rounded-xl border border-border/60 p-4"
          >
            <Link
              href={`/shop/products/${item.slug}`}
              className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-28"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.img}
                alt={item.name}
                className="size-full object-cover"
              />
            </Link>

            <div className="flex flex-1 flex-col">
              <Link
                href={`/shop/products/${item.slug}`}
                className="font-medium hover:underline"
              >
                {item.name}
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatPrice(item.price)} each
              </p>

              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                  >
                    <Minus className="size-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                  >
                    <Plus className="size-3" />
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.productId)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border/60 p-6">
        <div className="flex items-center justify-between text-lg">
          <span>Subtotal</span>
          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Shipping and taxes calculated at checkout
        </p>
        <Button className="mt-6 w-full gap-2" size="lg" asChild>
          <Link href="/shop/checkout">
            Proceed to Checkout
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button variant="ghost" className="mt-2 w-full" asChild>
          <Link href="/shop/products">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
