"use client";

import { useState } from "react";
import { Comment } from "@/lib/type";

type Props = {
  initialComments: Comment[];
  showProductLink?: boolean;
  force?: boolean;
};

export default function AdminCommentsList({ initialComments, showProductLink = false, force = true }: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const startEdit = (c: Comment) => {
    setEditingId(c.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("このレビューを削除しますか？")) return;
    setError("");
    try {
      const res = await fetch("/api/comment", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, force }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "削除に失敗しました");
      }
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (e: any) {
      setError(e.message || "削除に失敗しました");
    }
  };

  const handleSave = async (id: number, score: number, comment: string) => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/comment", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, score, comment, force }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "更新に失敗しました");
      }
      const data = await res.json();
      if (data?.comment) {
        setComments((prev) => prev.map((c) => (c.id === id ? { ...c, ...data.comment } : c)));
        setEditingId(null);
      }
    } catch (e: any) {
      setError(e.message || "更新に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {comments.map((c) => (
        <AdminCommentRow
          key={c.id}
          comment={c}
          editing={editingId === c.id}
          onEdit={() => startEdit(c)}
          onCancel={() => setEditingId(null)}
          onDelete={() => handleDelete(c.id)}
          onSave={(score, comment) => handleSave(c.id, score, comment)}
          showProductLink={showProductLink}
        />
      ))}
      {comments.length === 0 && <p className="text-gray-600">レビューがありません。</p>}
    </div>
  );
}

function AdminCommentRow({
  comment,
  editing,
  onEdit,
  onCancel,
  onDelete,
  onSave,
  showProductLink,
}: {
  comment: Comment;
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onSave: (score: number, comment: string) => void;
  showProductLink?: boolean;
}) {
  const [draftScore, setDraftScore] = useState(comment.score);
  const [draftComment, setDraftComment] = useState(comment.comment);

  return (
    <div className="border rounded-lg p-4 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold">
            {(comment.user?.lastName ?? "") + (comment.user?.firstName ? ` ${comment.user.firstName}` : "") || comment.user?.email || "ユーザー"}
          </div>
          <div className="text-sm text-gray-500">
            {new Date(comment.createdAt).toLocaleDateString("ja-JP")}
          </div>
          {showProductLink && comment.product && (
            <a href={`/products/${comment.product.id}`} className="text-sm text-blue-600 hover:underline">
              {comment.product.name_jp}
            </a>
          )}
        </div>
        <div className="text-sm text-yellow-500">
          {"★".repeat(Math.round(comment.score)).padEnd(5, "☆")}
        </div>
      </div>

      {editing ? (
        <>
          <div className="flex items-center gap-2">
            <label className="text-sm">評価</label>
            <select
              title="評価"
              value={draftScore}
              onChange={(e) => setDraftScore(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <textarea
            title="コメント"
            className="w-full border rounded px-3 py-2 text-sm"
            rows={3}
            value={draftComment}
            onChange={(e) => setDraftComment(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
              onClick={() => onSave(draftScore, draftComment)}
            >
              保存
            </button>
            <button className="px-3 py-1 rounded border text-sm" onClick={onCancel}>
              キャンセル
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm whitespace-pre-line">{comment.comment}</p>
          <div className="flex gap-3 text-sm">
            <button className="text-blue-600 hover:underline" onClick={onEdit}>
              編集
            </button>
            <button className="text-red-600 hover:underline" onClick={onDelete}>
              削除
            </button>
          </div>
        </>
      )}
    </div>
  );
}
