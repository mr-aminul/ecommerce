import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFormType } from "./schema";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ImageUploader } from "@/components/organisms/image-uploader";
import { FormPageGridPrimary } from "@/components/layout/form-page-layout/layout";
import { UseFormReturn } from "react-hook-form";

type ProductFormLeftSideProps = {
  form: UseFormReturn<ProductFormType>,
  images: File[],
  handleImagesChange: (newImages: File[]) => void,
  existingImages?: string[],
  onRemoveExistingImage?: (index: number) => void,
}

export function ProductFormLeftSide({
  form,
  images,
  handleImagesChange,
  existingImages = [],
  onRemoveExistingImage,
}: ProductFormLeftSideProps) {
  return (
    <FormPageGridPrimary>
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Product Name & Slug */}
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Classic T-shirt" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="classic-t-shirt" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Product Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea className="min-h-32" placeholder="Product description..." {...field} />
              </FormControl>
              <FormDescription>Set a description to the product for better visibility.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
      <Separator />
      {/* Product Images */}
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
      </CardHeader>
      <CardContent>
        {existingImages.length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {existingImages.map((url, index) => (
              <div key={`${url}-${index}`} className="group relative aspect-square overflow-hidden rounded-md border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
                {index === 0 && (
                  <span className="absolute top-1 left-1 rounded bg-background/90 px-1.5 py-0.5 text-xs font-medium">
                    Main
                  </span>
                )}
                {onRemoveExistingImage && (
                  <button
                    type="button"
                    onClick={() => onRemoveExistingImage(index)}
                    className="absolute top-1 right-1 rounded bg-destructive px-1.5 py-0.5 text-xs text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        <ImageUploader
          images={images}
          onImagesChange={handleImagesChange} />
      </CardContent>
    </FormPageGridPrimary>
  );
}