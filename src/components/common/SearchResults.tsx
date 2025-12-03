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
  if (isLoading) {
    return (
      <Command>
        <CommandList>
          <CommandEmpty>検索中...</CommandEmpty>
        </CommandList>
      </Command>
    );
  }

  if (products.length === 0) {
    return (
      <Command>
        <CommandList>
          <CommandEmpty>該当する商品が見つかりませんでした</CommandEmpty>
        </CommandList>
      </Command>
    );
  }

  return (
    <Command>
      <CommandList>
        <CommandGroup heading="検索結果">
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
                    {product.name_jp}
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
