"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Spinner } from "@/components/ui/spinner";
import { MessageSquare, Sparkles } from "lucide-react";
import { Comment } from "@/lib/type";
import { cn } from "@/lib/utils";

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
  const [aiLoading, setAiLoading] = useState(false);

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

  const handleAiPolish = async () => {
    if (!comment.trim()) {
      setError("AI リライトの前にコメントを入力してください。");
      return;
    }
    setAiLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: comment,
          tone: "friendly",
          locale: "ja-JP",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "AI リライトに失敗しました。");
      }

      const data = await res.json();
      if (data?.revision) {
        setComment(data.revision);
      }
    } catch (e: any) {
      setError(e?.message || "AI リライトに失敗しました。");
    } finally {
      setAiLoading(false);
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
      <div className="flex flex-col gap-2">
        <label htmlFor="score" className="text-sm">
          評価
        </label>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((n) => (
            <Tooltip key={n}>
              <TooltipTrigger asChild>
                <Button
                  key={n}
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setScore(n)}
                  className={cn(
                    "group bg-transparent text-xs transition-all duration-200 hover:scale-105 active:scale-95 rounded-full border-none size-8",
                    score >= n ? "" : "text-gray-700 hover:text-accent"
                  )}
                >
                  <div
                    className={cn(
                      "size-4 transition-all duration-200 rounded-full",
                      score === n
                        ? "group-hover:bg-background group-hover:border-accent group-active:bg-accent/60 hover:scale-110 active:scale-95"
                        : "",
                      score >= n
                        ? "bg-accent text-accent group-hover:bg-background group-hover:border-accent group-active:bg-accent/60 hover:scale-105 active:scale-95"
                        : "bg-gray-400 text-gray-400"
                    )}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{n}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
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
      <div className="flex gap-2">
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={handleAiPolish}
              disabled={aiLoading || loading}
              className="w-16 shrink-0"
            >
              {aiLoading ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <Sparkles className="size-4" />
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>AI がコメントを自然な日本語に整えます</p>
          </TooltipContent>
        </Tooltip>
        <Button onClick={handleSubmit} disabled={loading || aiLoading} className="flex-1">
          {loading ? (
            <>
              <Spinner size="sm" variant="white" /> 投稿中...
            </>
          ) : (
            <>
              <MessageSquare className="size-4 mr-1" /> レビューを投稿
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
