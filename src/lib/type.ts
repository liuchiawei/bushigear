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
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
  total: number;
};