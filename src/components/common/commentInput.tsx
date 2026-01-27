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
import { useLocale } from "next-intl";
import {
  type Locale,
  createTranslationGetter,
  getTranslation,
} from "@/lib/i18n";
import content from "@/data/content.json";

type CommentInputProps = {
  productId: number;
  onSubmitted: (comment: Comment) => void;
};

export default function CommentInput({
  productId,
  onSubmitted,
}: CommentInputProps) {
  const { data: session, status } = useSession();
  const locale = useLocale() as Locale;
  const copy = content.products_detail.comments;
  const baseT = createTranslationGetter(copy, locale);
  const t = <K extends keyof typeof copy>(
    key: K,
    vars?: Record<string, string | number>
  ) => {
    const text = baseT(key);
    if (!vars) return text;
    return Object.keys(vars).reduce(
      (acc, k) => acc.replace(`{${k}}`, String(vars[k])),
      text
    );
  };
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedTone, setSelectedTone] = useState<
    "friendly" | "neutral" | "negative"
  >("friendly");
  const [hasUsedAi, setHasUsedAi] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      setError(getTranslation(copy.placeholder, locale));
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
        setError(data?.message || getTranslation(copy.noPurchase, locale));
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data?.message || getTranslation(copy.postFailed, locale)
        );
      }

      const data = await res.json();
      if (data?.comment) {
        onSubmitted(data.comment);
        setComment("");
        setScore(5);
        setHasUsedAi(false);
      }
    } catch (e: any) {
      setError(e?.message || getTranslation(copy.postFailed, locale));
    } finally {
      setLoading(false);
    }
  };

  const handleAiPolish = async () => {
    if (!comment.trim()) {
      setError(getTranslation(copy.aiNeedText, locale));
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
          tone: selectedTone,
          locale:
            locale === "jp"
              ? "ja-JP"
              : locale === "zh_tw"
              ? "zh-TW"
              : locale === "zh_cn"
              ? "zh-CN"
              : "en-US",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || getTranslation(copy.aiFailed, locale));
      }

      const data = await res.json();
      if (data?.revision) {
        setComment(data.revision);
        setHasUsedAi(true);
      }
    } catch (e: any) {
      setError(e?.message || getTranslation(copy.aiFailed, locale));
    } finally {
      setAiLoading(false);
    }
  };

  if (status === "unauthenticated") {
    return (
      <div className="rounded-lg border bg-white/50 backdrop-blur-sm p-4">
        <p className="text-sm text-muted-foreground mb-3">
          {getTranslation(copy.loginPrompt, locale)}
        </p>
        <Button asChild>
          <Link href={`/login?redirect=/products/${productId}`}>
            {getTranslation(copy.loginButton, locale)}
          </Link>
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
          {t("ratingLabel")}
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
                <p>{t("scoreHint", { score: n })}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <label htmlFor="comment" className="text-sm">
          {t("commentLabel")}
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t("placeholder")}
          rows={3}
          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <div
          className={cn(
            "relative group",
            (aiLoading || loading || hasUsedAi) && "cursor-not-allowed"
          )}
        >
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="secondary"
                onClick={handleAiPolish}
                disabled={aiLoading || loading || hasUsedAi}
                className={cn(
                  "w-16 shrink-0",
                  (aiLoading || loading || hasUsedAi) && "!cursor-not-allowed"
                )}
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
            <TooltipContent side="bottom">
              <p>{t("aiTooltip")}</p>
            </TooltipContent>
          </Tooltip>

          {/* 语气选择器 - hover时显示（仅在按钮可用时） */}
          {!hasUsedAi && !aiLoading && !loading && (
            <div className="absolute right-full bottom-0 mr-2 w-40 bg-white border rounded-md shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground border-b">
                {t("toneTitle")}
              </div>
              <button
                type="button"
                onClick={() => setSelectedTone("friendly")}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors",
                  selectedTone === "friendly" && "bg-accent/50"
                )}
              >
                <div className="font-medium">
                  {getTranslation(copy.tones.friendly, locale)}
                </div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedTone("neutral")}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors",
                  selectedTone === "neutral" && "bg-accent/50"
                )}
              >
                <div className="font-medium">
                  {getTranslation(copy.tones.neutral, locale)}
                </div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedTone("negative")}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors",
                  selectedTone === "negative" && "bg-accent/50"
                )}
              >
                <div className="font-medium">
                  {getTranslation(copy.tones.negative, locale)}
                </div>
              </button>
            </div>
          )}
        </div>
        <Button
          onClick={handleSubmit}
          disabled={loading || aiLoading}
          className="flex-1"
        >
          {loading ? (
            <>
              <Spinner size="sm" variant="white" /> {t("submitting")}
            </>
          ) : (
            <>
              <MessageSquare className="size-4 mr-1" /> {t("submit")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
