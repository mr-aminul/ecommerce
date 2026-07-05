import z from "zod";

const product_form_base = {
  name: z.string({ error: "Product title required" }).min(2).max(100),
  slug: z.string().min(2).max(100),
  description: z.string().min(10).max(1000),
  price: z.number().min(0),
  compare_at_price: z.number().min(0).optional(),
  category: z.string().min(2).max(100),
  stock_quantity: z.number().optional(),
  sku_code: z.string().optional(),
  status: z.enum(["active", "inactive"]),
} as const;

export const product_create_schema = z.object({
  ...product_form_base,
  images: z
    .array(z.instanceof(File))
    .min(1, "At least one image is required")
    .max(6, "Maximum 6 images allowed"),
});

export const product_edit_schema = z.object({
  ...product_form_base,
  images: z.array(z.instanceof(File)).max(6, "Maximum 6 images allowed"),
});

export type ProductFormType = z.infer<typeof product_create_schema>;

export function getProductFormSchema(mode: "create" | "edit") {
  return mode === "create" ? product_create_schema : product_edit_schema;
}