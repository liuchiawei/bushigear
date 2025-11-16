import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminCommentsList from "@/components/common/adminCommentsList";

export default async function MemberCommentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = Number(id);
  if (!userId) notFound();

  const [user, comments] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, lastName: true, firstName: true } }),
    prisma.comment.findMany({
      where: { userId },
      include: {
        product: { select: { id: true, name_jp: true, brand: true, image: true } },
        user: { select: { id: true, email: true, lastName: true, firstName: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!user) notFound();

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">会員のレビュー</h1>
          <p className="text-sm text-gray-600">
            ユーザー: {user.lastName ?? ""}{user.firstName ? ` ${user.firstName}` : ""} ({user.email})
          </p>
        </div>
        <Link href="/members" className="text-blue-600 hover:underline">← 会員一覧へ戻る</Link>
      </div>

      <AdminCommentsList initialComments={comments as any} showProductLink />
    </div>
  );
}
