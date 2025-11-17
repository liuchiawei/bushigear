import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

const COMMENT_MIN_SCORE = 1;
const COMMENT_MAX_SCORE = 5;

function parseScore(value: unknown) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  if (n < COMMENT_MIN_SCORE || n > COMMENT_MAX_SCORE) return null;
  return Math.round(n);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mine = searchParams.get("mine") === "1";
  const productIdParam = searchParams.get("productId");
  const userIdParam = searchParams.get("userId");

  if (!mine && !productIdParam && !userIdParam) {
    return NextResponse.json({ message: "productId or userId is required" }, { status: 400 });
  }

  const session = await auth();
  const userId = session?.user?.id ? Number(session.user.id) : null;

  if (mine && !userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const where = mine
    ? { userId: userId! }
    : userIdParam
      ? { userId: Number(userIdParam) }
      : { productId: Number(productIdParam) };

  try {
    const comments = await prisma.comment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
        ...(mine
          ? {
              product: {
                select: {
                  id: true,
                  name_jp: true,
                  name_en: true,
                  brand: true,
                  image: true,
                },
              },
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ comments });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message ?? "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const userId = Number(session.user.id);

  try {
    const body = await req.json().catch(() => ({}));
    const productId = Number(body.productId);
    const score = parseScore(body.score);
    const commentRaw = typeof body.comment === "string" ? body.comment.trim() : "";

    if (!productId || !Number.isFinite(productId)) {
      return NextResponse.json({ message: "Invalid productId" }, { status: 400 });
    }
    if (score === null) {
      return NextResponse.json({ message: "Score must be between 1 and 5" }, { status: 400 });
    }
    if (!commentRaw) {
      return NextResponse.json({ message: "Comment is required" }, { status: 400 });
    }

    const hasOrder = await prisma.order.findFirst({
      where: { userId, productId },
      select: { id: true },
    });

    if (!hasOrder) {
      return NextResponse.json({ message: "購入履歴がありません" }, { status: 403 });
    }

    const newComment = await prisma.comment.create({
      data: {
        productId,
        userId,
        score,
        comment: commentRaw,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ comment: newComment }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message ?? "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const commentId = Number(body.id);
    if (!commentId) {
      return NextResponse.json({ message: "Invalid comment id" }, { status: 400 });
    }

    const existing = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, userId: true },
    });
    if (!existing) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    const force = Boolean(body.force);
    if (!force && existing.userId !== Number(session.user.id)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.comment.delete({ where: { id: commentId } });
    return NextResponse.json({ ok: true, deletedId: commentId });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message ?? "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const commentId = Number(body.id);
    const force = Boolean(body.force);
    const score = body.score !== undefined ? parseScore(body.score) : undefined;
    const commentRaw =
      body.comment !== undefined
        ? (typeof body.comment === "string" ? body.comment.trim() : "")
        : undefined;

    if (!commentId) {
      return NextResponse.json({ message: "Invalid comment id" }, { status: 400 });
    }
    if (score === null) {
      return NextResponse.json({ message: "Score must be between 1 and 5" }, { status: 400 });
    }
    if (commentRaw !== undefined && !commentRaw) {
      return NextResponse.json({ message: "Comment is required" }, { status: 400 });
    }

    const existing = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, userId: true },
    });
    if (!existing) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    if (!force && existing.userId !== Number(session.user.id)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: {
        score: score ?? undefined,
        comment: commentRaw ?? undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ comment: updated });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message ?? "Internal Server Error" }, { status: 500 });
  }
}
