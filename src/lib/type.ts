export type Product = {
  id: number;
  name_en: string;
  name_jp: string;
  name_cn: string;
  category: string;
  brand: string;
  price: number;
  image: string;
  description_en: string;
  description_jp: string;
  description_cn: string;
  stock: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
  total: number;
};

export type Order = {
  id: number;
  userId?: number | null;
  productId: number;
  quantity: number;
  createdAt: string;
  product?: Product;
};

export type Comment = {
  id: number;
  score: number;
  comment: string;
  productId: number;
  userId: number;
  createdAt: string;
  user?: {
    id: number;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    image?: string | null;
  };
  product?: {
    id: number;
    name_jp: string;
    name_en: string;
    brand: string;
    image: string;
  };
};
