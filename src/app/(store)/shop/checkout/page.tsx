"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/providers/cart-provider";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader, CheckCircle2, ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
        <ShoppingBag className="size-12 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-semibold">Nothing to checkout</h1>
        <p className="mt-2 text-muted-foreground">Your cart is empty.</p>
        <Button className="mt-6" asChild>
          <Link href="/shop/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
        <CheckCircle2 className="size-16 text-green-600" />
        <h1 className="mt-6 text-2xl font-semibold">Order Placed!</h1>
        <p className="mt-2 text-muted-foreground">
          Thank you for your purchase. Your order{" "}
          <span className="font-mono text-foreground">{orderId}</span> has been
          received and will appear in the admin dashboard.
        </p>
        <div className="mt-8 flex gap-3">
          <Button asChild>
            <Link href="/shop/products">Continue Shopping</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/orders">View in Admin</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            product_id: item.productId,
            quantity: item.quantity,
          })),
          customer: {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            phone: (formData.get("phone") as string) || undefined,
            address: formData.get("address") as string,
            city: formData.get("city") as string,
            postal_code: formData.get("postal_code") as string,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to place order");
      }

      const order = await response.json();
      setOrderId(order.id);
      setOrderPlaced(true);
      clearCart();
      toast.success("Order placed successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to place order"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-5">
        <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-3">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Contact Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" required placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" name="phone" type="tel" placeholder="+1 555 0000" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium">Shipping Address</h2>
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Textarea
                id="address"
                name="address"
                required
                placeholder="123 Main St, Apt 4"
                rows={2}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" required placeholder="New York" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input
                  id="postal_code"
                  name="postal_code"
                  required
                  placeholder="10001"
                />
              </div>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader className="mr-2 size-4 animate-spin" />
                Placing Order...
              </>
            ) : (
              `Place Order — ${formatPrice(subtotal)}`
            )}
          </Button>
        </form>

        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border/60 p-6">
            <h2 className="font-medium">Order Summary</h2>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.img}
                      alt={item.name}
                      className="size-full object-cover"
                    />
                    <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-border/60 pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
