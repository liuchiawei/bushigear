import prisma from "@/lib/prisma";
import { auth } from "@/auth";


export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { product: true,
      user: {
          select: {
            id: true,
            email: true,
            postalCode: true,
            prefecture: true,
            city: true,
            street: true,
            building: true,
            room: true,
            address: true,
          },
        },
      },
      orderBy: { id: "desc" },
    });
    return Response.json(orders);
  } catch (e: any) {
    return new Response(`Internal Server Error: ${e?.message ?? e}`, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id
      ? parseInt(String(session.user.id))
      : null;
    const body = await request.json();
    const productId = parseInt(String(body.productId));
    const quantity = parseInt(String(body.quantity));

    if (!productId || !quantity || quantity <= 0) {
      return new Response("Invalid productId or quantity", { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return new Response("Product not found", { status: 404 });
    if ((product.stock ?? 0) < quantity) {
      return new Response("Insufficient stock", { status: 409 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          productId,
          quantity,
          userId: currentUserId,
        },
        include: { product: true },
      });
      await tx.product.update({
        where: { id: productId },
        data: { stock: (product.stock ?? 0) - quantity },
      });
      return order;
    });

    return Response.json(result, { status: 201 });
  } catch (e: any) {
    return new Response(`Internal Server Error: ${e?.message ?? e}`, { status: 500 });
  }
}
