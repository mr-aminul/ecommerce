"use client";

import { ThemeProvider } from "@/providers/theme-provider";
import { CartProvider } from "@/providers/cart-provider";
import { StoreHeader } from "@/components/store/header";
import { StoreFooter } from "@/components/store/footer";
import { Toaster } from "@/components/ui/sonner";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";

export default function StoreProviders({
  children,
  storeName,
}: {
  children: React.ReactNode;
  storeName: string;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <ProgressProvider color="var(--foreground)" spinnerPosition="bottom-right">
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <StoreHeader storeName={storeName} />
            <main className="flex-1">{children}</main>
            <StoreFooter storeName={storeName} />
          </div>
          <Toaster position="bottom-right" />
        </CartProvider>
      </ProgressProvider>
    </ThemeProvider>
  );
}
