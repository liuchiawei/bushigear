import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/type";

export default function Grid({ product }: { product: Product }) {
  return (
    <div>
      <Link key={product.id} href={`/products/${product.id}`} className="border">
        <Image src={product.image} alt={product.name_en} width={500} height={500} />
        <div className="p-4">
          <h2 className="text-lg font-bold">{product.name_jp}</h2>
          <p className="text-sm text-gray-500">{product.brand}</p>
          <p className="text-sm text-gray-500">{product.price}</p>
        </div>
      </Link>
    </div>
  );
}