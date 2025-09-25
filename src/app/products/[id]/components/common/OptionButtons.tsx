import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Heart, Share, MessageCircle, ShoppingCart } from "lucide-react";
import content from "@/data/content.json";
interface OptionButtonsProps {
  handleAddToCart: () => void;
}

export default function OptionButtons({ handleAddToCart }: OptionButtonsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:text-background"
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
