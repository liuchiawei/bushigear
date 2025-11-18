import Header from "./components/layout/Header";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-6 pb-16">
      <Header />
      <div className="w-full max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 border-t border-l">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="p-4 border-r border-b overflow-hidden flex flex-col justify-between gap-2"
          >
            {/* 品牌 skeleton */}
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
            </div>
            
            {/* 商品圖片 skeleton */}
            <div className="flex-none relative overflow-hidden flex items-center justify-center p-4">
              <Skeleton className="w-full aspect-square rounded" />
            </div>
            
            {/* 商品資訊 skeleton */}
            <div className="flex-1 flex flex-col justify-between gap-2">
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-full" />
              </div>
              <Skeleton className="h-5 w-24 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

