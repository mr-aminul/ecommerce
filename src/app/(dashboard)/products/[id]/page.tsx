import { FormPageLayout } from "@/components/layout/form-page-layout/layout";
import ProductDetailView from "@/components/organisms/products/product-detail-view";
import { getProductById } from "@/lib/store";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  return {
    title: product ? product.name : "Product not found",
    description: product?.description.slice(0, 160),
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <FormPageLayout>
      <ProductDetailView product={product} />
    </FormPageLayout>
  );
}
