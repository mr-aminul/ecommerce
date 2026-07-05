import Link from "next/link";

export function StoreFooter({ storeName }: { storeName: string }) {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <p className="text-lg font-semibold">{storeName}</p>
            <p className="text-sm text-muted-foreground">
              Curated essentials for modern living. Quality products, thoughtfully selected.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Shop</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/shop/products" className="hover:text-foreground transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop/products?collection=tops" className="hover:text-foreground transition-colors">
                  Clothing
                </Link>
              </li>
              <li>
                <Link href="/shop/products?collection=accessories" className="hover:text-foreground transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Support</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/shop/cart" className="hover:text-foreground transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/shop/checkout" className="hover:text-foreground transition-colors">
                  Checkout
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Admin</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-foreground transition-colors">
                  Orders
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border/60 pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {storeName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
