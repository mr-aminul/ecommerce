import { NextRequest, NextResponse } from "next/server";
import { createOrder, getOrders } from "@/lib/store";
import type { CreateOrderInput } from "@/lib/store/types";

export async function GET() {
  const orders = await getOrders();
  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateOrderInput;
    const order = await createOrder(body);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
