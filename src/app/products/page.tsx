import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/type";
import productsData from "@/data/products.json";
import content from "@/data/content.json";

export default function Products() {
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
        {productsData.map((product: Product) => (
          <Link key={product.id} href={`/products/${product.id}`} className="border">
            <Image src={product.image} alt={product.name.en} width={500} height={500} />
            <div className="p-4">
              <h2 className="text-lg font-bold">{product.name.en}</h2>
              <p className="text-sm text-gray-500">{product.brand}</p>
              <p className="text-sm text-gray-500">{product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}   