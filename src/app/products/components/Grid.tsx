import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/type";
import AddToCart from "@/components/common/AddToCart";

export default function Grid({ product }: { product: Product }) {
  return (
    <div className="relative group">
      <Link key={product.id} href={`/products/${product.id}`}>
        <div
          data-category={product.category}
          className="relative before:content-[var(--category)] before:absolute before:top-0 before:left-0 before:p-2 before:text-white before:font-bold before:bg-primary before:uppercase before:z-0"
          style={
            { "--category": `"${product.category}"` } as React.CSSProperties
          }
        >
          <Image
            src={product.image}
            alt={product.name_en}
            width={500}
            height={500}
          />

          {/* AddToCart button positioned in top-right corner */}
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <AddToCart product={product} />
          </div>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-bold text-center">{product.name_jp}</h2>
          <h3 className="text-md text-center">{product.brand}</h3>
          <p className="text-sm font-bold text-gray-500 text-center">
            ¥{product.price.toLocaleString()}
          </p>
        </div>
      </Link>
    </div>
  );
}
