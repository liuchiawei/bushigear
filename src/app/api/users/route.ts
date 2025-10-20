import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "desc" },
      select: {
        id: true,
        email: true,
        gender: true,
        birthday: true,
        postalCode: true, prefecture: true, city: true, street: true, building: true, room: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return Response.json(users);
  } catch (e: any) {
    return new Response(`Internal Server Error: ${e?.message ?? e}`, { status: 500 });
  }
}
