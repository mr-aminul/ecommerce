"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { Product } from "@/lib/store/types";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { ProductActions } from "./product-actions";

export function getProductColumns(
  onMutate: () => void,
  onDeleteRequest: (product: Product) => void
): ColumnDef<Product>[] {
  return [
    {
      accessorKey: "name",
      header: "Product Name",
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={row.original.img}
              alt={row.getValue("name")}
              className="h-8 w-8 rounded-md object-cover"
            />
            <span className="font-medium">{row.getValue("name")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "collections",
      header: "Collection",
      cell: ({ row }) => {
        const data = row.original;
        if (!data.collections?.length) {
          return <span className="text-muted-foreground">No collection</span>;
        }

        return (
          <a
            href={`/shop/products?collection=${data.collections[0]}`}
            className="capitalize hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
          >
            {data.collections[0]}
          </a>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const value = row.getValue("status");
        const isActive = value === "active";
        const badgeVariant = isActive ? "secondary" : "outline";

        return (
          <Badge variant={badgeVariant}>
            {isActive && (
              <div className="size-1 rounded-full bg-green-500 dark:bg-green-400" />
            )}
            <span>{row.getValue("status")}</span>
          </Badge>
        );
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <div className="text-right">
          <button
            type="button"
            className="inline-flex items-center hover:text-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-right font-medium">
            {formatPrice({ price: row.getValue("price"), locale: "en-US" })}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <ProductActions
          product={row.original}
          onMutate={onMutate}
          onDeleteRequest={onDeleteRequest}
        />
      ),
    },
  ];
}
