"use client";

import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingPageProps {
  message?: string;
  showSkeleton?: boolean;
  skeletonCount?: number;
}

export default function LoadingPage({
  message = "読み込み中...",
  showSkeleton = false,
  skeletonCount = 3,
}: LoadingPageProps) {
  return (
    <div className="w-full min-h-screen py-12 px-4 md:px-0">
      <div className="w-full max-w-6xl mx-auto">
        {showSkeleton ? (
          <div className="space-y-4">
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <Skeleton key={i} className="w-full h-20 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Spinner size="xl" />
            <p className="text-lg text-muted-foreground">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

