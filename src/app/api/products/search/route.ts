import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("q");
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 10;

    // 如果沒有查詢字串，返回空陣列
    if (!query || query.trim().length === 0) {
      return NextResponse.json([]);
    }

    // 模糊搜尋邏輯：搜尋 name_en, name_jp, name_cn, brand, category
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name_en: { contains: query, mode: "insensitive" } },
          { name_jp: { contains: query, mode: "insensitive" } },
          { name_cn: { contains: query, mode: "insensitive" } },
          { brand: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
        ],
      },
      take: Math.min(limit, 20), // 最多返回 20 筆結果
      orderBy: { id: "desc" },
    });

    return NextResponse.json(products);
  } catch (e: any) {
    console.error("Search error:", e);
    return NextResponse.json(
      { error: `Internal Server Error: ${e?.message ?? e}` },
      { status: 500 }
    );
  }
}

