export type Product = {
  id: number;
  name: {
    en: string;
    jp: string;
    cn: string;
  };
  category: string;
  brand: string;
  price: number;
  image: string;
  description: {
    en: string;
    jp: string;
    cn: string;
  };
};