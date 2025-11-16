import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function ProductLikesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = Number(id);
  if (!productId) notFound();

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, name_jp: true, name_en: true, brand: true, image: true },
  });
  if (!product) notFound();

  const likes = await prisma.like.findMany({
    where: { productId },
    include: { user: { select: { id: true, email: true, lastName: true, firstName: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">商品のお気に入り</h1>
          <p className="text-sm text-gray-600">
            {product.name_jp} ({product.brand})
          </p>
        </div>
        <Link href="/dashboard" className="text-blue-600 hover:underline">← 商品一覧へ戻る</Link>
      </div>

      {likes.length === 0 ? (
        <p className="text-gray-600">お気に入りがありません。</p>
      ) : (
        <div className="space-y-4">
          {likes.map((like) => (
            <div key={like.id} className="border rounded-lg p-4 flex items-center gap-3">
              {product.image && (
                <Image src={product.image} alt={product.name_jp} width={48} height={48} className="rounded object-cover" />
              )}
              <div className="flex-1">
                <div className="text-sm text-gray-600">
                  ユーザー: {(like.user?.lastName ?? "") + (like.user?.firstName ? ` ${like.user.firstName}` : "") || like.user?.email || "不明"}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(like.createdAt).toLocaleDateString("ja-JP")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
