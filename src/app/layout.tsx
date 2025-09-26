import type { Metadata } from "next";
import {
  Noto_Sans_JP,
  Roboto,
  Roboto_Condensed,
  Yuji_Syuku,
} from "next/font/google";
import "./globals.css";
import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import BackToTop from "@/components/common/backToTop";
import AiAssistant from "@/components/common/aiAssistant";
import { CartProvider } from "@/contexts/CartContext";
import AppSidebar from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
});

const yujiSyuku = Yuji_Syuku({
  variable: "--font-yuji-syuku",
  subsets: ["latin"],
  weight: "400",
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
      <body
        className={`${notoSansJP.variable} ${roboto.variable} ${robotoCondensed.variable} ${yujiSyuku.variable} bg-background bg-dot-32-s-2-neutral-400 antialiased`}
      >
        <CartProvider>
          <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <Nav />
            <main>{children}</main>
            <Footer />
            <BackToTop />
            <AiAssistant />
          </SidebarProvider>
        </CartProvider>
      </body>
    </html>
  );
}
