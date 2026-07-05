"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function ProductGallery({
  images,
  name,
  hasDiscount,
}: {
  images: string[];
  name: string;
  hasDiscount?: boolean;
}) {
  const galleryImages = images.length > 0 ? images : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = galleryImages[activeIndex] ?? galleryImages[0];

  if (!activeImage) return null;

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={activeImage}
          src={activeImage}
          alt={name}
          className="size-full object-cover animate-in fade-in duration-300"
        />
        {hasDiscount && (
          <Badge className="absolute left-4 top-4 bg-foreground text-background">
            Sale
          </Badge>
        )}
      </div>

      {galleryImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {galleryImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors sm:size-20",
                index === activeIndex
                  ? "border-foreground"
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={`${name} view ${index + 1}`}
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
