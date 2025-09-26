import Image from "next/image";
import { Product } from "@/lib/type";

export default function ProductImage({ product }: { product: Product }) {
  return (
    <div className="w-full p-4 flex items-center justify-center relative before:content-[''] before:absolute before:size-80 lg:before:size-120 before:rounded-full before:bg-secondary before:bottom-[10%] before:right-[25%] before:translate-x-1/2 before:translate-y-1/2 before:z-[-10]">
      <Image
        src={product.image}
        alt={product.name_en}
        width={500}
        height={500}
      />
    </div>
  );
}
