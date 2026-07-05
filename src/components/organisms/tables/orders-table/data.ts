import type { StoreOrder } from "@/lib/store/types";

export type AdminOrderRow = {
  id: string;
  product_name: string;
  price: number;
  date: Date;
  status: "active" | "pending" | "done";
  product_img: string;
  customer_name: string;
  item_count: number;
};

export function toAdminOrderRows(orders: StoreOrder[]): AdminOrderRow[] {
  return orders.map((order) => {
    const firstItem = order.items[0];
    const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

    return {
      id: order.id,
      product_name:
        order.items.length === 1
          ? firstItem.product_name
          : `${firstItem.product_name} +${order.items.length - 1} more`,
      price: order.total,
      date: new Date(order.created_at),
      status:
        order.status === "processing"
          ? "active"
          : (order.status as "pending" | "done"),
      product_img: firstItem.product_img,
      customer_name: order.customer.name,
      item_count: itemCount,
    };
  });
}
