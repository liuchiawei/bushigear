import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const toNull = (v: unknown) => {
    if (typeof v !== "string") return v ?? null;
    const t = v.trim();
    return t === "" ? null : t;
};
const toHalfWidthDigits = (s: string) =>
    s.replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xfee0));
const normalizePostal = (raw?: string | null) => {
    if (!raw) return null;
    const half = toHalfWidthDigits(raw).replace(/[^0-9]/g, "");
    return half.length === 7 ? half : null;
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
        const password = typeof body.password === "string" ? body.password : "";
        const gender = toNull(body.gender) as string | null;
        const birthdayStr = body.birthday as string | undefined;

        const lastName = toNull(body.lastName) as string | null;
        const firstName = toNull(body.firstName) as string | null;

        const postalCode = normalizePostal(toNull(body.postalCode) as string | null);
        const prefecture = toNull(body.prefecture) as string | null;
        const city = toNull(body.city) as string | null;
        const street = toNull(body.street) as string | null;
        const building = toNull(body.building) as string | null;
        const room = toNull(body.room) as string | null;

        if (!email || !password) {
            return NextResponse.json({ message: "Emailとパスワードは必須です" }, { status: 400 });
        }
        if (body.postalCode && !postalCode) {
            return NextResponse.json({ message: "郵便番号は 123-4567 / 1234567 の形式（半角）で入力してください" }, { status: 400 });
        }
        let birthday: Date | null = null;
        if (birthdayStr) {
            const d = new Date(birthdayStr);
            if (isNaN(d.getTime())) {
                return NextResponse.json({ message: "誕生日の形式が不正です" }, { status: 400 });
            }
            birthday = d;
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json(
                { message: "このメールアドレスは既に登録されています" },
                { status: 400 },
            );
        }

        const hashed = await bcrypt.hash(password, 10);

        const fullAddressParts = [
            postalCode ? `〒${postalCode.slice(0, 3)}-${postalCode.slice(3)}` : null,
            `${prefecture ?? ""}${city ?? ""}${street ?? ""}`.trim() || null,
            [building ?? "", room ?? ""].filter(Boolean).join(" ") || null,
        ].filter(Boolean);
        const fullAddress = fullAddressParts.join(" ");

        await prisma.user.create({
            data: {
                email,
                password: hashed,
                gender,
                birthday,
                lastName,
                firstName,
                postalCode,
                prefecture,
                city,
                street,
                building,
                room,
                address: fullAddress || null,
            },
        });

        return NextResponse.json({ message: "ユーザー登録が完了しました" }, { status: 201 });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ message: "サーバーエラーが発生しました" }, { status: 500 });
    }
}
