import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });
    if (!product) return new Response("Product not found", { status: 404 });
    return Response.json(product);
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
    const data = await request.json();

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
      where: { id: parseInt(id) },
      data: updateData,
    });

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
    await prisma.product.delete({ where: { id: parseInt(id) } });
    return new Response(null, { status: 204 });
  } catch (e: any) {
    return new Response(`Internal Server Error: ${e?.message ?? e}`, { status: 500 });
  }
}
