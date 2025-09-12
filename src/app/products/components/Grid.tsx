import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/type";

export default function Grid({ product }: { product: Product }) {
  return (
    <div>
      <Link key={product.id} href={`/products/${product.id}`}>
        <div
          className="image-with-tag"
          style={
            { "--category": `"${product.category}"` } as React.CSSProperties
          }
        >
          <Image
            src={product.image}
            alt={product.name.en}
            width={500}
            height={500}
          />
        </div>
        <div className="p-4">
          <h2 className="text-lg font-bold text-center">{product.name.en}</h2>
          <p className="text-sm font-bold text-gray-500 text-center">
            {product.price}
          </p>
        </div>
      </Link>
    </div>
  );
}
