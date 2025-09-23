"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search, Languages, LogIn, Heart } from "lucide-react";
import CartSheet from "@/components/common/CartSheet";

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);

  // 240px以上スクロールしたらナビゲーションを表示
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 240);
    };

    window.addEventListener("scroll", handleScroll);

    // スクロールイベントのリスナーを削除
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <NavigationMenu
      viewport={false}
      className={`fixed top-0 left-0 right-0 w-full px-4 py-2 z-10 bg-white/40 backdrop-blur-sm shadow-sm transition-all duration-300
    ${
      isScrolled
        ? "opacity-100 translate-y-0" // ホームページの場合、240px以上スクロールしたらナビゲーションを表示
        : "opacity-0 -translate-y-full" // ホームページの場合、240px未満スクロールしたらナビゲーションを非表示
    }`}
    >
      <SidebarTrigger />
      <Link
        href="/"
        className="absolute left-1/2 -translate-x-1/2 w-24 text-xl font-bold text-center"
      >
        ブシギア
      </Link>
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
          <CartSheet />
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
