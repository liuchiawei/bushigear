import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function MemberOrdersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = Number(id);
  if (!userId) notFound();

  const [user, orders] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, lastName: true, firstName: true } }),
    prisma.order.findMany({
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
          <h1 className="text-2xl font-bold">会員の注文履歴</h1>
          <p className="text-sm text-gray-600">
            ユーザー: {user.lastName ?? ""}{user.firstName ? ` ${user.firstName}` : ""} ({user.email})
          </p>
        </div>
        <Link href="/members" className="text-blue-600 hover:underline">← 会員一覧へ戻る</Link>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-600">注文履歴がありません。</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4 flex items-center gap-4">
              {order.product?.image && (
                <Image src={order.product.image} alt={order.product.name_jp} width={64} height={64} className="rounded object-cover" />
              )}
              <div className="flex-1">
                <div className="font-semibold">{order.product?.name_jp}</div>
                <div className="text-sm text-gray-500">{order.product?.brand}</div>
                <div className="text-sm text-gray-700">数量: {order.quantity}</div>
                {order.product && (
                  <Link href={`/products/${order.product.id}`} className="text-sm text-blue-600 hover:underline">
                    商品ページへ
                  </Link>
                )}
              </div>
              <div className="text-right text-sm text-gray-500">
                <div>{new Date(order.createdAt).toLocaleDateString("ja-JP")}</div>
                <div className="font-semibold text-gray-900">¥{order.product?.price?.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
