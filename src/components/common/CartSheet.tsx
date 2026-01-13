import Link from "next/link";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ShoppingCart } from "lucide-react";
import CartVolumeIndicator from "@/components/common/CartVolumeIndicator";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  getLocalizedText,
  type Locale,
  createTranslationGetter,
  getTranslation,
} from "@/lib/i18n";
import content from "@/data/content.json";

export default function CartSheet() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const locale = useLocale() as Locale;
  const tCart = content.cart;
  const t = createTranslationGetter(tCart, locale);
  const qtyLabel = getTranslation(tCart.quantity, locale);
  const deleteLabel = getTranslation(tCart.delete, locale);
  const totalLabel = getTranslation(tCart.total, locale);
  const continueLabel = getTranslation(tCart.continue, locale);
  const checkoutLabel = getTranslation(tCart.checkout, locale);
  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };
  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <Sheet>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger className="relative cursor-pointer">
              <ShoppingCart className="size-4" />
              <CartVolumeIndicator />
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("title")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <SheetContent side="right" className="w-4/5 max-w-4xl flex flex-col">
        <SheetHeader>
          <SheetTitle>
            <Link href="/cart">{t("title")}</Link>
          </SheetTitle>
        </SheetHeader>

        {cart.items.length === 0 ? (
          // カートが空の場合
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-lg text-gray-500 mb-6">
              {tCart.empty.message[locale === "jp" ? "jp" : locale]}
            </p>
            <Link href="/products">
              <Button size="lg">
                {tCart.empty.cta[locale === "jp" ? "jp" : locale]}
              </Button>
            </Link>
          </div>
        ) : (
          // カートが空でない場合
          <>
            <div className="flex-1 overflow-y-auto space-y-4 p-4">
              {cart.items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center space-x-3 p-3 border rounded-lg"
                >
                  <div className="flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name_jp}
                      width={60}
                      height={60}
                      className="rounded-md"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold truncate">
                      {locale === "jp"
                        ? item.product.name_jp
                        : item.product.name_en || item.product.name_jp}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {item.product.brand}
                    </p>
                    <p className="text-sm font-medium text-ring">
                      ¥{item.product.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-col items-end space-y-1">
                    <select
                      title={qtyLabel}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.product.id,
                          Number(e.target.value)
                        )
                      }
                      className="border rounded-md px-1 py-1 text-xs w-16"
                    >
                      <option value={0}>{deleteLabel}</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm font-semibold">
                      ¥{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              <Button
                size="sm"
                onClick={clearCart}
                className="w-full bg-foreground text-background"
              >
                {t("clear")}
              </Button>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">{totalLabel}:</span>
                <span className="text-2xl font-bold text-foreground">
                  ¥{cart.total.toLocaleString()}
                </span>
              </div>

              <div className="flex flex-col space-y-2">
                <Link href="/products">
                  <Button
                    variant="outline"
                    className="w-full hover:bg-foreground/50 hover:text-background"
                    size="sm"
                  >
                    {continueLabel}
                  </Button>
                </Link>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-foreground text-background"
                  size="sm"
                >
                  {checkoutLabel}
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
