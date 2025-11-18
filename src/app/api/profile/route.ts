import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidateTag, unstable_cache } from "next/cache";
import { CACHE_TAGS, CACHE_TTL } from "@/lib/cache";

const buildFullAddress = (
  p?: string,
  pref?: string,
  city?: string,
  street?: string,
  bld?: string,
  room?: string
) => {
  const pc = p ? `〒${String(p).replace(/-/g, "")}` : "";
  const main = `${pref ?? ""}${city ?? ""}${street ?? ""}`.trim();
  const opt = [bld, room].filter(Boolean).join(" ");
  return [pc, main, opt].filter(Boolean).join(" ");
};

const toNullIfBlank = (v: unknown) => {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
};

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const image = toNullIfBlank(body.image) as string | null;
    const lastName = toNullIfBlank(body.lastName) as string | null;
    const firstName = toNullIfBlank(body.firstName) as string | null;
    const postalCode = toNullIfBlank(body.postalCode) as string | null;
    const prefecture = toNullIfBlank(body.prefecture) as string | null;
    const city       = toNullIfBlank(body.city) as string | null;
    const street     = toNullIfBlank(body.street) as string | null;
    const building   = toNullIfBlank(body.building) as string | null;
    const room       = toNullIfBlank(body.room) as string | null;

    const genderRaw  = toNullIfBlank(body.gender) as string | null;
    const birthdayRaw = toNullIfBlank(body.birthday) as string | null;

    if (postalCode && !/^\d{3}-?\d{4}$/.test(postalCode)) {
      return NextResponse.json({ message: "郵便番号は 123-4567 の形式（半角）で入力してください。" }, { status: 400 });
    }

    if (street && /[０-９]/.test(street)) {
      return NextResponse.json({ message: "丁目・番地・号の数字は半角で入力してください。" }, { status: 400 });
    }

    let birthday: Date | null | undefined = undefined;
    if (birthdayRaw === null) {
      birthday = null;
    } else if (typeof birthdayRaw === "string" && birthdayRaw) {
      birthday = new Date(birthdayRaw);
      if (isNaN(birthday.getTime())) {
        return NextResponse.json({ message: "誕生日の形式が正しくありません。" }, { status: 400 });
      }
    }

    const fullAddress = buildFullAddress(postalCode ?? undefined, prefecture ?? undefined, city ?? undefined, street ?? undefined, building ?? undefined, room ?? undefined);

    const userId = Number(session.user.id);
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        image: image ?? undefined,
        lastName,
        firstName,
        postalCode,
        prefecture,
        city,
        street,
        building,
        room,
        address: fullAddress,
        gender: genderRaw ?? undefined,
        birthday,
      },
      select: {
        id: true, email: true, image: true,
        lastName: true,
        firstName: true,
        postalCode: true, prefecture: true, city: true, street: true, building: true, room: true,
        address: true, gender: true, birthday: true,
      },
    });

    // ユーザー情報のキャッシュを無効化
    revalidateTag(CACHE_TAGS.USER(userId));

    return NextResponse.json({ ok: true, user });
  } catch (e: any) {
    const msg = e?.message ?? "Internal Server Error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}

async function getUserProfileData(userId: number, sessionUser: any) {
  // Session から基本情報を取得（既に最適化済み）
  // 詳細なプロフィール情報のみ DB から取得
  const me = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      image: true,
      lastName: true,
      firstName: true,
      postalCode: true,
      prefecture: true,
      city: true,
      street: true,
      building: true,
      room: true,
      address: true,
      gender: true,
      birthday: true,
    },
  });
  
  // Session の情報と DB の情報をマージ（Session が最新の場合）
  return me ? {
    ...me,
    // Session の image と name が最新の場合は優先
    image: sessionUser.image || me.image,
    name: sessionUser.name || (me.firstName && me.lastName ? `${me.lastName} ${me.firstName}` : me.email),
  } : null;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  
  const userId = Number(session.user.id);
  
  // キャッシュされた関数を作成
  const cachedGetUserProfile = unstable_cache(
    () => getUserProfileData(userId, session.user),
    [`profile-${userId}`],
    {
      revalidate: CACHE_TTL.MEDIUM, // 300秒
      tags: [CACHE_TAGS.USER(userId)],
    }
  );
  
  const user = await cachedGetUserProfile();
  
  // キャッシュヘッダーを設定
  const headers = new Headers();
  headers.set("Cache-Control", "private, s-maxage=60, stale-while-revalidate=120");
  
  return NextResponse.json({ user }, { headers });
}