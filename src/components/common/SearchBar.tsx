"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SearchResults from "./SearchResults";
import { Product } from "@/lib/type";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce 搜尋請求（300ms）
  useEffect(() => {
    // 清除之前的計時器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // 如果查詢為空，關閉 popover 並清空結果
    if (!query.trim()) {
      setProducts([]);
      setIsOpen(false);
      return;
    }

    // 設置新的計時器
    debounceTimerRef.current = setTimeout(async () => {
      setIsLoading(true);
      setIsOpen(true);

      try {
        const response = await fetch(
          `/api/products/search?q=${encodeURIComponent(query)}&limit=10`
        );
        if (!response.ok) {
          throw new Error("検索に失敗しました");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Search error:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    // 清理函數
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  // 當點擊外部時關閉 popover
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setQuery("");
      setProducts([]);
    }
  };

  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none z-10" />
            <Input
              type="text"
              placeholder="商品を検索..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (query.trim() || products.length > 0) {
                  setIsOpen(true);
                }
              }}
              className="w-48 md:w-64 pl-8 pr-3"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SearchResults
            products={products}
            isLoading={isLoading}
            onSelect={() => setIsOpen(false)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

