import { notFound } from "next/navigation";
import Image from "next/image";
import productsData from "@/data/products.json";
import { Product } from "@/lib/type";

// TODO: fetch data from database instead of products.json

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // 接收動態路由參數(id)
  const { id } = await params;
  // 根據id從資料庫中找到對應商品
  const product = productsData.find((c: Product) => c.id === parseInt(id));
  // 如果找不到商品，則顯示404頁面
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