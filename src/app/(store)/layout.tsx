import { getStoreSettings } from "@/lib/store";
import StoreProviders from "./store-providers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Custom Eco Shop",
    default: "Custom Eco Shop",
  },
};

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await getStoreSettings();

  return <StoreProviders storeName={store.name}>{children}</StoreProviders>;
}
