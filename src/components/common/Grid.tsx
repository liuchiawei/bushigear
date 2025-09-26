import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/type";
import AddToCart from "@/components/common/AddToCart";

export default function Grid({ product }: { product: Product }) {
  const category =
    product.category == "glove"
      ? "グローブ"
      : product.category == "mitt"
      ? "ミット"
      : product.category == "protector"
      ? "プロテクター"
      : "シャツ";
  return (
    <div className="p-4 border-r border-b overflow-hidden flex flex-col justify-between gap-2">
      {/* 商品カテゴリー */}
      <div>
        <h2 className="text-sm font-bold">{product.brand}</h2>
      </div>
      {/* 商品画像 */}
      <Link
        href={`/products/${product.id}`}
        className="flex-none relative group overflow-hidden flex items-center justify-center p-4"
      >
        {/* <div className="relative before:content-[var(--category)] before:absolute before:top-0 before:left-0 before:p-2 before:text-white before:font-bold before:bg-primary before:uppercase before:z-10 overflow-hidden"> */}
        <Image
          src={product.image}
          alt={product.name_en}
          width={200}
          height={200}
          className="group-hover:scale-105 transition-transform duration-200"
        />
        {/* AddToCart button positioned in top-right corner */}
        <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <AddToCart product={product} />
        </div>
      </Link>
      {/* 商品情報 */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-xs">{category}</h2>
          <h1 className="text-lg font-bold">{product.name_jp}</h1>
        </div>
        {/* <p className="text-xs text-justify text-gray-500">
          {product.description_jp}
        </p> */}
        <p className="font-bold text-right">
          ¥{product.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
