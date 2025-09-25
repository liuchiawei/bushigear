import { Product } from "@/lib/type";
import AddToCartButton from "../common/AddToCartButton";
import content from "@/data/content.json";

export default function ProductInfo({ product }: { product: Product }) {
  return (
    <div className="w-full p-4 flex flex-col justify-between bg-card/40 backdrop-blur-sm shadow-lg rounded-xl">
      <div className="flex flex-col gap-4 p-4">
        <div className="w-18 h-6 bg-secondary" />
        <div className="flex flex-col gap-2 font-sans font-roboto">
          <h3 className="text-sm text-neutral-400">{product.brand}</h3>
          <h1 className="text-4xl md:text-5xl font-[800]">{product.name_jp}</h1>
          <h2 className="text-2xl md:text-3xl text-neutral-400 font-[300] tracking-wide">
            {product.name_en}
          </h2>
        </div>
        <p className="text-5xl font-roboto font-[300] mb-4 text-right">
          <span className="text-xl text-neutral-400 mr-4">¥</span>
          {product.price.toLocaleString()}
          <span className="text-xl text-neutral-400 ml-2">
            {content.products_detail.price.jp}
          </span>
        </p>
      </div>
      <p className="text-sm text-gray-700 mb-6">{product.description_jp}</p>
      <AddToCartButton product={product} />
    </div>
  );
}
