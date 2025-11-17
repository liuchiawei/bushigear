import prisma from "@/lib/prisma";
import { unstable_cache, revalidateTag } from "next/cache";
import { CACHE_TAGS, CACHE_TTL } from "@/lib/cache";

async function getCachedProduct(id: number) {
  return prisma.product.findUnique({
    where: { id },
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    // 個別商品のキャッシュ
    const cachedGetProduct = unstable_cache(
      () => getCachedProduct(productId),
      [`product-${productId}`],
      {
        revalidate: CACHE_TTL.MEDIUM,
        tags: [CACHE_TAGS.PRODUCT(productId), CACHE_TAGS.PRODUCTS],
      }
    );

    const product = await cachedGetProduct();
    if (!product) return new Response("Product not found", { status: 404 });

    // キャッシュヘッダーを設定
    const headers = new Headers();
    headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");

    return Response.json(product, { headers });
  } catch (e: any) {
    return new Response(`Internal Server Error: ${e?.message ?? e}`, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    const data = await request.json();

    // 更新前の商品情報を取得（カテゴリ変更の検出用）
    const oldProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { category: true },
    });

    const updateData: any = {
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
    };

    if (data.stock != null && data.stock !== "") {
      updateData.stock = parseInt(String(data.stock));
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    // キャッシュを無効化
    revalidateTag(CACHE_TAGS.PRODUCT(productId));
    revalidateTag(CACHE_TAGS.PRODUCTS);
    if (oldProduct?.category) {
      revalidateTag(`products-category-${oldProduct.category}`);
    }
    if (data.category && data.category !== oldProduct?.category) {
      revalidateTag(`products-category-${data.category}`);
    }

    return Response.json(product);
  } catch (e: any) {
    return new Response(`Internal Server Error: ${e?.message ?? e}`, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    // 削除前の商品情報を取得（カテゴリ情報用）
    const oldProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { category: true },
    });

    await prisma.product.delete({ where: { id: productId } });

    // キャッシュを無効化
    revalidateTag(CACHE_TAGS.PRODUCT(productId));
    revalidateTag(CACHE_TAGS.PRODUCTS);
    if (oldProduct?.category) {
      revalidateTag(`products-category-${oldProduct.category}`);
    }

    return new Response(null, { status: 204 });
  } catch (e: any) {
    return new Response(`Internal Server Error: ${e?.message ?? e}`, { status: 500 });
  }
}
