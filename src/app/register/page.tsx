"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { PREFECTURES } from "@/constants/prefectures";

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
  const [error, setError] = useState("");

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
      gender: sanitize(form.gender),
      birthday: form.birthday || null,
      postalCode: normalizePostal(form.postalCode),
      prefecture: sanitize(form.prefecture),
      city: sanitize(form.city),
      street: sanitize(form.street),
      building: sanitize(form.building || ""),
      room: sanitize(form.room || ""),
    };

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.message || "登録に失敗しました");
    }
  };

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">新規登録</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">姓</label>
          <input
            title="lastName"
            name="lastName"
            type="text"
            value={form.lastName}
            onChange={onChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">名</label>
          <input
            title="firstName"
            name="firstName"
            type="text"
            value={form.firstName}
            onChange={onChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            title="email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            title="password"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">性別</label>
          <select
            title="gender"
            name="gender"
            value={form.gender}
            onChange={onChange}
            className="w-full p-2 border rounded"
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
          <label className="block text-sm mb-1">郵便番号（半角数字）</label>
          <input
            name="postalCode"
            value={form.postalCode}
            onChange={onChange}
            inputMode="numeric"
            placeholder="123-4567"
            className="w-full p-2 border rounded mb-3"
          />

          {/* 都道府県（選單） */}
          <label className="block text-sm mb-1">都道府県</label>
          <select
            title="prefecture"
            name="prefecture"
            value={form.prefecture}
            onChange={onChange}
            className="w-full p-2 border rounded mb-3"
          >
            <option value="">選択してください</option>
            {PREFECTURES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {/* 市区町村 */}
          <label className="block text-sm mb-1">市区町村</label>
          <input
            title="city"
            name="city"
            value={form.city}
            onChange={onChange}
            className="w-full p-2 border rounded mb-3"
          />

          {/* 丁目・番地・号（数字は半角数字） */}
          <label className="block text-sm mb-1">
            丁目・番地・号（数字は半角）
          </label>
          <input
            title="street"
            name="street"
            value={form.street}
            onChange={onChange}
            className="w-full p-2 border rounded mb-3"
          />

          {/* 建物名／会社名（任意） */}
          <label className="block text-sm mb-1">建物名／会社名（任意）</label>
          <input
            title="building"
            name="building"
            value={form.building}
            onChange={onChange}
            className="w-full p-2 border rounded mb-3"
          />

          {/* 部屋番号（任意） */}
          <label className="block text-sm mb-1">部屋番号（任意）</label>
          <input
            title="room"
            name="room"
            value={form.room}
            onChange={onChange}
            className="w-full p-2 border rounded mb-4"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">誕生日</label>
          <input
            title="birthday"
            name="birthday"
            type="date"
            value={form.birthday}
            onChange={onChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded"
        >
          登録
        </button>
      </form>
      <hr className="my-6" />
      <button
        onClick={() => signIn("google")}
        className="w-full bg-red-500 text-white px-4 py-2 rounded"
      >
        Googleで登録
      </button>
    </main>
  );
}
