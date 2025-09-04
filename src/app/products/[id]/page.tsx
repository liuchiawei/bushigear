import { notFound } from "next/navigation";
import type { Metadata } from 'next'
import Image from "next/image";
import productsData from "@/data/products.json";
import { Product } from "@/lib/type";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  const product = productsData.find((c: Product) => c.id === parseInt(id));
  if (!product) { notFound(); }

  return (
    <main className="w-full min-h-screen py-16">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row *:border">
          <div className="w-full">
            <Image src={product.image} alt={product.name.en} width={500} height={500} />
          </div>
          <div className="w-full">
            <h1 className="text-2xl font-bold">{product.name.jp}</h1>
            <p className="text-sm text-gray-500">{product.brand}</p>
            <p className="text-sm text-gray-500">{product.price}</p>
            <p className="text-sm text-gray-500">{product.description.en}</p>
          </div>
        </div>
      </div>
    </main>
  );
}

// 生成靜態參數
export async function generateStaticParams() {
  return productsData.map((product: Product) => ({
    id: product.id.toString()
  }))
}

// 生成メタデータ
type Props = {
  params: { id: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}
 
export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  // read route params
  const { id } = params
 
  // fetch data
  const product = productsData.find((c: Product) => c.id === parseInt(id));
  if (!product) { notFound(); }
 
  return {
    title: product.name.jp + " | Bushigear",
  }
}