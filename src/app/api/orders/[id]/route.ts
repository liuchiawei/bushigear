import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: { product: true },
    });
    if (!order) return new Response("Not found", { status: 404 });
    return Response.json(order);
  } catch (e: any) {
    return new Response(`Internal Server Error: ${e?.message ?? e}`, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id, 10);
    if (Number.isNaN(orderId)) return new Response("Invalid id", { status: 400 });

    const result = await prisma.$transaction(async (tx) => {
      const ord = await tx.order.findUnique({ where: { id: orderId } });
      if (!ord) throw new Error("Order not found");

      await tx.order.delete({ where: { id: orderId } });
      await tx.product.update({
        where: { id: ord.productId },
        data: { stock: { increment: ord.quantity } },
      });
      return ord;
    });

    return Response.json({ ok: true, deletedId: result.id });
  } catch (e: any) {
    const msg = e?.message ?? e;
    const code = String(msg).includes("not found") ? 404 : 500;
    return new Response(`Error: ${msg}`, { status: code });
  }
}
