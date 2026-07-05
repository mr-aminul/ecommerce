"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/molecules/data-table";
import { order_columns } from "./columns";
import { AdminOrderRow, toAdminOrderRows } from "./data";
import type { StoreOrder } from "@/lib/store/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersTable() {
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data: StoreOrder[]) => setOrders(toAdminOrderRows(data)))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <DataTable
      columns={order_columns}
      data={orders}
      toolbar={{
        searchColumn: "id",
        searchPlaceholder: "Filter order IDs...",
        filters: [
          {
            columnName: "status",
            title: "Status",
            options: [
              { label: "Done", value: "done" },
              { label: "Processing", value: "active" },
              { label: "Pending", value: "pending" },
            ],
          },
        ],
      }}
    />
  );
}
