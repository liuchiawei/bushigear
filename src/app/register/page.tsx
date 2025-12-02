"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { PREFECTURES } from "@/constants/prefectures";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    email: "",
    password: "",
    gender: "",
    postalCode: "",
    prefecture: "",
    city: "",
    street: "",
    building: "",
    room: "",
    birthday: "",
  });
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toHalfWidthDigits = (s: string) =>
    s.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));

  const normalizePostal = (raw: string) => {
    const half = toHalfWidthDigits(raw).replace(/[^0-9]/g, "");
    return half;
  };

  const sanitize = (v: string) => {
    const t = v.trim();
    return t === "" ? null : t;
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("画像ファイルを選択してください");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("ファイルサイズは5MB以下にしてください");
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
        throw new Error(data.error || "アップロードに失敗しました");
      }

      const data = await res.json();
      setAvatarUrl(data.url);
    } catch (err: any) {
      setError(err.message || "アップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.lastName.trim()) {
      setError("姓を入力してください。");
      return;
    }
    if (!form.firstName.trim()) {
      setError("名を入力してください。");
      return;
    }
    if (!/^\d{3}-?\d{4}$/.test(form.postalCode)) {
      setError("郵便番号は 123-4567 の形式（半角）で入力してください。");
      return;
    }
    if (!form.prefecture) {
      setError("都道府県を選択してください。");
      return;
    }
    if (!form.city.trim()) {
      setError("市区町村を入力してください。");
      return;
    }
    if (!form.street.trim()) {
      setError("丁目・番地・号を入力してください。");
      return;
    }
    if (/[０-９]/.test(form.street)) {
      setError("丁目・番地・号の数字は半角で入力してください。");
      return;
    }

    const payload = {
      lastName: sanitize(form.lastName) ?? undefined,
      firstName: sanitize(form.firstName) ?? undefined,
      email: form.email.trim(),
      password: form.password,
      image: avatarUrl || null,
      gender: sanitize(form.gender),
      birthday: form.birthday || null,
      postalCode: normalizePostal(form.postalCode),
      prefecture: sanitize(form.prefecture),
      city: sanitize(form.city),
      street: sanitize(form.street),
      building: sanitize(form.building || ""),
      room: sanitize(form.room || ""),
    };

    setSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/login?registered=true");
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.message || "登録に失敗しました");
      }
    } catch {
      setError("予期しないエラーが発生しました。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await signIn("google");
    } catch {
      setError("Google登録に失敗しました。もう一度お試しください。");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full py-16">
      <h1 className="text-2xl font-bold mb-6">新規登録</h1>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            プロフィール画像（任意）
          </label>
          {avatarUrl && (
            <div className="mb-2">
              <Image
                src={avatarUrl}
                alt="Avatar preview"
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
            </div>
          )}
          <div className="relative">
            <input
              title="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={uploading || submitting || googleLoading}
              className="w-full p-2 border rounded file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 disabled:opacity-50"
            />
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded">
                <div className="flex items-center gap-2">
                  <Spinner size="sm" />
                  <span className="text-sm">アップロード中...</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">氏</label>
          <Input
            title="lastName"
            name="lastName"
            type="text"
            value={form.lastName}
            onChange={onChange}
            disabled={submitting || googleLoading}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">名</label>
          <Input
            title="firstName"
            name="firstName"
            type="text"
            value={form.firstName}
            onChange={onChange}
            disabled={submitting || googleLoading}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            title="email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            disabled={submitting || googleLoading}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <Input
            title="password"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            disabled={submitting || googleLoading}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">性別</label>
          <select
            title="gender"
            name="gender"
            value={form.gender}
            onChange={onChange}
            disabled={submitting || googleLoading}
            className="w-full h-9 px-3 py-1 text-sm border rounded-md bg-background disabled:opacity-50 disabled:cursor-not-allowed"
            required
          >
            <option value="">選択してください</option>
            <option value="male">男性</option>
            <option value="female">女性</option>
            <option value="other">その他</option>
          </select>
        </div>
        <div>
          <h2 className="text-lg font-semibold mt-6 mb-2">住所</h2>
          <label className="block text-sm font-medium mb-1">
            郵便番号（半角数字）
          </label>
          <Input
            name="postalCode"
            value={form.postalCode}
            onChange={onChange}
            inputMode="numeric"
            placeholder="123-4567"
            disabled={submitting || googleLoading}
            className="mb-3"
          />

          {/* 都道府県（選單） */}
          <label className="block text-sm font-medium mb-1">都道府県</label>
          <select
            title="prefecture"
            name="prefecture"
            value={form.prefecture}
            onChange={onChange}
            disabled={submitting || googleLoading}
            className="w-full h-9 px-3 py-1 text-sm border rounded-md bg-background disabled:opacity-50 disabled:cursor-not-allowed mb-3"
          >
            <option value="">選択してください</option>
            {PREFECTURES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {/* 市区町村 */}
          <label className="block text-sm font-medium mb-1">市区町村</label>
          <Input
            title="city"
            name="city"
            value={form.city}
            onChange={onChange}
            disabled={submitting || googleLoading}
            className="mb-3"
          />

          {/* 丁目・番地・号（数字は半角数字） */}
          <label className="block text-sm font-medium mb-1">
            丁目・番地・号（数字は半角）
          </label>
          <Input
            title="street"
            name="street"
            value={form.street}
            onChange={onChange}
            disabled={submitting || googleLoading}
            className="mb-3"
          />

          {/* 建物名／会社名（任意） */}
          <label className="block text-sm font-medium mb-1">
            建物名／会社名（任意）
          </label>
          <Input
            title="building"
            name="building"
            value={form.building}
            onChange={onChange}
            disabled={submitting || googleLoading}
            className="mb-3"
          />

          {/* 部屋番号（任意） */}
          <label className="block text-sm font-medium mb-1">
            部屋番号（任意）
          </label>
          <Input
            title="room"
            name="room"
            value={form.room}
            onChange={onChange}
            disabled={submitting || googleLoading}
            className="mb-4"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">誕生日</label>
          <Input
            title="birthday"
            name="birthday"
            type="date"
            value={form.birthday}
            onChange={onChange}
            disabled={submitting || googleLoading}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={submitting || googleLoading}
        >
          {submitting ? (
            <>
              <Spinner size="sm" variant="white" />
              登録中...
            </>
          ) : (
            "登録"
          )}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <div className="flex-1 border-t"></div>
        <span className="text-sm text-muted-foreground">または</span>
        <div className="flex-1 border-t"></div>
      </div>

      <Button
        onClick={handleGoogleSignIn}
        variant="default"
        className="w-full"
        disabled={submitting || googleLoading}
      >
        {googleLoading ? (
          <>
            <Spinner size="sm" />
            Googleで登録中...
          </>
        ) : (
          "Googleで登録"
        )}
      </Button>

      <p className="mt-6 text-center text-sm">
        既にアカウントをお持ちの方は{" "}
        <a href="/login" className="text-primary underline hover:no-underline">
          こちら
        </a>
      </p>
    </div>
  );
}
