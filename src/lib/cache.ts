import { unstable_cache } from "next/cache";

// キャッシュ設定の定数
export const CACHE_TTL = {
  SHORT: 60, // 1分
  MEDIUM: 300, // 5分
  LONG: 3600, // 1時間
  VERY_LONG: 86400, // 24時間
};

// タグベースのキャッシュ無効化用タグ
export const CACHE_TAGS = {
  PRODUCTS: "products",
  PRODUCT: (id: number) => `product-${id}`,
  COMMENTS: "comments",
  COMMENT_PRODUCT: (productId: number) => `comments-product-${productId}`,
  COMMENT_USER: (userId: number) => `comments-user-${userId}`,
  USER: (id: number) => `user-${id}`,
  CART: (userId: number) => `cart-${userId}`,
  LIKES: (userId: number) => `likes-${userId}`,
  ORDERS: (userId: number) => `orders-${userId}`,
};

/**
 * キャッシュされた関数を作成するヘルパー
 */
export function createCachedFunction<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyPrefix: string,
  ttl: number = CACHE_TTL.MEDIUM,
  tags: string[] = []
): T {
  return unstable_cache(fn, [keyPrefix], {
    revalidate: ttl,
    tags,
  }) as T;
}

