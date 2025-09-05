import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import BackToTop from "@/components/common/backToTop";
import AiAssistant from "@/components/common/aiAssistant";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ブシギア | 格闘用品専門店",
    template: "%s | ブシギア",
  },
  description:
    "「ブシギア」は、高品質な日本製の格闘用品を中心に取り扱う専門ECサイトです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* Google Material Symbols */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className={`${notoSansJP.variable} antialiased`}>
        <Nav />
        {children}
        <Footer />
        <BackToTop />
        <AiAssistant />
      </body>
    </html>
  );
}
