"use client";

import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  // TODO: Database integration guide for checkout:
  // 1. Add user authentication check
  // 2. Create Order model in Prisma schema:
  //    - id, userId, total, status, createdAt, updatedAt
  //    - OrderItem model: orderId, productId, quantity, price
  // 3. Implement payment processing integration (Stripe, PayPal, etc.)
  // 4. Create server action for order creation
  // 5. Add email confirmation system
  // 6. Implement order tracking functionality

  const handlePlaceOrder = async () => {
    if (!cart || cart.items.length === 0) {
      alert("カートが空です");
      return;
    }

    setIsProcessing(true);
    try {
      for (const item of cart.items) {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: item.product.id,
            quantity: item.quantity,
            // userId: 任意（未ログインなら省略可）
          }),
        });
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(`注文失敗: ${msg}`);
        }
      }
      clearCart();
      alert("ご注文ありがとうございます！");
    } catch (e: any) {
      alert(e?.message ?? "注文に失敗しました");
    } finally {
      setIsProcessing(false);
    }
  };


  if (cart.items.length === 0) {
    return (
      <main className="w-full min-h-screen py-16">
        <div className="w-full max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">チェックアウト</h1>
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
      <div className="w-full max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">チェックアウト</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">注文内容</h2>
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg"
                >
                  <Image
                    src={item.product.image}
                    alt={item.product.name_jp}
                    width={80}
                    height={80}
                    className="rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.name_jp}</h3>
                    <p className="text-sm text-gray-500">{item.product.brand}</p>
                    <p className="text-sm">数量: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ¥{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">合計:</span>
                <span className="text-2xl font-bold text-green-600">
                  ¥{cart.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">お客様情報</h2>

            {/* TODO: Replace with actual form handling when implementing database */}
            <div className="space-y-6">
              <div className="p-6 border rounded-lg bg-yellow-50 border-yellow-200">
                <h3 className="font-semibold text-yellow-800 mb-2">
                  ⚠️ デモ機能について
                </h3>
                <p className="text-sm text-yellow-700">
                  これはデモ版です。実際の支払い処理は行われません。<br />
                  データベース統合時には以下の機能を実装してください：
                </p>
                <ul className="text-sm text-yellow-700 mt-2 list-disc list-inside">
                  <li>ユーザー認証・ログイン機能</li>
                  <li>配送先住所入力フォーム</li>
                  <li>支払い方法選択（クレジットカード、PayPal等）</li>
                  <li>注文確認メール送信</li>
                  <li>注文履歴管理</li>
                </ul>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    お名前 *
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-md"
                    placeholder="山田太郎"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    メールアドレス *
                  </label>
                  <input
                    type="email"
                    className="w-full p-3 border rounded-md"
                    placeholder="example@email.com"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    配送先住所 *
                  </label>
                  <textarea
                    className="w-full p-3 border rounded-md"
                    rows={3}
                    placeholder="〒123-4567&#10;東京都渋谷区..."
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    支払い方法 *
                  </label>
                  <select className="w-full p-3 border rounded-md" disabled title="支払い方法">
                    <option>クレジットカード</option>
                    <option>PayPal</option>
                    <option>代金引換</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-4 pt-6">
                <Link href="/cart" className="flex-1">
                  <Button variant="outline" className="w-full" size="lg">
                    カートに戻る
                  </Button>
                </Link>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="flex-1"
                  size="lg"
                >
                  {isProcessing ? "処理中..." : "注文を確定する"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}