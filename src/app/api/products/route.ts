import { NextRequest, NextResponse } from "next/server";
import { createProduct, getProducts, type ProductSort } from "@/lib/store";
import type { CreateProductInput } from "@/lib/store/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status") as
    | "active"
    | "inactive"
    | "all"
    | null;
  const category = searchParams.get("category") ?? undefined;
  const collection = searchParams.get("collection") ?? undefined;
  const q = searchParams.get("q") ?? undefined;
  const sort = (searchParams.get("sort") as ProductSort) ?? undefined;

  const products = await getProducts({
    status: status ?? "all",
    category,
    collection,
    q,
    sort,
  });

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateProductInput;
    const product = await createProduct(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create product";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
