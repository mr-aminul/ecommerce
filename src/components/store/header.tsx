"use client";

import Link from "next/link";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/providers/cart-provider";
import { useState } from "react";
import { ProductSearch } from "./product-search";
import { CartDrawer } from "./cart-drawer";

const navLinks = [
  { href: "/shop", label: "Home" },
  { href: "/shop/products", label: "Shop" },
  { href: "/shop/products?collection=tops", label: "Clothing" },
  { href: "/shop/products?collection=accessories", label: "Accessories" },
];

export function StoreHeader({ storeName }: { storeName: string }) {
  const { itemCount, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/shop" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-foreground text-background">
              <span className="text-xs font-bold tracking-wider">CE</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">{storeName}</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
            >
              <Search className="size-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={openCart}
              aria-label="Open cart"
            >
              <ShoppingBag className="size-4" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="border-t border-border/60 px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setSearchOpen(true);
                }}
                className="text-left text-sm font-medium"
              >
                Search
              </button>
              <Link
                href="/products"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-muted-foreground"
              >
                Admin Dashboard
              </Link>
            </div>
          </nav>
        )}
      </header>

      <ProductSearch open={searchOpen} onOpenChange={setSearchOpen} />
      <CartDrawer />
    </>
  );
}
