"use client";

import { useState, useEffect, useCallback } from "react";
import content from "@/data/content.json";
import SectionHeader from "../common/SectionHeader";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/type";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocale } from "next-intl";
import { getLocalizedText, type Locale } from "@/lib/i18n";

export default function Ranking() {
  const locale = useLocale() as Locale;
  const isMobile = useIsMobile();
  const categories = content.home.ranking.categories;
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0]?.slug ?? "glove"
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProducts = useCallback(
    async (categorySlug: string) => {
      setLoading(true);
      try {
        // モバイルの場合は5個、デスクトップの場合は10個取得
        const limit = isMobile ? 3 : 10;
        const response = await fetch(
          `/api/products?category=${categorySlug}&limit=${limit}`
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    },
    [isMobile]
  );

  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory, fetchProducts]);

  const handleCategoryClick = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
  };

  const sectionTitle = content.home.ranking.section_info.title;
  const sectionDescription = content.home.ranking.section_info.description;
  const headerTitleJp =
    locale === "jp" ? sectionTitle.jp : getLocalizedText(sectionTitle, locale);
  const headerTitleEn = sectionTitle.en;
  const headerDescription =
    locale === "jp"
      ? sectionDescription.jp
      : getLocalizedText(sectionDescription, locale);

  const rankingTitle =
    locale === "jp"
      ? content.home.ranking.title.jp
      : getLocalizedText(content.home.ranking.title, locale);
  const rankingDescription =
    locale === "jp"
      ? content.home.ranking.description.jp
      : getLocalizedText(content.home.ranking.description, locale);
  const loadingText = getLocalizedText(content.home.ranking.loading, locale);

  const getCategoryLabel = (
    name: { jp: string; en?: string; cn?: string }
  ) => (locale === "jp" ? name.jp : getLocalizedText(name, locale));

  return (
    <section className="w-full max-w-5xl mx-auto px-4 md:px-0 py-4">
      <SectionHeader
        title_en={headerTitleEn}
        title_jp={headerTitleJp}
        description={headerDescription}
        reverse={true}
      />
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
        <div className="w-full">
          <div className="flex flex-col gap-2 mb-6">
            <h1 className="text-2xl font-bold uppercase">
              {rankingTitle}
            </h1>
            <p className="text-sm text-neutral-400">
              {rankingDescription}
            </p>
          </div>
          <ul className="flex flex-col gap-2">
            {content.home.ranking.categories.map((category) => (
              <li
                key={category.id}
                className={`py-2 px-4 border border-gray-300 text-lg font-bold cursor-pointer relative transition-all duration-300 before:content-[''] before:absolute before:top-0 before:left-0 before:right-full hover:before:right-0 before:h-full before:bg-primary before:z-[-1] before:transition-all before:duration-300 ${
                  selectedCategory === category.slug
                    ? "bg-primary text-white"
                    : "hover:bg-primary hover:text-white"
                }`}
                onClick={() => handleCategoryClick(category.slug)}
              >
                {getCategoryLabel(category.name)}
              </li>
            ))}
          </ul>
        </div>
        {loading ? (
          <div className="col-span-2 md:col-span-3 flex items-center justify-center h-full">
            <p className="text-gray-600">{loadingText}</p>
          </div>
        ) : (
          <div className="grid col-span-2 md:col-span-3 grid-cols-subgrid gap-2">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="col-span-2 md:col-span-1 flex flex-col items-center justify-center relative"
              >
                <div
                  className={`flex items-center self-start text-primary-foreground text-xs px-2 py-1 ${
                    index + 1 === 1 ? "bg-accent" : "bg-primary"
                  }`}
                >
                  {locale === "jp" ? `${index + 1}位` : `#${index + 1}`}
                </div>
                <div className="w-full aspect-square flex items-center justify-center mb-6">
                  <Image
                    src={product.image}
                    alt={product.name_jp}
                    width={200}
                    height={200}
                    className="object-cover"
                  />
                </div>
                <Link
                  href={`/products/${product.id}`}
                  className="w-4/5 flex flex-col px-6 py-4 absolute bottom-0 bg-background/40 backdrop-blur-sm shadow-lg rounded-xl"
                >
                  <h3 className="text-xl font-sans font-bold text-foreground line-clamp-2">
                    {product.name_jp}
                  </h3>
                  <p className="text-xs text-neutral-400">{product.brand}</p>
                  <p className="text-xl font-roboto font-bold text-primary text-right">
                    ¥{product.price.toLocaleString()}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
