import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return Response.json(products);
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
