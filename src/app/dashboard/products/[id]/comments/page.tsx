import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import AdminCommentsList from "@/components/common/adminCommentsList";

export default async function ProductCommentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = Number(id);
  if (!productId) notFound();

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, name_jp: true, brand: true, image: true },
  });
  if (!product) notFound();

  const comments = await prisma.comment.findMany({
    where: { productId },
    include: {
      user: { select: { id: true, email: true, lastName: true, firstName: true, image: true } },
      product: { select: { id: true, name_jp: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {product.image && <Image src={product.image} alt={product.name_jp} width={48} height={48} className="rounded object-cover" />}
          <div>
            <h1 className="text-2xl font-bold">商品のレビュー</h1>
            <p className="text-sm text-gray-600">
              {product.name_jp} ({product.brand})
            </p>
          </div>
        </div>
        <Link href="/dashboard" className="text-blue-600 hover:underline">← 商品一覧へ戻る</Link>
      </div>

      <AdminCommentsList initialComments={comments as any} showProductLink={false} />
    </div>
  );
}
