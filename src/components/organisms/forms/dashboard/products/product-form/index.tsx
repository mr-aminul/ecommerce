"use client";
import { useForm } from "react-hook-form";
import { getProductFormSchema, ProductFormType } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { toast } from "sonner";
import CreateProductPrimaryButtons from "../../../../../molecules/primary-buttons/creation-primary-buttons/product-create";
import EditProductPrimaryButtons from "../../../../../molecules/primary-buttons/creation-primary-buttons/product-edit";
import { CheckCircle2, Loader } from "lucide-react";
import {
  FormPageGridContainer,
  FormPageHeader,
  FormPageTitle,
} from "@/components/layout/form-page-layout/layout";
import { ProductFormLeftSide } from "./left-side";
import { ProductFormRightSide } from "./right-side";
import { useRouter } from "@bprogress/next";
import { slugify } from "@/lib/format";
import type { Product } from "@/lib/store/types";

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function productToFormValues(product: Product): ProductFormType {
  return {
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    compare_at_price: product.compare_at_price,
    category: product.category,
    stock_quantity: product.stock_quantity,
    sku_code: product.sku_code ?? "",
    images: [],
    status: product.status,
  };
}

type ProductFormProps = {
  mode?: "create" | "edit";
  product?: Product;
};

export default function ProductForm({ mode = "create", product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit" && product;

  const form = useForm<ProductFormType>({
    resolver: zodResolver(getProductFormSchema(mode)),
    defaultValues: isEdit
      ? productToFormValues(product)
      : {
          name: "",
          slug: "",
          description: "",
          price: undefined,
          compare_at_price: undefined,
          category: "",
          stock_quantity: undefined,
          sku_code: "",
          images: [],
          status: "active",
        },
  });

  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    isEdit ? product.images : []
  );

  const handleImagesChange = (newImages: File[]) => {
    setImages(newImages);
    form.setValue("images", newImages, { shouldValidate: true });
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormType) => {
    const toastId = isEdit ? "update-product" : "create-product";
    const actionLabel = isEdit ? "Updating" : "Creating";

    try {
      toast(`${actionLabel} product...`, {
        description: `Saving ${data.name}`,
        icon: <Loader className="size-4 fill-muted-foreground animate-spin" />,
        id: toastId,
      });

      let imgUrl = isEdit ? product.img : "https://via.placeholder.com/400";
      let imageUrls = isEdit ? [...existingImages] : [];

      if (data.images.length > 0) {
        const uploaded = await Promise.all(data.images.map(fileToDataUrl));
        imgUrl = uploaded[0];
        imageUrls = [...imageUrls, ...uploaded];
      }

      if (imageUrls.length === 0 && !isEdit) {
        imageUrls = [imgUrl];
      }

      if (isEdit && imageUrls.length === 0) {
        throw new Error("At least one product image is required");
      }

      const slug = data.slug || slugify(data.name);
      const payload = {
        name: data.name,
        slug,
        description: data.description,
        price: data.price,
        compare_at_price: data.compare_at_price || undefined,
        category: data.category,
        collections: [data.category],
        img: imageUrls[0] ?? imgUrl,
        images: imageUrls.length > 0 ? imageUrls : [imgUrl],
        status: data.status,
        stock_quantity: data.stock_quantity ?? 0,
        sku_code: data.sku_code,
      };

      const response = await fetch(
        isEdit ? `/api/products/${product.id}` : "/api/products",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error ?? `Failed to ${isEdit ? "update" : "create"} product`);
      }

      const saved = await response.json();

      toast(`Product ${isEdit ? "updated" : "created"} successfully!`, {
        description: `${data.name} is now live in the store`,
        id: toastId,
        icon: <CheckCircle2 className="size-4 fill-muted-foreground" />,
      });

      router.push(isEdit ? `/products/${saved.id}` : `/shop/products/${saved.slug}`);
    } catch (error: unknown) {
      toast(`Failed to ${isEdit ? "update" : "create"} product`, {
        description: error instanceof Error ? error.message : "Unknown error",
        id: toastId,
      });
      console.error({ error });
    }
  };

  const handleSubmit = form.handleSubmit(
    (data) => {
      onSubmit(data);
    },
    (errors) => {
      console.log("Validation errors:", { errors });
    }
  );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <FormPageHeader>
          <FormPageTitle
            title={isEdit ? "Edit product" : "Create product"}
            enableBack
            description={
              isEdit
                ? "Update product details. Changes appear in the storefront immediately."
                : "Fill the form to create your new product. It will appear in the storefront immediately."
            }
          />
          {isEdit ? <EditProductPrimaryButtons /> : <CreateProductPrimaryButtons />}
        </FormPageHeader>
        <FormPageGridContainer>
          <ProductFormLeftSide
            form={form}
            handleImagesChange={handleImagesChange}
            images={images}
            existingImages={existingImages}
            onRemoveExistingImage={isEdit ? handleRemoveExistingImage : undefined}
          />
          <ProductFormRightSide form={form} />
        </FormPageGridContainer>
      </form>
    </Form>
  );
}
