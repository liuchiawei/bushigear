import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

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

    const user = await prisma.user.update({
      where: { id: Number(session.user.id) },
      data: {
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
        id: true, email: true,
        lastName: true,
        firstName: true,
        postalCode: true, prefecture: true, city: true, street: true, building: true, room: true,
        address: true, gender: true, birthday: true,
      },
    });

    return NextResponse.json({ ok: true, user });
  } catch (e: any) {
    const msg = e?.message ?? "Internal Server Error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const me = await prisma.user.findUnique({
    where: { id: Number(session.user.id) },
    select: {
      id: true,
      email: true,
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
  return NextResponse.json({ user: me });
}