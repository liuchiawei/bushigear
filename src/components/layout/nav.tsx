"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, Languages, LogIn, Heart } from "lucide-react";
import content from "@/data/content.json";

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);

  // ホームページの場合、400px以上スクロールしたらナビゲーションを表示
  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);

    // スクロールイベントのリスナーを削除
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHome]);

  return (
    <NavigationMenu viewport={false}
      className={`fixed top-0 left-0 right-0 w-full px-4 py-2 z-50 transition-all duration-300
    ${
      isHome 
      ? isScrolled ? "opacity-100 translate-y-0" // ホームページの場合、400px以上スクロールしたらナビゲーションを表示
      : "opacity-0 -translate-y-full" // ホームページの場合、400px未満スクロールしたらナビゲーションを非表示
      : "opacity-100 translate-y-0" // ホームページでない場合はナビゲーションを表示
    }`}
    >
      <NavigationMenuLink asChild>
        <Link href="/" className="w-24 text-2xl font-bold text-center">
          LOGO
        </Link>
      </NavigationMenuLink>
      {/* TODO: ナビゲーションのリンク先を<Link> を使用して設定 */}
      <NavigationMenuList className="w-full gap-4">
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/">HOME</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Link href="/products">商品を探す</Link>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            {content.nav.categories.map((category) => (
              <NavigationMenuLink asChild key={category.id}>
                <Link href={`/products/${category.slug}`}>{category.name.jp}</Link>
              </NavigationMenuLink>
            ))}
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/guide">ご利用ガイド</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <a href="#">送料ガイド</a>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <a href="#">ABOUT</a>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <a href="#">お問い合わせ</a>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuList className="gap-4">
        <NavigationMenuItem>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a title="検索" href="#">
                  <Search className="size-4" />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>検索</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a href="#">
                  <LogIn className="size-4" />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>会員登録 | ログイン</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a href="#">
                  <Heart className="size-4" />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>お気に入り</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a href="#">
                  <Languages className="size-4" />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>言語切り替え</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
