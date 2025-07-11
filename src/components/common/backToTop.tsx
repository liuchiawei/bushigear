"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // 100px以上スクロールしたらボタンを表示
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setIsVisible(window.scrollY > 100);
    });
  }, []);

  // ボタンをクリックしたらトップへ戻る
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return isVisible && (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={handleBackToTop}
            className="fixed bottom-6 right-6 z-50 p-6 rounded-full"
          >
            <ArrowUp className="size-8" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>トップへ戻る</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}