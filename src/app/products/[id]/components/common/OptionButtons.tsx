"use client";

import { Button } from "@/components/ui/button";
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

interface OptionButtonsProps {
  handleAddToCart: () => void;
  productId: number;
}

export default function OptionButtons({ handleAddToCart, productId }: OptionButtonsProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
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
        }
      })();
    }
  }, [status, productId]);

  const handleLike = async () => {
    if (!session?.user?.id) {
      router.push("/login");
      return;
    }
    try {
      if (liked) {
        const res = await fetch("/api/likes", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        if (res.ok) {
          setLiked(false);
        }
      } else {
        const res = await fetch("/api/likes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        if (res.ok) {
          setLiked(true);
        }
      }
    } catch (err) {
      console.error("like error", err);
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
              className={`rounded-full hover:text-background ${liked ? "text-red-500" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                handleLike();
              }}
            >
              <Heart />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{content.products_detail.options.jp.favorite}</p>
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
            <p>{content.products_detail.options.jp.add_to_cart}</p>
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
            <p>{content.products_detail.options.jp.share}</p>
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
            <p>{content.products_detail.options.jp.comment}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
