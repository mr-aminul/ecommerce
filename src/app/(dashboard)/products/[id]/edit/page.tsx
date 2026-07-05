import { FormPageLayout } from "@/components/layout/form-page-layout/layout";
import ProductForm from "@/components/organisms/forms/dashboard/products/product-form";
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
    title: product ? `Edit ${product.name}` : "Product not found",
    description: "Update product details in your store catalog.",
  };
}

export default async function ProductEditPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <FormPageLayout>
      <ProductForm mode="edit" product={product} />
    </FormPageLayout>
  );
}
