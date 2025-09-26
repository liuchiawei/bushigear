import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductImage from "./components/layout/ProductImage";
import ProductInfo from "./components/layout/ProductInfo";

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
  });
  if (!product) notFound();

  return (
    <main className="w-full min-h-screen py-16 relative overflow-hidden">
      <div className="absolute -top-10 -left-10 -z-10 text-white font-roboto font-[900] text-[210px] uppercase [writing-mode:vertical-rl] tracking-tight leading-none break-keep whitespace-nowrap">
        {product.name_en}
      </div>
      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row">
        <ProductImage product={product} />
        <ProductInfo product={product} />
      </div>
    </main>
  );
}
