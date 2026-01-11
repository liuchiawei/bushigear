 "use client";

import { Product } from "@/lib/type";
import AddToCartButton from "../common/AddToCartButton";
import content from "@/data/content.json";
import { useLocale } from "next-intl";
import { getLocalizedText, toSimplified, type Locale } from "@/lib/i18n";

type ProductInfoProps = {
  product: Product;
  averageScore: number;
  commentCount: number;
};

export default function ProductInfo({ product, averageScore, commentCount }: ProductInfoProps) {
  const locale = useLocale() as Locale;
  const priceLabel = getLocalizedText(content.products_detail.price as any, locale);
  const displayName =
    locale === "jp"
      ? product.name_jp
      : locale === "zh_tw" || locale === "zh_cn"
        ? (locale === "zh_cn" ? toSimplified(product.name_cn) : product.name_cn) ||
          product.name_en ||
          product.name_jp
        : product.name_en || product.name_jp;
  const displayDescription =
    locale === "jp"
      ? product.description_jp
      : locale === "zh_tw" || locale === "zh_cn"
        ? (locale === "zh_cn" ? toSimplified(product.description_cn) : product.description_cn) ||
          product.description_en ||
          product.description_jp
        : product.description_en || product.description_jp;

  return (
    <div className="w-full p-4 flex flex-col justify-between bg-card/40 backdrop-blur-sm shadow-lg rounded-xl">
      <div className="flex flex-col gap-4 p-4">
        <div className="w-18 h-6 bg-secondary" />
        <div className="flex flex-col gap-2 font-roboto">
          <h3 className="text-sm text-neutral-400">{product.brand}</h3>
          <h1 className="text-4xl md:text-5xl font-extrabold">
            {displayName}
          </h1>
          <h2 className="text-2xl md:text-3xl text-neutral-400 font-light tracking-wide">
            {product.name_en}
          </h2>
          <div className="flex items-center gap-2 text-sm text-yellow-500">
            <span aria-label="average-stars">
              {"★".repeat(Math.round(averageScore)).padEnd(5, "☆")}
            </span>
            <span className="text-gray-600">{averageScore.toFixed(1)} / 5</span>
            <span className="text-gray-500">({commentCount})</span>
          </div>
        </div>
        <p className="text-5xl font-roboto font-light mb-4 text-right">
          <span className="text-xl text-neutral-400 mr-4">¥</span>
          {product.price.toLocaleString()}
          <span className="text-xl text-neutral-400 ml-2">
            {priceLabel}
          </span>
        </p>
      </div>
      <p className="text-sm text-gray-700 mb-6">
        {displayDescription}
      </p>
      <AddToCartButton product={product} />
    </div>
  );
}
