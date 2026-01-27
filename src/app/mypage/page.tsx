"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { PREFECTURES } from "@/constants/prefectures";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Comment } from "@/lib/type";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Eye, Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import {
  getLocalizedText,
  type Locale,
  getTranslation,
} from "@/lib/i18n";
import content from "@/data/content.json";

type UserProfile = {
  id: number;
  email: string;
  image?: string | null;
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

type LikeItem = {
  id: number;
  productId: number;
  product: {
    id: number;
    name_jp: string;
    name_en: string;
    price: number;
    image: string;
    brand: string;
  };
};

function MyPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale() as Locale;
  const m = content.mypage;
  const l = useCallback(
    (node: { jp: string } & Record<string, string>) =>
      getTranslation(node, locale),
    [locale]
  );
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const initialTabParam = searchParams?.get("tab");
  const initialTab =
    initialTabParam === "cart" ||
    initialTabParam === "orders" ||
    initialTabParam === "likes" ||
    initialTabParam === "comments"
      ? (initialTabParam as "cart" | "orders" | "likes" | "comments")
      : "profile";

  const [activeTab, setActiveTab] = useState<
    "profile" | "cart" | "orders" | "likes" | "comments"
  >(initialTab);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [likes, setLikes] = useState<LikeItem[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    image: "",
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

  const myTabs = m.tabs;
  const tabLabel = (key: keyof typeof myTabs) => l(myTabs[key]);
  const profileCopy = m.profile;
  const genderLabel = (key: keyof typeof profileCopy.fields.genderOptions) =>
    locale === "jp"
      ? profileCopy.fields.genderOptions[key].jp
      : getLocalizedText(profileCopy.fields.genderOptions[key], locale);
  const cartTab = m.cartTab;
  const ordersCopy = m.orders;
  const likesCopy = m.likes;
  const commentsCopy = m.comments;
  const dateLocale =
    locale === "jp"
      ? "ja-JP"
      : locale === "zh_tw"
        ? "zh-TW"
        : locale === "zh_cn"
          ? "zh-CN"
          : "en-US";
  const dateInputLang =
    locale === "jp"
      ? "ja-JP"
      : locale === "zh_tw"
        ? "zh-TW"
        : locale === "zh_cn"
          ? "zh-CN"
          : "en-US";

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) throw new Error(l(profileCopy.errors.fetchProfile));
      const data = await res.json();
      setProfile(data.user);
      if (data.user) {
        setForm({
          image: data.user.image || "",
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
  }, [l, profileCopy.errors.fetchProfile]);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error(l(profileCopy.errors.fetchOrders));
      const data = await res.json();
      const userOrders = data.filter(
        (order: any) => order.userId === Number(session?.user?.id)
      );
      setOrders(userOrders);
    } catch (e: any) {
      console.error("Failed to fetch orders:", e);
    }
  }, [session?.user?.id, l, profileCopy.errors.fetchOrders]);

  const fetchLikes = useCallback(async () => {
    try {
      const res = await fetch("/api/likes");
      if (!res.ok) throw new Error(l(profileCopy.errors.fetchLikes));
      const data = await res.json();
      const likesData = Array.isArray(data.likes) ? data.likes : data;
      setLikes(likesData as LikeItem[]);
    } catch (e: any) {
      console.error("Failed to fetch likes:", e);
    }
  }, [l, profileCopy.errors.fetchLikes]);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch("/api/comment?mine=1");
      if (!res.ok) throw new Error(l(profileCopy.errors.fetchComments));
      const data = await res.json();
      const commentsData = Array.isArray(data.comments) ? data.comments : [];
      setComments(commentsData as Comment[]);
    } catch (e: any) {
      console.error("Failed to fetch comments:", e);
    }
  }, [l, profileCopy.errors.fetchComments]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?redirect=/mypage`);
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
      fetchOrders();
      fetchLikes();
      fetchComments();
    }
  }, [status, fetchOrders, fetchProfile, fetchLikes, fetchComments]);

  useEffect(() => {
    if (!searchParams) return;
    const tabParam = searchParams.get("tab");
    if (
      tabParam === "profile" ||
      tabParam === "cart" ||
      tabParam === "orders" ||
      tabParam === "likes" ||
      tabParam === "comments"
    ) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleDeleteComment = async (id: number) => {
    if (!confirm(profileCopy.errors.confirmDeleteReview[locale === "jp" ? "jp" : locale])) return;
    try {
      const res = await fetch("/api/comment", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("削除に失敗しました");
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError(content.auth.register.imageFileError[locale === "jp" ? "jp" : locale]);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(content.auth.register.fileSizeError[locale === "jp" ? "jp" : locale]);
      return;
    }
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || l(profileCopy.errors.uploadFailed));
      }
      const data = await res.json();
      setForm({ ...form, image: data.url });
      setSuccess(l(profileCopy.errors.uploadSuccess));
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || l(profileCopy.errors.uploadFailed));
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setError("");
    setSuccess("");
    if (form.postalCode && /^\d{3}-?\d{4}$/.test(form.postalCode) === false) {
      setError(profileCopy.errors.postalFormat[locale === "jp" ? "jp" : locale]);
      return;
    }
    if (form.street && /[０-９]/.test(form.street)) {
      setError(profileCopy.errors.streetNumber[locale === "jp" ? "jp" : locale]);
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
        throw new Error(
          errorData.message ||
            profileCopy.errors.updateFailed[locale === "jp" ? "jp" : locale]
        );
      }
      const data = await res.json();
      setProfile(data.user);
      setEditing(false);
      setSuccess(profileCopy.errors.updateSuccess[locale === "jp" ? "jp" : locale]);
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
    return new Date(dateString).toLocaleDateString(dateLocale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (status === "loading" || loading) {
    return (
      <div className="w-full max-w-6xl min-h-screen mx-auto py-12 px-4 md:px-0">
        <Skeleton className="w-full flex items-center gap-4 rounded-lg shadow-sm p-6 mb-6">
          <Skeleton className="size-16 bg-gray-100 rounded-full" />
          <div className="flex flex-col gap-4">
            <Skeleton className="w-24 h-5 bg-gray-100 rounded-full" />
            <Skeleton className="w-48 h-3 bg-gray-100 rounded-full" />
          </div>
        </Skeleton>
        <Skeleton className="w-full h-60 md:h-108 rounded-lg shadow-sm flex flex-col items-center justify-center gap-4 mb-6">
          <Loader2 className="size-20 text-gray-300 animate-spin" />
          <p className="text-2xl text-gray-400 animate-pulse">{l(m.loading)}</p>
        </Skeleton>
      </div>
    );
  }
  if (status === "unauthenticated") {
    return null;
  }
  const displayName =
    profile?.lastName || profile?.firstName
      ? `${profile?.lastName || ""} ${profile?.firstName || ""}`.trim()
      : profile?.email || session?.user?.email || "";
  const welcomeText = l(m.welcome).replace("{name}", displayName);
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage
                src={
                  (profile?.image && profile.image.trim() !== "") ||
                  (session?.user?.image && session.user.image.trim() !== "")
                    ? (profile?.image || session?.user?.image || undefined)
                    : undefined
                }
                alt={
                  profile?.lastName || profile?.firstName
                    ? `${profile?.lastName || ""} ${
                        profile?.firstName || ""
                      }`.trim()
                    : session?.user?.email || ""
                }
              />
              <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                {profile?.lastName?.[0] ||
                  profile?.firstName?.[0] ||
                  session?.user?.email?.[0].toUpperCase() ||
                  "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {l(m.title)}
              </h1>
              <p className="text-gray-600 mt-2">
                {welcomeText}
                {locale === "jp" && (profile?.lastName || profile?.firstName)
                  ? "さん"
                  : ""}
              </p>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === "profile"
                    ? "border-accent text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tabLabel("profile")}
              </button>
              <button
                onClick={() => setActiveTab("cart")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === "cart"
                    ? "border-accent text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tabLabel("cart")} ({cart.items.length})
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === "orders"
                    ? "border-accent text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tabLabel("orders")} ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab("likes")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === "likes"
                    ? "border-accent text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tabLabel("likes")} ({likes.length})
              </button>
              <button
                onClick={() => setActiveTab("comments")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${activeTab === "comments" ? "border-accent text-primary" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
              >
                {tabLabel("comments")} ({comments.length})
              </button>
            </nav>
          </div>
          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">
                    {l(profileCopy.infoTitle)}
                  </h2>
                  {!editing && (
                    <Button onClick={() => setEditing(true)}>
                      {l(profileCopy.edit)}
                    </Button>
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
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {l(profileCopy.imageLabel)}
                      </label>
                      <div className="flex items-center gap-4">
                        {form.image && (
                          <Image
                            src={form.image}
                            alt="Avatar preview"
                            width={96}
                            height={96}
                            className="w-24 h-24 rounded-full object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <label className="flex items-center gap-2 cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <div className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm">
                              {content.auth.register.fileSelect[locale === "jp" ? "jp" : locale]}
                            </div>
                            <span className="text-sm text-muted-foreground truncate">
                              {form.image
                                ? form.image.split("/").pop()
                                : content.auth.register.noFile[locale === "jp" ? "jp" : locale]}
                            </span>
                            <input
                              title="avatar"
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarUpload}
                              disabled={uploading}
                              className="hidden"
                            />
                          </label>
                          {uploading && (
                            <div className="flex items-center gap-2 text-gray-500">
                              <Loader2 className="size-4 animate-spin" />
                              <p className="text-sm animate-pulse">
                                {l(profileCopy.uploading)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {l(profileCopy.fields.lastName)}
                        </label>
                        <input
                          title="lastName"
                          type="text"
                          name="lastName"
                          value={form.lastName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {l(profileCopy.fields.firstName)}
                        </label>
                        <input
                          title="firstName"
                          type="text"
                          name="firstName"
                          value={form.firstName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {l(profileCopy.fields.gender)}
                        </label>
                        <select
                          title="gender"
                          name="gender"
                          value={form.gender}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">
                            {content.auth.register.selectPlaceholder[locale === "jp" ? "jp" : locale]}
                          </option>
                          <option value="male">{genderLabel("male")}</option>
                          <option value="female">{genderLabel("female")}</option>
                          <option value="other">{genderLabel("other")}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {l(profileCopy.fields.birthday)}
                        </label>
                        <input
                          title="birthday"
                          type="date"
                          lang={dateInputLang}
                          name="birthday"
                          value={form.birthday}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="border-t pt-4 mt-4">
                      <h3 className="text-lg font-semibold mb-4">
                        {l(profileCopy.fields.addressSection)}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {l(profileCopy.fields.postalCode)}
                          </label>
                          <input
                            type="text"
                            name="postalCode"
                            value={form.postalCode}
                            onChange={handleInputChange}
                            placeholder="123-4567"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {l(profileCopy.fields.prefecture)}
                          </label>
                          <select
                            title="prefecture"
                            name="prefecture"
                            value={form.prefecture}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="">
                              {content.auth.register.selectPlaceholder[locale === "jp" ? "jp" : locale]}
                            </option>
                            {PREFECTURES.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {l(profileCopy.fields.city)}
                          </label>
                          <input
                            title="city"
                            type="text"
                            name="city"
                            value={form.city}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {l(profileCopy.fields.street)}
                          </label>
                          <input
                            title="street"
                            type="text"
                            name="street"
                            value={form.street}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {l(profileCopy.fields.building)}
                          </label>
                          <input
                            type="text"
                            title="building"
                            name="building"
                            value={form.building}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {l(profileCopy.fields.room)}
                          </label>
                          <input
                            type="text"
                            title="room"
                            name="room"
                            value={form.room}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleSaveProfile}>
                        {l(profileCopy.save)}
                      </Button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          setError("");
                        }}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        {l(profileCopy.cancel)}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Avatar className="size-60 row-span-2 mx-auto">
                      <AvatarImage
                        src={
                          (profile?.image && profile.image.trim() !== "") ||
                          (session?.user?.image && session.user.image.trim() !== "")
                            ? (profile?.image || session?.user?.image || undefined)
                            : undefined
                        }
                        alt={profile?.lastName || profile?.firstName || ""}
                      />
                      <AvatarFallback>
                        {profile?.lastName?.[0] ||
                          profile?.firstName?.[0] ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="mb-2 text-sm text-gray-500">
                        {l(profileCopy.email)}
                      </p>
                      <p className="text-lg md:text-2xl">{profile?.email}</p>
                    </div>
                    <div>
                      <p className="mb-2 text-sm text-gray-500">
                        {l(profileCopy.name)}
                      </p>
                      <p className="text-lg md:text-2xl">
                        {profile?.lastName || profile?.firstName
                          ? `${profile?.lastName || ""} ${
                              profile?.firstName || ""
                            }`.trim()
                          : l(profileCopy.unset)}
                      </p>
                    </div>
                    <div>
                      <p className="mb-2 text-sm text-gray-500">
                        {l(profileCopy.fields.gender)}
                      </p>
                      <p className="text-lg md:text-2xl">
                        {profile?.gender === "male"
                          ? genderLabel("male")
                          : profile?.gender === "female"
                          ? genderLabel("female")
                          : profile?.gender === "other"
                          ? genderLabel("other")
                          : l(profileCopy.unset)}
                      </p>
                    </div>
                    <div>
                      <p className="mb-2text-sm text-gray-500">
                        {l(profileCopy.fields.birthday)}
                      </p>
                      <p className="text-lg md:text-2xl">
                        {profile?.birthday
                          ? new Date(profile.birthday).toLocaleDateString(
                              dateLocale
                            )
                          : l(profileCopy.unset)}
                      </p>
                    </div>
                    <div className="col-span-1 md:col-span-3 border-t">
                      <h3 className="mt-4 mb-2 text-sm text-gray-500">
                        {l(profileCopy.address)}
                      </h3>
                      <p className="text-gray-700 text-md md:text-xl">
                        {profile?.address || l(profileCopy.unset)}
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
                  {l(cartTab.title)}
                </h2>
                {cart.items.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">
                      {cartTab.empty[locale === "jp" ? "jp" : locale]}
                    </p>
                    <Button asChild>
                      <Link href="/products">
                        {cartTab.viewProduct[locale === "jp" ? "jp" : locale]}
                      </Link>
                    </Button>
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
                            <h3 className="font-semibold text-lg md:text-2xl">
                              {locale === "jp"
                                ? item.product.name_jp
                                : item.product.name_en || item.product.name_jp}
                            </h3>
                            <p className="text-gray-500 text-sm">
                              {item.product.brand}
                            </p>
                            <p className="text-secondary font-semibold mt-1">
                              {formatPrice(item.product.price)}
                            </p>
                          </div>
                          <div className="flex flex-col md:flex-row items-center gap-2">
                            <input
                              title={cartTab.quantity[locale === "jp" ? "jp" : locale]}
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
                              className="w-full md:w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
                            />
                            <div className="flex items-center gap-1">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="hover:bg-primary hover:text-background"
                                      asChild
                                    >
                                      <Link
                                        href={`/products/${item.product.id}`}
                                      >
                                        <Eye className="size-4" />
                                      </Link>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{cartTab.details[locale === "jp" ? "jp" : locale]}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      onClick={() =>
                                        removeFromCart(item.product.id)
                                      }
                                      variant="outline"
                                      size="icon"
                                    >
                                      <Trash2 className="size-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{cartTab.remove[locale === "jp" ? "jp" : locale]}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xl font-semibold">
                          {cartTab.total[locale === "jp" ? "jp" : locale]}:
                        </span>
                        <span className="text-2xl md:text-5xl font-bold text-secondary-600">
                          {formatPrice(calculateCartTotal())}
                        </span>
                      </div>
                      <div className="flex w-full justify-between gap-3">
                        <Button
                          size="lg"
                          variant="outline"
                          className="w/full shrink bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                          onClick={clearCart}
                        >
                          {cartTab.clear[locale === "jp" ? "jp" : locale]}
                        </Button>
                        <Button asChild size="lg" className="w/full shrink">
                          <Link href="/checkout">
                            {cartTab.checkout[locale === "jp" ? "jp" : locale]}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">
                  {l(ordersCopy.title)}
                </h2>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">
                      {ordersCopy.empty[locale === "jp" ? "jp" : locale]}
                    </p>
                    <Button asChild>
                      <Link href="/products">
                        {cartTab.viewProduct[locale === "jp" ? "jp" : locale]}
                      </Link>
                    </Button>
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
                          <div className="grow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {locale === "jp"
                                    ? order.product.name_jp
                                    : order.product.name_en || order.product.name_jp}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                  {order.product.brand}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  {ordersCopy.orderId[locale === "jp" ? "jp" : locale]}: #{order.id}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {ordersCopy.purchaseDate[locale === "jp" ? "jp" : locale]}: {formatDate(order.createdAt)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-secondary-600 font-semibold">
                                  {formatPrice(order.product.price)}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {ordersCopy.quantity[locale === "jp" ? "jp" : locale]}: {order.quantity}
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
            {/* Likes Tab */}
            {activeTab === "likes" && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">
                  {l(likesCopy.title)}
                </h2>
                {likes.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">
                      {likesCopy.empty[locale === "jp" ? "jp" : locale]}
                    </p>
                    <Button asChild>
                      <Link href="/products">
                        {cartTab.viewProduct[locale === "jp" ? "jp" : locale]}
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {likes.map((like) => (
                      <div
                        key={like.product.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-20 relative flex-shrink-0">
                            <Image
                              src={like.product.image}
                              alt={like.product.name_jp}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="grow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {locale === "jp"
                                    ? like.product.name_jp
                                    : like.product.name_en || like.product.name_jp}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                  {like.product.brand}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  ¥{like.product.price.toLocaleString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <Link
                                  href={`/products/${like.product.id}`}
                                  className="text-primary hover:underline"
                                >
                                  {likesCopy.view[locale === "jp" ? "jp" : locale]}
                                </Link>
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
            {/* Comments Tab */}
            {activeTab === "comments" && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">
                  {l(commentsCopy.title)}
                </h2>
                {comments.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">
                      {commentsCopy.empty[locale === "jp" ? "jp" : locale]}
                    </p>
                    <Button asChild>
                      <Link href="/products">
                        {cartTab.viewProduct[locale === "jp" ? "jp" : locale]}
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          {comment.product?.image ? (
                            <div className="w-20 h-20 relative shrink-0">
                              <Image src={comment.product.image} alt={comment.product.name_jp} fill className="object-cover rounded" />
                            </div>
                          ) : null}
                          <div className="grow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {locale === "jp"
                                    ? comment.product?.name_jp ?? commentsCopy.product.jp
                                    : comment.product?.name_en ||
                                      comment.product?.name_jp ||
                                      getLocalizedText(commentsCopy.product, locale)}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {comment.product?.brand ?? ""}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(comment.createdAt).toLocaleDateString(dateLocale)}
                                </p>
                              </div>
                              <div className="text-right text-yellow-500 font-semibold">
                                {"★".repeat(Math.round(comment.score)).padEnd(5, "☆")}
                              </div>
                            </div>
                            <div className="flex justify-between items-start mt-3 gap-2">
                              <p className="text-sm whitespace-pre-line">{comment.comment}</p>
                              <button
                                className="text-xs text-red-500 hover:underline"
                                onClick={() => handleDeleteComment(comment.id)}
                              >
                                {commentsCopy.delete[locale === "jp" ? "jp" : locale]}
                              </button>
                            </div>
                            {comment.product?.id && (
                              <div className="mt-3 text-right">
                                <Link href={`/products/${comment.product.id}`} className="text-primary hover:underline text-sm">
                                  {commentsCopy.productLink[locale === "jp" ? "jp" : locale]}
                                </Link>
                              </div>
                            )}
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

export default function MyPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-6xl min-h-screen mx-auto py-12 px-4 md:px-0 flex items-center justify-center">
          <Loader2 className="size-12 text-gray-300 animate-spin" />
        </div>
      }
    >
      <MyPageContent />
    </Suspense>
  );
}
