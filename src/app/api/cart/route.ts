import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

async function getCartData(userId: number) {
  const cartItems = await prisma.cart.findMany({
    where: { userId },
    include: { product: true },
  });
  const items = cartItems.map((item) => ({
    product: item.product,
    quantity: item.quantity,
  }));
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  return { items, total };
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
  const userId = Number(session.user.id);
  const cart = await getCartData(userId);
  return NextResponse.json({ cart });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
  const userId = Number(session.user.id);
  const body = await req.json().catch(() => ({}));
  const productId: number = Number(body.productId);
  const quantity: number = Number(body.quantity ?? 1);
  if (!productId || quantity <= 0) {
    return NextResponse.json(
      { message: "Invalid productId or quantity" },
      { status: 400 }
    );
  }
  const existing = await prisma.cart.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  if (existing) {
    await prisma.cart.update({
      where: { userId_productId: { userId, productId } },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    await prisma.cart.create({ data: { userId, productId, quantity } });
  }
  const cart = await getCartData(userId);
  return NextResponse.json({ cart });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
  const userId = Number(session.user.id);
  const body = await req.json().catch(() => ({}));
  const productId: number = Number(body.productId);
  const quantity: number = Number(body.quantity);
  if (!productId || quantity === undefined) {
    return NextResponse.json(
      { message: "Invalid productId or quantity" },
      { status: 400 }
    );
  }
  if (quantity <= 0) {
    await prisma.cart.delete({
      where: { userId_productId: { userId, productId } },
    }).catch(() => {});
  } else {
    await prisma.cart.upsert({
      where: { userId_productId: { userId, productId } },
      update: { quantity },
      create: { userId, productId, quantity },
    });
  }
  const cart = await getCartData(userId);
  return NextResponse.json({ cart });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
  const userId = Number(session.user.id);
  let productId: number | undefined;
  try {
    const body = await req.json();
    productId = body?.productId ? Number(body.productId) : undefined;
  } catch {
    productId = undefined;
  }
  if (productId) {
    await prisma.cart.delete({
      where: { userId_productId: { userId, productId } },
    }).catch(() => {});
  } else {
    await prisma.cart.deleteMany({ where: { userId } });
  }
  const cart = await getCartData(userId);
  return NextResponse.json({ cart });
}
