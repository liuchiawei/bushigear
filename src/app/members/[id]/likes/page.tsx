import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function MemberLikesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = Number(id);
  if (!userId) notFound();

  const [user, likes] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, lastName: true, firstName: true } }),
    prisma.like.findMany({
      where: { userId },
      include: {
        product: { select: { id: true, name_jp: true, brand: true, price: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!user) notFound();

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">会員のお気に入り</h1>
          <p className="text-sm text-gray-600">
            ユーザー: {user.lastName ?? ""}{user.firstName ? ` ${user.firstName}` : ""} ({user.email})
          </p>
        </div>
        <Link href="/members" className="text-blue-600 hover:underline">← 会員一覧へ戻る</Link>
      </div>

      {likes.length === 0 ? (
        <p className="text-gray-600">お気に入りがありません。</p>
      ) : (
        <div className="space-y-4">
          {likes.map((like) => (
            <div key={like.id} className="border rounded-lg p-4 flex items-center gap-4">
              {like.product?.image && (
                <Image src={like.product.image} alt={like.product.name_jp} width={64} height={64} className="rounded object-cover" />
              )}
              <div className="flex-1">
                <div className="font-semibold">{like.product?.name_jp}</div>
                <div className="text-sm text-gray-500">{like.product?.brand}</div>
                {like.product && (
                  <Link href={`/products/${like.product.id}`} className="text-sm text-blue-600 hover:underline">
                    商品ページへ
                  </Link>
                )}
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
