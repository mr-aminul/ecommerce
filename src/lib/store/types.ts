export type ProductStatus = "active" | "inactive";

export type OrderStatus = "pending" | "processing" | "done";

export type ProductSort = "newest" | "price-asc" | "price-desc" | "name";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number;
  category: string;
  collections: string[];
  img: string;
  images: string[];
  status: ProductStatus;
  stock_quantity: number;
  sku_code?: string;
  created_at: string;
};

export type OrderItem = {
  product_id: string;
  product_name: string;
  product_img: string;
  quantity: number;
  unit_price: number;
};

export type CustomerInfo = {
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  postal_code: string;
};

export type StoreOrder = {
  id: string;
  items: OrderItem[];
  customer: CustomerInfo;
  total: number;
  status: OrderStatus;
  created_at: string;
};

export type StoreData = {
  products: Product[];
  orders: StoreOrder[];
  store: {
    name: string;
    contact_email: string;
    subdomain: string;
  };
};

export type CreateProductInput = {
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number;
  category: string;
  collections?: string[];
  img: string;
  images?: string[];
  status: ProductStatus;
  stock_quantity?: number;
  sku_code?: string;
};

export type CreateOrderInput = {
  items: {
    product_id: string;
    quantity: number;
  }[];
  customer: CustomerInfo;
};
