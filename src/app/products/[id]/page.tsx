import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductImage from "./components/layout/ProductImage";
import ProductInfo from "./components/layout/ProductInfo";
import CommentsContainer from "@/components/common/commentsContainer";
import { Comment } from "@/lib/type";

export const revalidate = 60;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ProductId = Number(id);
  if (Number.isNaN(ProductId)) notFound();

  const product = await prisma.product.findUnique({
    where: { id: ProductId },
    include: {
      comments: {
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
      },
    },
  });
  if (!product) notFound();

  const comments = (product.comments ?? []) as unknown as Comment[];
  const commentCount = comments.length;
  const averageScore =
    commentCount === 0
      ? 0
      : comments.reduce((sum, c) => sum + (c.score ?? 0), 0) / commentCount;

  return (
    <main className="w-full py-16 relative">
      <div className="absolute -top-10 -left-10 -z-10 text-white font-roboto font-black text-[160px] uppercase [writing-mode:vertical-rl] tracking-tight leading-none break-keep whitespace-nowrap">
        {product.name_en}
      </div>
      <div className="w-full flex flex-col md:flex-row">
        <ProductImage product={product} />
        <ProductInfo
          product={product}
          averageScore={averageScore}
          commentCount={commentCount}
        />
      </div>
      <div className="w-full max-w-5xl mx-auto px-4 md:px-0">
        <CommentsContainer
          initialComments={comments}
          productId={product.id}
          initialAverage={averageScore}
        />
      </div>
    </main>
  );
}
