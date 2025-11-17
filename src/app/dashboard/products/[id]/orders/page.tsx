import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function ProductOrdersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = Number(id);
  if (!productId) notFound();

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, name_jp: true, brand: true, image: true, price: true },
  });
  if (!product) notFound();

  const orders = await prisma.order.findMany({
    where: { productId },
    include: {
      user: { select: { id: true, email: true, lastName: true, firstName: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">商品注文の詳細</h1>
          <p className="text-sm text-gray-600">
            {product.name_jp} ({product.brand})
          </p>
        </div>
        <Link href="/dashboard" className="text-blue-600 hover:underline">← 商品一覧へ戻る</Link>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-600">注文がありません。</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4 flex items-start gap-3">
              {product.image && (
                <Image src={product.image} alt={product.name_jp} width={48} height={48} className="rounded object-cover" />
              )}
              <div className="flex-1">
                <div className="font-semibold">注文番号: #{order.id}</div>
                <div className="text-sm text-gray-600">
                  ユーザー: {(order.user?.lastName ?? "") + (order.user?.firstName ? ` ${order.user.firstName}` : "") || order.user?.email || "不明"}
                </div>
                <div className="text-sm text-gray-700">数量: {order.quantity}</div>
              </div>
              <div className="text-right text-sm text-gray-500">
                <div>{new Date(order.createdAt).toLocaleDateString("ja-JP")}</div>
                <div className="font-semibold text-gray-900">¥{product.price.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
