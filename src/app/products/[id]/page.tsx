import { notFound } from "next/navigation";
import Image from "next/image";
import prisma from "@/lib/prisma";
import AddToCartButton from "./AddToCartButton";

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
    <main className="w-full min-h-screen py-16">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row *:border">
          <div className="w-full">
            <Image
              src={product.image}
              alt={product.name_en}
              width={500}
              height={500}
            />
          </div>
          <div className="w-full p-4">
            <h1 className="text-2xl font-bold">{product.name_jp}</h1>
            <p className="text-sm text-gray-500">{product.brand}</p>
            <p className="text-xl font-semibold text-green-600 mb-4">¥{product.price.toLocaleString()}</p>
            <p className="text-sm text-gray-700 mb-6">{product.description_jp}</p>
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </main>
  );
}
