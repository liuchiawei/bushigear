"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { PREFECTURES } from "@/constants/prefectures";
import Image from "next/image";
import Link from "next/link";

type UserProfile = {
  id: number;
  email: string;
  lastName?: string | null;
  firstName?: string | null;
  gender?: string | null;
  birthday?: string | null;
  postalCode?: string | null;
  prefecture?: string | null;
  city?: string | null;
  street?: string | null;
  building?: string | null;
  room?: string | null;
  address?: string | null;
};

type OrderItem = {
  id: number;
  productId: number;
  quantity: number;
  createdAt: string;
  product: {
    id: number;
    name_jp: string;
    name_en: string;
    price: number;
    image: string;
    brand: string;
  };
};

export default function MyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const [activeTab, setActiveTab] = useState<"profile" | "cart" | "orders">(
    "profile"
  );
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    gender: "",
    birthday: "",
    postalCode: "",
    prefecture: "",
    city: "",
    street: "",
    building: "",
    room: "",
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/mypage");
    }
  }, [status, router]);

  // Fetch user profile
  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
      fetchOrders();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) throw new Error("プロフィールの取得に失敗しました");
      const data = await res.json();
      setProfile(data.user);

      // Initialize form with profile data
      if (data.user) {
        setForm({
          lastName: data.user.lastName || "",
          firstName: data.user.firstName || "",
          gender: data.user.gender || "",
          birthday: data.user.birthday
            ? data.user.birthday.substring(0, 10)
            : "",
          postalCode: data.user.postalCode || "",
          prefecture: data.user.prefecture || "",
          city: data.user.city || "",
          street: data.user.street || "",
          building: data.user.building || "",
          room: data.user.room || "",
        });
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("注文履歴の取得に失敗しました");
      const data = await res.json();

      // Filter orders for current user
      const userOrders = data.filter(
        (order: any) => order.userId === Number(session?.user?.id)
      );
      setOrders(userOrders);
    } catch (e: any) {
      console.error("Failed to fetch orders:", e);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setError("");
    setSuccess("");

    // Validation
    if (form.postalCode && !/^\d{3}-?\d{4}$/.test(form.postalCode)) {
      setError("郵便番号は 123-4567 の形式（半角）で入力してください。");
      return;
    }

    if (form.street && /[０-９]/.test(form.street)) {
      setError("丁目・番地・号の数字は半角で入力してください。");
      return;
    }

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "更新に失敗しました");
      }

      const data = await res.json();
      setProfile(data.user);
      setEditing(false);
      setSuccess("プロフィールを更新しました");
      setTimeout(() => setSuccess(""), 3000);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const calculateCartTotal = () => {
    return cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">読み込み中...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">マイページ</h1>
          <p className="text-gray-600 mt-2">
            ようこそ、
            {/* 名前が設定されている場合は名前を表示、設定されていない場合はメールアドレスを表示 */}
            {profile?.lastName || profile?.firstName
              ? `${profile?.lastName || ""} ${profile?.firstName || ""}`.trim()
              : profile?.email || session?.user?.email}{" "}
            {/* 名前が設定されている場合は”さん”を表示、設定されていない場合は空文字列を表示 */}
            {profile?.lastName || profile?.firstName ? "さん" : ""}
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "profile"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                プロフィール
              </button>
              <button
                onClick={() => setActiveTab("cart")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "cart"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                カート ({cart.items.length})
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "orders"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                購入履歴 ({orders.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">プロフィール情報</h2>
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      編集
                    </button>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4">
                    {success}
                  </div>
                )}

                {editing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          姓
                        </label>
                        <input
                          title="lastName"
                          type="text"
                          name="lastName"
                          value={form.lastName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          名
                        </label>
                        <input
                          title="firstName"
                          type="text"
                          name="firstName"
                          value={form.firstName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          性別
                        </label>
                        <select
                          title="gender"
                          name="gender"
                          value={form.gender}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">選択してください</option>
                          <option value="male">男性</option>
                          <option value="female">女性</option>
                          <option value="other">その他</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          誕生日
                        </label>
                        <input
                          title="birthday"
                          type="date"
                          name="birthday"
                          value={form.birthday}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <h3 className="text-lg font-semibold mb-4">住所情報</h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            郵便番号（半角）
                          </label>
                          <input
                            type="text"
                            name="postalCode"
                            value={form.postalCode}
                            onChange={handleInputChange}
                            placeholder="123-4567"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            都道府県
                          </label>
                          <select
                            title="prefecture"
                            name="prefecture"
                            value={form.prefecture}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">選択してください</option>
                            {PREFECTURES.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            市区町村
                          </label>
                          <input
                            title="city"
                            type="text"
                            name="city"
                            value={form.city}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            丁目・番地・号（半角）
                          </label>
                          <input
                            title="street"
                            type="text"
                            name="street"
                            value={form.street}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            建物名・会社名（任意）
                          </label>
                          <input
                            type="text"
                            title="building"
                            name="building"
                            value={form.building}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            部屋番号（任意）
                          </label>
                          <input
                            type="text"
                            title="room"
                            name="room"
                            value={form.room}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveProfile}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          setError("");
                        }}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-500">メールアドレス</p>
                        <p className="text-lg font-medium">{profile?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">氏名</p>
                        <p className="text-lg font-medium">
                          {profile?.lastName || profile?.firstName
                            ? `${profile?.lastName || ""} ${
                                profile?.firstName || ""
                              }`.trim()
                            : "未設定"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">性別</p>
                        <p className="text-lg font-medium">
                          {profile?.gender === "male"
                            ? "男性"
                            : profile?.gender === "female"
                            ? "女性"
                            : profile?.gender === "other"
                            ? "その他"
                            : "未設定"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">誕生日</p>
                        <p className="text-lg font-medium">
                          {profile?.birthday
                            ? new Date(profile.birthday).toLocaleDateString(
                                "ja-JP"
                              )
                            : "未設定"}
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <h3 className="text-lg font-semibold mb-3">住所</h3>
                      <p className="text-gray-700">
                        {profile?.address || "未設定"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cart Tab */}
            {activeTab === "cart" && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">
                  ショッピングカート
                </h2>

                {cart.items.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">カートは空です</p>
                    <Link
                      href="/products"
                      className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      商品を見る
                    </Link>
                  </div>
                ) : (
                  <div>
                    <div className="space-y-4 mb-6">
                      {cart.items.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg"
                        >
                          <div className="w-24 h-24 relative flex-shrink-0">
                            <Image
                              src={item.product.image}
                              alt={item.product.name_jp}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-semibold text-lg">
                              {item.product.name_jp}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {item.product.brand}
                            </p>
                            <p className="text-blue-600 font-semibold mt-1">
                              {formatPrice(item.product.price)}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <input
                              title="quantity"
                              type="number"
                              min="1"
                              max={item.product.stock}
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  item.product.id,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
                            />
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-red-600 hover:text-red-700 px-3 py-2"
                            >
                              削除
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xl font-semibold">合計:</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {formatPrice(calculateCartTotal())}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <Link
                          href="/checkout"
                          className="flex-1 bg-blue-600 text-white text-center px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                          購入手続きへ
                        </Link>
                        <button
                          onClick={clearCart}
                          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          カートを空にする
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">購入履歴</h2>

                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">購入履歴がありません</p>
                    <Link
                      href="/products"
                      className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      商品を見る
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-20 relative flex-shrink-0">
                            <Image
                              src={order.product.image}
                              alt={order.product.name_jp}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {order.product.name_jp}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                  {order.product.brand}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  注文番号: #{order.id}
                                </p>
                                <p className="text-sm text-gray-500">
                                  購入日: {formatDate(order.createdAt)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-blue-600 font-semibold">
                                  {formatPrice(order.product.price)}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  数量: {order.quantity}
                                </p>
                                <p className="text-lg font-bold text-gray-900 mt-1">
                                  {formatPrice(
                                    order.product.price * order.quantity
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
