"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  if (status === "loading") {
    return (
      <main className="p-8 max-w-md mx-auto">
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="mt-6 flex items-center justify-center gap-2">
          <Spinner size="sm" />
          <span className="text-sm text-muted-foreground">読み込み中...</span>
        </div>
      </main>
    );
  }

  if (session) {
    return (
      <main className="p-8 max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">ログイン済み</h1>
        <p className="mb-4">ようこそ、{session.user?.email}</p>
        <Button
          onClick={() => signOut()}
          variant="destructive"
          className="w-full"
        >
          ログアウト
        </Button>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(
          "ログインに失敗しました。メールアドレスとパスワードを確認してください。"
        );
      } else {
        router.push("/");
      }
    } catch {
      setError("予期しないエラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await signIn("google");
    } catch {
      setError("Googleログインに失敗しました。もう一度お試しください。");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full py-16 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-6">ログイン</h1>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full space-y-4 border bg-card rounded-xl p-4"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            title="email"
            type="email"
            value={email}
            className="border-border rounded-md"
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || googleLoading}
            required
          />
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <label className="block text-sm font-medium mb-1">Password</label>
          <Input
            title="password"
            type="password"
            value={password}
            className="border-border rounded-md"
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || googleLoading}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={loading || googleLoading}
        >
          {loading ? (
            <>
              <Spinner size="sm" variant="white" />
              ログイン中...
            </>
          ) : (
            "ログイン"
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
        disabled={loading || googleLoading}
      >
        {googleLoading ? (
          <>
            <Spinner size="sm" />
            Googleでログイン中...
          </>
        ) : (
          "Googleでログイン"
        )}
      </Button>

      <p className="mt-6 text-center text-sm">
        新規登録は{" "}
        <a
          href="/register"
          className="text-primary underline hover:no-underline"
        >
          こちら
        </a>
      </p>
    </div>
  );
}
