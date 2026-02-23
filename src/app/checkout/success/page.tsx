"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";

interface Order {
  id: number;
  productId: number;
  quantity: number;
  total: number | null;
  product: {
    id: number;
    name_jp: string;
    brand: string;
    image: string;
    price: number;
  };
}

// useSearchParams を使用するコンポーネントを分離
function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const sessionIdParam = searchParams.get("session_id");
    
    if (!sessionIdParam) {
      setError("セッション ID が見つかりません");
      setLoading(false);
      return;
    }

    setSessionId(sessionIdParam);

    // 注文を処理
    (async () => {
      try {
        const res = await fetch(`/api/checkout/success?session_id=${sessionIdParam}`);
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "注文処理に失敗しました");
        }

        const data = await res.json();
        
        if (data.success && data.orders) {
          setOrders(data.orders);
          // カートをクリア
          clearCart();
        } else {
          throw new Error("注文データが取得できませんでした");
        }
      } catch (e: any) {
        setError(e?.message || "エラーが発生しました");
      } finally {
        setLoading(false);
      }
    })();
  }, [searchParams, clearCart]);

  const totalAmount = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  if (loading) {
    return (
      <main className="w-full min-h-screen py-16">
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">注文を処理しています...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="w-full min-h-screen py-16">
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h1 className="text-3xl font-bold mb-4">エラーが発生しました</h1>
            <p className="text-lg text-gray-600 mb-8">{error}</p>
            <div className="flex gap-4 justify-center">
              <Link href="/checkout">
                <Button variant="outline">チェックアウトに戻る</Button>
              </Link>
              <Link href="/products">
                <Button>商品を見る</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen py-16">
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="text-accent text-5xl mb-4">✓</div>
          <h1 className="text-3xl font-bold mb-2">ご注文ありがとうございます！</h1>
          <p className="text-lg text-gray-600">
            お支払いが正常に完了しました
          </p>
          {sessionId && (
            <p className="text-sm text-gray-500 mt-2">
              注文番号: {sessionId}
            </p>
          )}
        </div>

        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">注文内容</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center space-x-4 p-4 border rounded-lg"
              >
                <Image
                  src={order.product.image}
                  alt={order.product.name_jp}
                  width={80}
                  height={80}
                  className="rounded-md"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{order.product.name_jp}</h3>
                  <p className="text-sm text-gray-500">{order.product.brand}</p>
                  <p className="text-sm">数量: {order.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ¥{((order.total || order.product.price * order.quantity)).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">合計:</span>
              <span className="text-2xl font-bold text-accent">
                ¥{totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-primary/20 border border-accent rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-accent mb-2">📧 注文確認メール</h3>
          <p className="text-sm text-accent">
            ご注文確認メールを送信いたしました。メールボックスをご確認ください。
            <br />
            メールが届かない場合は、迷惑メールフォルダもご確認ください。
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/orders">
            <Button variant="outline" size="lg">
              注文履歴を見る
            </Button>
          </Link>
          <Link href="/products">
            <Button size="lg">
              続けて買い物をする
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

// Suspense boundary でラップしたメインコンポーネント
export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="w-full min-h-screen py-16">
          <div className="w-full max-w-4xl mx-auto px-4">
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">読み込み中...</p>
            </div>
          </div>
        </main>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}

