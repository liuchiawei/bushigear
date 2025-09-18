"use client";

import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();

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
          <h1 className="text-3xl font-bold mb-8">ショッピングカート</h1>
          <div className="text-center py-16">
            <p className="text-lg text-gray-500 mb-6">
              カートは空です
            </p>
            <Link href="/products">
              <Button size="lg">
                商品を見る
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
          <h1 className="text-3xl font-bold">ショッピングカート</h1>
          <Button
            variant="outline"
            onClick={clearCart}
            className="text-red-600 hover:text-red-700"
          >
            カートを空にする
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
                <h3 className="text-lg font-semibold">{item.product.name_jp}</h3>
                <p className="text-sm text-gray-500">{item.product.brand}</p>
                <p className="text-lg font-medium text-green-600">
                  ¥{item.product.price.toLocaleString()}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <label htmlFor={`quantity-${item.product.id}`} className="text-sm">
                  数量:
                </label>
                <select
                  id={`quantity-${item.product.id}`}
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.product.id, Number(e.target.value))
                  }
                  className="border rounded-md px-2 py-1 text-sm"
                >
                  <option value={0}>削除</option>
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
                  削除
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold">合計:</span>
            <span className="text-2xl font-bold text-green-600">
              ¥{cart.total.toLocaleString()}
            </span>
          </div>

          <div className="flex space-x-4">
            <Link href="/products" className="flex-1">
              <Button variant="outline" className="w-full" size="lg">
                買い物を続ける
              </Button>
            </Link>

            <Button
              onClick={handleCheckout}
              className="flex-1"
              size="lg"
            >
              レジに進む
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}