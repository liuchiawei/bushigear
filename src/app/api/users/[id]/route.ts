import prisma from "@/lib/prisma";

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

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true, email: true, lastName: true,
        firstName: true, gender: true, birthday: true,
        postalCode: true, prefecture: true, city: true, street: true, building: true, room: true,
        address: true, createdAt: true, updatedAt: true,
      },
    });
    if (!user) return new Response("Not found", { status: 404 });
    return Response.json(user);
  } catch (e: any) {
    return new Response(`Internal Server Error: ${e?.message ?? e}`, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : undefined;
    const gender = toNull(body.gender) as string | null | undefined;
    const bd = body.birthday ? new Date(body.birthday) : undefined;
    if (bd && isNaN(bd.getTime())) return new Response("Invalid birthday", { status: 400 });

    const lastName = toNull(body.lastName) as string | null | undefined;
    const firstName = toNull(body.firstName) as string | null | undefined;

    const postalCode = normalizePostal(toNull(body.postalCode) as string | null);
    const prefecture = toNull(body.prefecture) as string | null;
    const city = toNull(body.city) as string | null;
    const street = toNull(body.street) as string | null;
    const building = toNull(body.building) as string | null;
    const room = toNull(body.room) as string | null;

    const fullAddressParts = [
      postalCode ? `〒${postalCode.slice(0,3)}-${postalCode.slice(3)}` : null,
      `${prefecture ?? ""}${city ?? ""}${street ?? ""}`.trim() || null,
      [building ?? "", room ?? ""].filter(Boolean).join(" ") || null,
    ].filter(Boolean);
    const fullAddress = fullAddressParts.join(" ");

    const updated = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        email,
        gender,
        birthday: bd ?? undefined,
        lastName,
        firstName,
        postalCode, prefecture, city, street, building, room,
        address: fullAddress || null,
      },
      select: {
        id: true, email: true, lastName: true,
        firstName: true, gender: true, birthday: true,
        postalCode: true, prefecture: true, city: true, street: true, building: true, room: true,
        address: true, updatedAt: true,
      },
    });

    return Response.json(updated);
  } catch (e: any) {
    const msg = e?.message ?? e;
    const code = String(msg).includes("Unique") ? 409 : 500;
    return new Response(`Error: ${msg}`, { status: code });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = Number(id);

    await prisma.user.delete({ where: { id: userId } });

    return Response.json({ ok: true, deletedId: userId });
  } catch (e: any) {
    const msg = e?.message ?? e;
    const code = String(msg).includes("not found") ? 404 : 500;
    return new Response(`Error: ${msg}`, { status: code });
  }
}
