"use client";

import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const { cart } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [customer, setCustomer] = useState({
    lastName: "",
    firstName: "",
    email: "",
    address: "",
    paymentMethod: "credit_card",
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/profile", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const user = data?.user ?? null;
          if (user) {
            setIsLoggedIn(true);
            setCustomer((prev) => ({
              ...prev,
              lastName: user.lastName ?? "",
              firstName: user.firstName ?? "",
              email: user.email ?? "",
              address: user.address ?? "",
            }));
          }
        }
      } catch {}
    })();
  }, []);

  const handleCustomerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

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
      if (
        !customer.lastName ||
        !customer.firstName ||
        !customer.email ||
        !customer.address
      ) {
        alert("必須項目を入力してください");
        setIsProcessing(false);
        return;
      }

      // Stripe Checkout Session を作成
      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          customer: {
            lastName: customer.lastName,
            firstName: customer.firstName,
            email: customer.email,
            address: customer.address,
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "チェックアウトセッションの作成に失敗しました");
      }

      const data = await res.json();
      
      // Stripe Checkout ページにリダイレクト
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("チェックアウト URL が取得できませんでした");
      }
    } catch (e: any) {
      alert(e?.message ?? "注文に失敗しました");
      setIsProcessing(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <main className="w-full min-h-screen py-16">
        <div className="w-full max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">チェックアウト</h1>
          <div className="text-center py-16">
            <p className="text-lg text-gray-500 mb-6">カートは空です</p>
            <Link href="/products">
              <Button size="lg">商品を見る</Button>
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
                    <p className="text-sm text-gray-500">
                      {item.product.brand}
                    </p>
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
            <div className="space-y-6">
              <div className="p-6 border rounded-lg bg-blue-50 border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">
                  💳 安全な決済について
                </h3>
                <p className="text-sm text-blue-700">
                  お支払いは Stripe の安全な決済システムを使用しています。
                  <br />
                  クレジットカード情報は当社では保存されません。
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  <a
                    href="/legal/tokusho"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    特定商取引法に基づく表記
                  </a>
                  をご確認ください。
                </p>
              </div>
              {/* editable form fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      氏 *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      className="w-full p-3 border rounded-md"
                      placeholder="山田"
                      value={customer.lastName}
                      onChange={handleCustomerChange}
                      // disabled={isLoggedIn}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      名 *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      className="w-full p-3 border rounded-md"
                      placeholder="太郎"
                      value={customer.firstName}
                      onChange={handleCustomerChange}
                      // disabled={isLoggedIn}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    メールアドレス *
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full p-3 border rounded-md"
                    placeholder="example@email.com"
                    value={customer.email}
                    onChange={handleCustomerChange}
                    disabled={isLoggedIn}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    配送先住所 *
                  </label>
                  <textarea
                    name="address"
                    className="w-full p-3 border rounded-md"
                    rows={3}
                    placeholder="〒123-4567\n東京都渋谷区..."
                    value={customer.address}
                    onChange={handleCustomerChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    支払い方法 *
                  </label>
                  <select
                    title="paymentMethod"
                    name="paymentMethod"
                    className="w-full p-3 border rounded-md"
                    value={customer.paymentMethod}
                    onChange={handleCustomerChange}
                  >
                    <option value="credit_card">クレジットカード</option>
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
