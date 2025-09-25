import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const limit = url.searchParams.get("limit");

    const products = await prisma.product.findMany({
      where: category ? { category } : undefined,
      take: limit ? parseInt(limit) : undefined,
      orderBy: { id: 'asc' }
    });

    return Response.json(products);
  } catch (error) {
    return new Response("Internal Server Error: " + error, { status: 500 });
  }
}
