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
import Image from "next/image";

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  // 0px以上スクロールしたらナビゲーションを表示
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
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
      className={`fixed top-0 left-0 right-0 w-full px-4 py-2 z-20 bg-white/40 backdrop-blur-sm shadow-sm transition-all duration-300
    ${
      isScrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
    }`}
    >
      <SidebarTrigger />
      <Link
        href="/"
        className="absolute left-1/2 -translate-x-1/2 w-24 md:w-36"
      >
        <Image src="/logo/logo_text.svg" alt="logo" width={200} height={200} objectFit="cover"/>
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
                <Link href="/login">
                  <LogIn className="size-4" />
                </Link>
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
