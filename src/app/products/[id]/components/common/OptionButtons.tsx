"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Heart, Share, MessageCircle, ShoppingCart } from "lucide-react";
import content from "@/data/content.json";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { getLocalizedText, type Locale } from "@/lib/i18n";

interface OptionButtonsProps {
  handleAddToCart: () => void;
  productId: number;
}

export default function OptionButtons({ handleAddToCart, productId }: OptionButtonsProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale() as Locale;
  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isLoadingLikes, setIsLoadingLikes] = useState(true);
  const optionCopy = content.products_detail.options;
  const optionText = (key: keyof typeof optionCopy.jp) =>
    getLocalizedText(
      {
        jp: optionCopy.jp[key],
        en: optionCopy.en[key],
        zh_tw: optionCopy.zh_tw[key],
        zh_cn: optionCopy.zh_cn[key],
      } as any,
      locale
    );

  useEffect(() => {
    if (status === "authenticated") {
      setIsLoadingLikes(true);
      (async () => {
        try {
          const res = await fetch("/api/likes", { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            const likes: any[] = (data?.likes ?? data) ?? [];
            const found = likes.some((like: any) => {
              if (like.productId) return like.productId === productId;
              if (like.product && like.product.id) return like.product.id === productId;
              return false;
            });
            setLiked(found);
          }
        } catch {
        } finally {
          setIsLoadingLikes(false);
        }
      })();
    } else {
      setIsLoadingLikes(false);
    }
  }, [status, productId]);

  const handleLike = async () => {
    if (!session?.user?.id) {
      router.push("/login");
      return;
    }
    
    // 楽観的更新
    const previousLiked = liked;
    setLiked(!liked);
    setIsLiking(true);
    
    try {
      if (previousLiked) {
        const res = await fetch("/api/likes", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        if (!res.ok) {
          // エラー時は元に戻す
          setLiked(previousLiked);
        }
      } else {
        const res = await fetch("/api/likes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        if (!res.ok) {
          // エラー時は元に戻す
          setLiked(previousLiked);
        }
      }
    } catch (err) {
      console.error("like error", err);
      // エラー時は元に戻す
      setLiked(previousLiked);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full hover:text-background ${liked ? "text-red-500 hover:text-red-600" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                handleLike();
              }}
              disabled={isLiking || isLoadingLikes}
            >
              {isLiking ? (
                <Spinner size="sm" className={liked ? "text-red-500" : ""} />
              ) : (
                <Heart className={liked ? "fill-current" : ""} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{optionText("favorite")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:text-background"
              onClick={handleAddToCart}
            >
              <ShoppingCart />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{optionText("add_to_cart")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:text-background"
            >
              <Share />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{optionText("share")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:text-background"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("reviews");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <MessageCircle />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{optionText("comment")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
