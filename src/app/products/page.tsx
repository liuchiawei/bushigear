import Image from "next/image";
import Link from "next/link";
import content from "@/data/content.json";
import prisma from "@/lib/prisma";

export const revalidate = 60;

export default async function Products() {
  const products = await prisma.product.findMany({
    orderBy: { id: "asc" },
  });

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-6">
      <div className="w-full max-w-6xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-center">
          {content.products.title}
        </h1>
        <p className="w-full max-w-lg mx-auto text-sm text-gray-500 text-justify">
          {content.products.description}
        </p>
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {products.map((product) => {
          const name = product.name as { en: string; jp: string; cn: string };

          return (
            <Link key={product.id} href={`/products/${product.id}`} className="border">
              <Image src={product.image} alt={name.en} width={500} height={500} />
              <div className="p-4">
                <h2 className="text-lg font-bold">{name.en}</h2>
                <p className="text-sm text-gray-500">{product.brand}</p>
                <p className="text-sm text-gray-500">¥{product.price.toLocaleString()}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
