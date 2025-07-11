import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import BackToTop from "@/components/common/backToTop";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ブシギア | 格闘用品専門店",
  description: "「ブシギア」は、高品質な日本製の格闘用品を中心に取り扱う専門ECサイトです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${notoSansJP.variable} antialiased`}
      >
        <Nav />
        {children}
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
