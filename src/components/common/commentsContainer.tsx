"use client";

import { useMemo, useState } from "react";
import Comments from "./comments";
import CommentInput from "./commentInput";
import { Comment } from "@/lib/type";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";

type CommentsContainerProps = {
  initialComments: Comment[];
  productId: number;
  initialAverage?: number;
};

export default function CommentsContainer({
  initialComments,
  productId,
  initialAverage,
}: CommentsContainerProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const { data: session } = useSession();
  const currentUserId = session?.user?.id ? Number(session.user.id) : null;

  const { average, count } = useMemo(() => {
    if (comments.length === 0) {
      return { average: initialAverage ?? 0, count: 0 };
    }
    const total = comments.reduce((sum, c) => sum + c.score, 0);
    return { average: total / comments.length, count: comments.length };
  }, [comments, initialAverage]);

  return (
    <section id="reviews" className="mt-10 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">レビュー</h3>
          <p className="text-sm text-muted-foreground">
            平均 {average.toFixed(1)} / 5 （{count} 件）
          </p>
        </div>
      </div>

      <CommentInput
        productId={productId}
        onSubmitted={(newComment) => setComments((prev) => [newComment, ...prev])}
      />

      <Separator />

      <Comments
        comments={comments}
        currentUserId={currentUserId ?? undefined}
        onDelete={async (id) => {
          try {
            const res = await fetch("/api/comment", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id }),
            });
            if (!res.ok) return;
            setComments((prev) => prev.filter((c) => c.id !== id));
          } catch {
            // noop
          }
        }}
      />
    </section>
  );
}
