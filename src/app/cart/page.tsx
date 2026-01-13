"use client";

import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  getLocalizedText,
  type Locale,
  createTranslationGetter,
  getTranslation,
} from "@/lib/i18n";
import content from "@/data/content.json";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();
  const locale = useLocale() as Locale;

  const tCart = content.cart;
  const t = createTranslationGetter(tCart, locale);
  const qtyLabel = getTranslation(tCart.quantity, locale);
  const deleteLabel = getTranslation(tCart.delete, locale);
  const totalLabel = getTranslation(tCart.total, locale);
  const continueLabel = getTranslation(tCart.continue, locale);
  const checkoutLabel = getTranslation(tCart.checkout, locale);

  // TODO: When implementing database integration:
  // - Replace useCart hook with server-side cart data fetching
  // - Add user authentication check
  // - Implement server actions for cart operations
  // - Add optimistic updates for better UX

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    // Navigate to checkout page
    router.push("/checkout");
  };

  if (cart.items.length === 0) {
    return (
      <main className="w-full min-h-screen py-16">
        <div className="w-full max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
          <div className="text-center py-16">
            <p className="text-lg text-gray-500 mb-6">
              {tCart.empty.message[locale === "jp" ? "jp" : locale]}
            </p>
            <Link href="/products">
              <Button size="lg">
                {tCart.empty.cta[locale === "jp" ? "jp" : locale]}
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen py-16">
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <Button
            variant="outline"
            onClick={clearCart}
            className="text-red-600 hover:text-red-700"
          >
            {t("clear")}
          </Button>
        </div>

        <div className="space-y-6">
          {cart.items.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center space-x-4 p-4 border rounded-lg"
            >
              <div className="flex-shrink-0">
                <Image
                  src={item.product.image}
                  alt={item.product.name_jp}
                  width={100}
                  height={100}
                  className="rounded-md"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {locale === "jp"
                    ? item.product.name_jp
                    : item.product.name_en || item.product.name_jp}
                </h3>
                <p className="text-sm text-gray-500">{item.product.brand}</p>
                <p className="text-lg font-medium text-green-600">
                  ¥{item.product.price.toLocaleString()}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <label
                  htmlFor={`quantity-${item.product.id}`}
                  className="text-sm"
                >
                  {qtyLabel}:
                </label>
                <select
                  id={`quantity-${item.product.id}`}
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(
                      item.product.id,
                      Number(e.target.value)
                    )
                  }
                  className="border rounded-md px-2 py-1 text-sm"
                >
                  <option value={0}>{deleteLabel}</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-right">
                <p className="text-lg font-semibold">
                  ¥{(item.product.price * item.quantity).toLocaleString()}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  {deleteLabel}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold">{totalLabel}:</span>
            <span className="text-2xl font-bold text-green-600">
              ¥{cart.total.toLocaleString()}
            </span>
          </div>

          <div className="flex space-x-4">
            <Link href="/products" className="flex-1">
              <Button variant="outline" className="w-full" size="lg">
                {continueLabel}
              </Button>
            </Link>

            <Button onClick={handleCheckout} className="flex-1" size="lg">
              {checkoutLabel}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
