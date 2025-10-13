import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const limit = url.searchParams.get("limit");

    const products = await prisma.product.findMany({
      where: category ? { category } : undefined,
      take: limit ? parseInt(limit) : undefined,
      orderBy: { id: "desc" },
    });

    return Response.json(products);
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

    return Response.json(product, { status: 201 });
  } catch (e: any) {
    return new Response(`Internal Server Error: ${e?.message ?? e}`, { status: 500 });
  }
}
