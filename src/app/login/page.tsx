"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const {data: session, status} = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (status === "loading") {
    return <div className="p-8">読み込み中...</div>;
  }

  if (session) {
    return (
      <main className="p-8 max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">ログイン済み</h1>
        <p className="mb-4">ようこそ、{session.user?.email}</p>
        <button
          onClick={() => signOut()}
          className="w-full bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          ログアウト
        </button>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.error) {
      setError("ログインに失敗しました");
    } else {
      router.push("/");
    }
  };

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">ログイン</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            title="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            title="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          ログイン
        </button>
      </form>
      <hr className="my-6" />
      <button
        onClick={() => signIn("google")}
        className="w-full bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        Googleでログイン
      </button>
      <p className="mt-4 text-center">
        新規登録は{" "}
        <a href="/register" className="text-blue-600 underline cursor-pointer">
          こちら
        </a>
      </p>
    </main>
  );
}
