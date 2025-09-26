import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!product) {
      return new Response("Product not found", { status: 404 });
    }

    return Response.json(product);
  } catch (error) {
    return new Response("Internal Server Error: " + error, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name_en: data.name_en,
        name_jp: data.name_jp,
        name_cn: data.name_cn,
        category: data.category,
        brand: data.brand,
        price: parseInt(data.price),
        image: data.image,
        description_en: data.description_en,
        description_jp: data.description_jp,
        description_cn: data.description_cn,
      }
    });

    return Response.json(product);
  } catch (error) {
    return new Response("Internal Server Error: " + error, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    return new Response("Product deleted successfully", { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error: " + error, { status: 500 });
  }
}