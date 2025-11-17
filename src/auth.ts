import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true, // NextAuth.js 5.0 需要此配置
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const emailRaw = typeof creds?.email === "string" ? creds.email.trim() : "";
        const password = typeof creds?.password === "string" ? creds.password : "";
        if (!emailRaw || !password) return null;

        const email = emailRaw.toLowerCase();

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        return { id: String(user.id), email: user.email, name: user.name || user.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    // PrismaAdapter 會自動處理以下邏輯：
    // 1. 檢查 Account 是否存在（通過 provider + providerAccountId）
    // 2. 如果 Account 存在，找到對應的 User
    // 3. 如果 Account 不存在：
    //    - 檢查 User 是否存在（通過 email）
    //    - 如果 User 存在，創建 Account 並連結到現有的 User
    //    - 如果 User 不存在，創建新的 User 和 Account
    // 所以不需要手動處理 User 和 Account 的連結
    async jwt({ token, user, account }) {
      // 當用戶首次登入時，將用戶資訊添加到 token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user && token?.sub) {
        (session.user as any).id = token.sub;

        // Fetch user image from database
        const user = await prisma.user.findUnique({
          where: { id: Number(token.sub) },
          select: { image: true, name: true },
        });

        if (user?.image) {
          session.user.image = user.image;
        }
        if (user?.name) {
          session.user.name = user.name;
        }
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET!,
});
