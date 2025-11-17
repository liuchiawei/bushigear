"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Comment } from "@/lib/type";

type CommentInputProps = {
  productId: number;
  onSubmitted: (comment: Comment) => void;
};

export default function CommentInput({
  productId,
  onSubmitted,
}: CommentInputProps) {
  const { data: session, status } = useSession();
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      setError("コメントを入力してください");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, score, comment }),
      });

      if (res.status === 403) {
        const data = await res.json().catch(() => ({}));
        setError(data?.message || "購入履歴がありません");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "投稿に失敗しました");
      }

      const data = await res.json();
      if (data?.comment) {
        onSubmitted(data.comment);
        setComment("");
        setScore(5);
      }
    } catch (e: any) {
      setError(e?.message || "投稿に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  if (status === "unauthenticated") {
    return (
      <div className="rounded-lg border bg-white/50 backdrop-blur-sm p-4">
        <p className="text-sm text-muted-foreground mb-3">
          レビューを投稿するにはログインしてください。
        </p>
        <Button asChild>
          <Link href={`/login?redirect=/products/${productId}`}>ログイン</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white/50 backdrop-blur-sm p-4 space-y-3">
      {/* 現在のユーザー情報を表示 */}
      {session?.user && (
        <div className="flex items-center gap-2 pb-2 border-b">
          <div className="size-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
            {session.user.name?.[0]?.toUpperCase() ||
              session.user.email?.[0]?.toUpperCase() ||
              "U"}
          </div>
          <span className="text-sm text-muted-foreground">
            {session.user.name || session.user.email} としてレビューを投稿します
          </span>
        </div>
      )}
      <div className="flex items-center gap-3">
        <label htmlFor="score" className="text-sm">
          評価
        </label>
        <select
          id="score"
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="border rounded-md px-3 py-2 text-sm"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span className="text-sm text-yellow-500">★ {score}</span>
      </div>
      <div className="space-y-1">
        <label htmlFor="comment" className="text-sm">
          コメント
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="商品の感想やおすすめポイントを書いてください"
          rows={3}
          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "投稿中..." : "レビューを投稿"}
      </Button>
    </div>
  );
}
