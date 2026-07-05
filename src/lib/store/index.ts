import { promises as fs } from "fs";
import path from "path";
import { seedData } from "./seed";
import type {
  CreateOrderInput,
  CreateProductInput,
  Product,
  ProductSort,
  StoreData,
  StoreOrder,
} from "./types";

export type { ProductSort } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "store.json");

async function ensureDataFile(): Promise<void> {
  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.writeFile(DATA_PATH, JSON.stringify(seedData, null, 2), "utf-8");
  }
}

export async function readStore(): Promise<StoreData> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw) as StoreData;
}

async function writeStore(data: StoreData): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function getProducts(options?: {
  status?: "active" | "inactive" | "all";
  category?: string;
  collection?: string;
  q?: string;
  sort?: ProductSort;
}): Promise<Product[]> {
  const store = await readStore();
  let products = [...store.products];

  if (options?.status && options.status !== "all") {
    products = products.filter((p) => p.status === options.status);
  }

  if (options?.category) {
    products = products.filter((p) => p.category === options.category);
  }

  if (options?.collection) {
    products = products.filter((p) =>
      p.collections.includes(options.collection!)
    );
  }

  if (options?.q) {
    const query = options.q.toLowerCase().trim();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.collections.some((c) => c.toLowerCase().includes(query))
    );
  }

  const sort = options?.sort ?? "newest";

  switch (sort) {
    case "price-asc":
      products.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      products.sort((a, b) => b.price - a.price);
      break;
    case "name":
      products.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      products.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }

  return products;
}

export async function getProductById(id: string): Promise<Product | null> {
  const store = await readStore();
  return store.products.find((p) => p.id === id) ?? null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const store = await readStore();
  return store.products.find((p) => p.slug === slug) ?? null;
}

export async function createProduct(
  input: CreateProductInput
): Promise<Product> {
  const store = await readStore();

  const existing = store.products.find((p) => p.slug === input.slug);
  if (existing) {
    throw new Error("A product with this slug already exists");
  }

  const product: Product = {
    id: generateId("prod"),
    name: input.name,
    slug: input.slug,
    description: input.description,
    price: input.price,
    compare_at_price: input.compare_at_price,
    category: input.category,
    collections: input.collections ?? [input.category],
    img: input.img,
    images: input.images ?? [input.img],
    status: input.status,
    stock_quantity: input.stock_quantity ?? 0,
    sku_code: input.sku_code,
    created_at: new Date().toISOString(),
  };

  store.products.unshift(product);
  await writeStore(store);
  return product;
}

export async function updateProduct(
  id: string,
  updates: Partial<CreateProductInput>
): Promise<Product | null> {
  const store = await readStore();
  const index = store.products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const current = store.products[index];
  const updated: Product = {
    ...current,
    ...updates,
    collections:
      updates.collections ??
      (updates.category ? [updates.category] : current.collections),
    images: updates.images ?? current.images,
    img: updates.img ?? current.img,
  };

  store.products[index] = updated;
  await writeStore(store);
  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const store = await readStore();
  const initialLength = store.products.length;
  store.products = store.products.filter((p) => p.id !== id);
  if (store.products.length === initialLength) return false;
  await writeStore(store);
  return true;
}

export async function getOrders(): Promise<StoreOrder[]> {
  const store = await readStore();
  return store.orders.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function createOrder(input: CreateOrderInput): Promise<StoreOrder> {
  const store = await readStore();

  const items = input.items.map((item) => {
    const product = store.products.find((p) => p.id === item.product_id);
    if (!product) {
      throw new Error(`Product not found: ${item.product_id}`);
    }
    if (product.status !== "active") {
      throw new Error(`Product is not available: ${product.name}`);
    }
    if (product.stock_quantity < item.quantity) {
      throw new Error(`Insufficient stock for: ${product.name}`);
    }

    return {
      product_id: product.id,
      product_name: product.name,
      product_img: product.img,
      quantity: item.quantity,
      unit_price: product.price,
    };
  });

  const total = items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

  const order: StoreOrder = {
    id: generateId("ord"),
    items,
    customer: input.customer,
    total,
    status: "pending",
    created_at: new Date().toISOString(),
  };

  for (const item of input.items) {
    const product = store.products.find((p) => p.id === item.product_id);
    if (product) {
      product.stock_quantity -= item.quantity;
    }
  }

  store.orders.unshift(order);
  await writeStore(store);
  return order;
}

export async function getStoreSettings() {
  const store = await readStore();
  return store.store;
}

export async function updateStoreSettings(
  settings: Partial<StoreData["store"]>
) {
  const store = await readStore();
  store.store = { ...store.store, ...settings };
  await writeStore(store);
  return store.store;
}

export function getCategories(products: Product[]): string[] {
  const categories = new Set(products.map((p) => p.category));
  return Array.from(categories).sort();
}

export function getCollections(products: Product[]): string[] {
  const collections = new Set(products.flatMap((p) => p.collections));
  return Array.from(collections).sort();
}
