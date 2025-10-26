"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PREFECTURES } from "@/constants/prefectures";

type UserRow = {
  id: number;
  email: string | null;
  lastName?: string | null;
  firstName?: string | null;
  gender: string | null;
  birthday: string | null;
  postalCode?: string | null;
  prefecture?: string | null;
  city?: string | null;
  street?: string | null;
  building?: string | null;
  room?: string | null;
  address?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export default function MembersDashboardPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setError("");
    try {
      const res = await fetch("/api/users", { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setUsers(data);
    } catch (e: any) {
      setError(e?.message ?? "読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm(`会員 #${id} を削除しますか？`)) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      await fetchUsers();
    } catch {
      alert("削除に失敗しました");
    }
  };

  if (loading) return <div className="p-8">読み込み中...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">会員管理ダッシュボード</h1>
        <div className="flex gap-2">
          <Link
            href="/dashboard"
            className="bg-slate-700 text-white px-4 py-2 rounded hover:opacity-90"
          >
            商品管理
          </Link>
          <Link
            href="/orders"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:opacity-90"
          >
            注文管理
          </Link>
          <Link
            href="/members"
            className="bg-emerald-600 text-white px-4 py-2 rounded hover:opacity-90"
          >
            会員管理
          </Link>
        </div>
      </div>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full min-w-[1100px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                メール
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                氏名
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                性別
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                誕生日
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                住所
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                更新日時
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((u) => {
              const address = u.address ?? buildFullAddress(u);
              const fullName = ((u.lastName ?? "") + (u.firstName ?? "")).trim();
              return (
                <tr key={u.id}>
                  <td className="px-4 py-3">{u.id}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{fullName || "-"}</td>
                  <td className="px-4 py-3">{labelGender(u.gender)}</td>
                  <td className="px-4 py-3">
                    {u.birthday
                      ? new Date(u.birthday).toLocaleDateString("ja-JP")
                      : "-"}
                  </td>
                  <td className="px-4 py-3">{address || "-"}</td>
                  <td className="px-4 py-3">
                    {u.updatedAt
                      ? new Date(u.updatedAt).toLocaleString("ja-JP")
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => setEditing(u)}
                      >
                        編集
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => onDelete(u.id)}
                      >
                        削除
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            会員がまだいません
          </div>
        )}
      </div>

      {editing && (
        <EditUserDialog
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await fetchUsers();
          }}
        />
      )}
    </div>
  );
}

function labelGender(g?: string | null) {
  if (g === "male") return "男性";
  if (g === "female") return "女性";
  if (g === "other") return "その他";
  return "-";
}
function buildFullAddress(u: Partial<UserRow>) {
  const pc = u.postalCode
    ? `〒${String(u.postalCode).slice(0, 3)}-${String(u.postalCode).slice(3)}`
    : "";
  const main = `${u.prefecture ?? ""}${u.city ?? ""}${u.street ?? ""}`.trim();
  const opt = [u.building, u.room].filter(Boolean).join(" ");
  return [pc, main, opt].filter(Boolean).join(" ");
}

function EditUserDialog({
  initial,
  onClose,
  onSaved,
}: {
  initial: UserRow;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}) {
  const [form, setForm] = useState({
    email: initial.email ?? "",
    lastName: initial.lastName ?? "",
    firstName: initial.firstName ?? "",
    gender: initial.gender ?? "",
    birthday: initial.birthday ? initial.birthday.substring(0, 10) : "",
    postalCode: initial.postalCode ?? "",
    prefecture: initial.prefecture ?? "",
    city: initial.city ?? "",
    street: initial.street ?? "",
    building: initial.building ?? "",
    room: initial.room ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const save = async () => {
    setErr("");
    if (!form.email.trim()) {
      setErr("メールは必須です");
      return;
    }
    if (!form.lastName.trim()) {
      setErr("姓を入力してください");
      return;
    }
    if (!form.firstName.trim()) {
      setErr("名を入力してください");
      return;
    }
    if (form.postalCode && !/^\d{3}-?\d{4}$/.test(form.postalCode)) {
      setErr("郵便番号は 123-4567 の形式（半角）で入力してください。");
      return;
    }
    if (/[０-９]/.test(form.street)) {
      setErr("丁目・番地・号の数字は半角で入力してください。");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/users/${initial.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      await onSaved();
    } catch (e: any) {
      setErr(e?.message ?? "更新に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">会員編集</h2>

        {err && <p className="text-red-600 mb-3">{err}</p>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">メール</label>
            <input
              title="email"
              name="email"
              value={form.email}
              onChange={onChange}
              className="w-full p-2 border rounded"
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
            >
              <option value="">未設定</option>
              <option value="male">男性</option>
              <option value="female">女性</option>
              <option value="other">その他</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">姓（漢字）</label>
            <input
              title="lastName"
              name="lastName"
              value={form.lastName}
              onChange={onChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">名（漢字）</label>
            <input
              title="firstName"
              name="firstName"
              value={form.firstName}
              onChange={onChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">誕生日</label>
            <input
              title="birthday"
              type="date"
              name="birthday"
              value={form.birthday}
              onChange={onChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="col-span-2 mt-2">
            <h3 className="font-semibold mb-2">住所</h3>
            <label className="block text-sm mb-1">郵便番号（半角）</label>
            <input
              name="postalCode"
              value={form.postalCode}
              onChange={onChange}
              placeholder="123-4567"
              className="w-full p-2 border rounded mb-2"
            />
            <label className="block text-sm mb-1">都道府県</label>
            <select
              title="prefecture"
              name="prefecture"
              value={form.prefecture}
              onChange={onChange}
              className="w-full p-2 border rounded mb-2"
            >
              <option value="">選択してください</option>
              {PREFECTURES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <label className="block text-sm mb-1">市区町村</label>
            <input
              title="city"
              name="city"
              value={form.city}
              onChange={onChange}
              className="w-full p-2 border rounded mb-2"
            />
            <label className="block text-sm mb-1">丁目・番地・号（半角）</label>
            <input
              title="street"
              name="street"
              value={form.street}
              onChange={onChange}
              className="w-full p-2 border rounded mb-2"
            />
            <label className="block text-sm mb-1">建物名／会社名（任意）</label>
            <input
              title="building"
              name="building"
              value={form.building}
              onChange={onChange}
              className="w-full p-2 border rounded mb-2"
            />
            <label className="block text-sm mb-1">部屋番号（任意）</label>
            <input
              title="room"
              name="room"
              value={form.room}
              onChange={onChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded border">
            キャンセル
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
          >
            {saving ? "保存中..." : "保存"}
          </button>
        </div>
      </div>
    </div>
  );
}
