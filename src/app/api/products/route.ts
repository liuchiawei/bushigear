import prisma from "@/lib/prisma";
import { unstable_cache, revalidateTag } from "next/cache";
import { CACHE_TAGS, CACHE_TTL } from "@/lib/cache";

// キャッシュされた商品取得関数
async function getCachedProducts(category: string | null, limit: number | null) {
  return prisma.product.findMany({
    where: category ? { category } : undefined,
    take: limit || undefined,
    orderBy: { id: "desc" },
    include: {
      _count: {
        select: { orders: true, likes: true, comments: true },
      },
    },
  });
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const limit = url.searchParams.get("limit");
    const limitNum = limit ? parseInt(limit) : null;

    // キャッシュキーを生成
    const cacheKey = `products-${category || "all"}-${limitNum || "all"}`;
    const tags = [CACHE_TAGS.PRODUCTS];
    if (category) tags.push(`products-category-${category}`);

    // キャッシュされた関数を使用
    const cachedGetProducts = unstable_cache(
      () => getCachedProducts(category, limitNum),
      [cacheKey],
      {
        revalidate: CACHE_TTL.MEDIUM, // 5分キャッシュ
        tags,
      }
    );

    const products = await cachedGetProducts();

    // キャッシュヘッダーを設定
    const headers = new Headers();
    headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");

    return Response.json(products, { headers });
  } catch (e: any) {
    return new Response(`Internal Server Error: ${e?.message ?? e}`, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const product = await prisma.product.create({
      data: {
        name_en: data.name_en,
        name_jp: data.name_jp,
        name_cn: data.name_cn,
        category: data.category,
        brand: data.brand,
        price: parseInt(String(data.price)),
        image: data.image,
        description_en: data.description_en,
        description_jp: data.description_jp,
        description_cn: data.description_cn,
        stock: data.stock != null ? parseInt(String(data.stock)) : 0,
      },
    });

    // 商品リストのキャッシュを無効化
    revalidateTag(CACHE_TAGS.PRODUCTS);
    if (data.category) {
      revalidateTag(`products-category-${data.category}`);
    }

    return Response.json(product, { status: 201 });
  } catch (e: any) {
    return new Response(`Internal Server Error: ${e?.message ?? e}`, { status: 500 });
  }
}
