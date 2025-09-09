import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import prisma from "@/lib/prisma";

export const revalidate = 60;

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const productId = Number(params.id);
  if (Number.isNaN(productId)) notFound();

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!product) notFound();

  const name = product.name as { en: string; jp: string; cn: string };
  const description = product.description as { en: string; jp: string; cn: string };

  return (
    <main className="w-full min-h-screen py-16">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row *:border">
          <div className="w-full">
            <Image
              src={product.image}
              alt={name.en}
              width={500}
              height={500}
            />
          </div>
          <div className="w-full p-4">
            <h1 className="text-2xl font-bold">{name.jp}</h1>
            <p className="text-sm text-gray-500">{product.brand}</p>
            <p className="text-sm text-gray-500">¥{product.price.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{description.en}</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  const ids = await prisma.product.findMany({ select: { id: true } });
  return ids.map((p) => ({ id: p.id.toString() }));
}

type Props = {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const productId = Number(params.id);
  if (Number.isNaN(productId)) return { title: "Product | Bushigear" };

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { name: true },
  });
  if (!product) return { title: "Product | Bushigear" };

  const name = product.name as { jp: string };
  return { title: `${name.jp} | Bushigear` };
}
