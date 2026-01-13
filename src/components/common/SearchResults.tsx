"use client";

import { Product } from "@/lib/type";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { getLocalizedText, toSimplified, type Locale } from "@/lib/i18n";
import content from "@/data/content.json";

type SearchResultsProps = {
  products: Product[];
  isLoading?: boolean;
  onSelect?: () => void;
};

export default function SearchResults({
  products,
  isLoading = false,
  onSelect,
}: SearchResultsProps) {
  const locale = useLocale() as Locale;

  const heading = getLocalizedText(content.search.results as any, locale);
  const loadingText = getLocalizedText(content.search.searching as any, locale);
  const emptyText = getLocalizedText(content.search.empty as any, locale);

  const getName = (product: Product) => {
    if (locale === "zh_tw") return product.name_cn;
    if (locale === "zh_cn") return toSimplified(product.name_cn);
    if (locale === "en") return product.name_en;
    return product.name_jp;
  };

  if (isLoading) {
    return (
      <Command>
        <CommandList>
          <CommandEmpty>{loadingText}</CommandEmpty>
        </CommandList>
      </Command>
    );
  }

  if (products.length === 0) {
    return (
      <Command>
        <CommandList>
          <CommandEmpty>{emptyText}</CommandEmpty>
        </CommandList>
      </Command>
    );
  }

  return (
    <Command>
      <CommandList>
        <CommandGroup heading={heading}>
          {products.map((product) => (
            <CommandItem key={product.id} asChild>
              <Link
                href={`/products/${product.id}`}
                className="flex items-center gap-3 w-full p-2 hover:bg-accent rounded-sm"
                onClick={onSelect}
              >
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name_jp}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {getName(product)}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {product.brand}
                  </div>
                </div>
                <div className="text-sm font-semibold text-right">
                  ¥{product.price.toLocaleString()}
                </div>
              </Link>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
