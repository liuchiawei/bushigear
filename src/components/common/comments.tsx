"use client";

import { Comment } from "@/lib/type";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { Circle } from "lucide-react";

// スコアを0~5の範囲で小数点第一位までに正規化する
const renderStars = (score: number): number => {
  const clamped = Math.max(0, Math.min(5, score));
  return Math.round(clamped * 10) / 10;
};

// 正規化されたスコアを円形アイコンで表示する
const renderStarDisplay = (normalizedScore: number) => {
  const fullCircles = Math.floor(normalizedScore);
  const hasHalfCircle = normalizedScore % 1 >= 0.5;
  const emptyCircles = 5 - fullCircles - (hasHalfCircle ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: fullCircles }).map((_, i) => (
        <Circle
          key={`full-${i}`}
          className="size-4 fill-yellow-500 text-yellow-500"
        />
      ))}
      {hasHalfCircle && (
        <Circle className="size-4 fill-yellow-500/50 text-yellow-500" />
      )}
      {Array.from({ length: emptyCircles }).map((_, i) => (
        <Circle key={`empty-${i}`} className="size-4 text-yellow-500/30" />
      ))}
    </div>
  );
};

type CommentsProps = {
  comments: Comment[];
  currentUserId?: number;
  onDelete?: (id: number) => void | Promise<void>;
};

export default function Comments({
  comments,
  currentUserId,
  onDelete,
}: CommentsProps) {
  if (!comments.length) {
    return (
      <p className="text-sm text-muted-foreground">
        まだレビューがありません。
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((c) => (
        <div
          key={c.id}
          className="rounded-lg border bg-white/60 backdrop-blur-sm p-4 shadow-sm"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AvatarLinkable
                href={c.userId === currentUserId ? "/mypage" : undefined}
                image={c.user?.image}
                alt={c.user?.email ?? "avatar"}
                fallback={(
                  c.user?.firstName?.[0] ||
                  c.user?.lastName?.[0] ||
                  c.user?.email?.[0] ||
                  "U"
                ).toUpperCase()}
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {(c.user?.lastName || "") +
                    (c.user?.firstName ? ` ${c.user.firstName}` : "") ||
                    c.user?.email ||
                    "ゲスト"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(c.createdAt).toLocaleDateString("ja-JP")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {renderStarDisplay(renderStars(c.score))}
              </div>
              {c.userId === currentUserId && onDelete && (
                <button
                  className="text-xs text-red-500 hover:underline"
                  onClick={async () => {
                    await onDelete(c.id);
                  }}
                >
                  削除
                </button>
              )}
            </div>
          </div>
          <Separator className="my-3" />
          <p className="text-sm whitespace-pre-line">{c.comment}</p>
        </div>
      ))}
    </div>
  );
}

function AvatarLinkable({
  href,
  image,
  alt,
  fallback,
}: {
  href?: string;
  image?: string | null;
  alt: string;
  fallback: string;
}) {
  const avatar = image ? (
    <Image
      src={image}
      alt={alt}
      width={32}
      height={32}
      className="rounded-full"
    />
  ) : (
    <div className="size-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
      {fallback}
    </div>
  );

  if (!href) return avatar;
  return (
    <Link href={href} className="inline-flex">
      {avatar}
    </Link>
  );
}
