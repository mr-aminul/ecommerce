import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, LayoutDashboard, ShoppingBag } from "lucide-react";

export default function Home() {
  return (
    <div className="flex w-screen items-center flex-col space-y-6 justify-center min-h-screen overflow-hidden text-center px-4">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-foreground text-background">
        <span className="text-lg font-bold tracking-wider">CE</span>
      </div>
      <h1 className="text-5xl max-w-3xl font-light tracking-tight sm:text-7xl">
        Custom Ecommerce Platform
      </h1>
      <p className="text-muted-foreground max-w-2xl text-lg">
        A connected admin dashboard and customer storefront. Manage products in
        the dashboard — they appear instantly in the shop. Orders from checkout
        flow directly into your admin panel.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild size="lg" className="mt-2 gap-2">
          <Link href="/shop">
            <ShoppingBag className="size-4" />
            Visit Storefront
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button asChild variant="secondary" size="lg" className="mt-2 gap-2">
          <Link href="/products">
            <LayoutDashboard className="size-4" />
            Admin Dashboard
          </Link>
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Store at <Link href="/shop" className="underline underline-offset-4">/shop</Link>
        {" · "}
        Admin at <Link href="/products" className="underline underline-offset-4">/products</Link>
      </p>
    </div>
  );
}
