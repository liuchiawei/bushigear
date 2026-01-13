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
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Languages, LogIn, Heart } from "lucide-react";
import CartSheet from "@/components/common/CartSheet";
import SearchBar from "@/components/common/SearchBar";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useLocaleContext } from "@/components/providers/intl-provider";
import type { Locale } from "@/lib/i18n";

const LANGUAGES: { code: Locale; label: string; short: string }[] = [
  { code: "jp", label: "日本語", short: "JP" },
  { code: "en", label: "English", short: "EN" },
  { code: "zh_tw", label: "繁體中文", short: "TW" },
  { code: "zh_cn", label: "简体中文", short: "CN" },
];

function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const locale = useLocale() as Locale;
  const { setLocale } = useLocaleContext();
  const t = useTranslations("nav.tooltips");

  const handleSelect = (nextLocale: Locale) => {
    setLocale(nextLocale);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label={t("language")}
              className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium uppercase hover:bg-muted transition-colors"
            >
              <Languages className="size-4" />
              <span>{locale}</span>
            </button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("language")}</p>
        </TooltipContent>
      </Tooltip>
      <PopoverContent align="end" className="w-48 p-2">
        <div className="flex flex-col gap-1">
          {LANGUAGES.map((language) => (
            <Button
              key={language.code}
              variant={language.code === locale ? "default" : "ghost"}
              className="w-full justify-between"
              onClick={() => handleSelect(language.code)}
            >
              <span className="text-sm">{language.label}</span>
              <span className="text-xs text-muted-foreground">{language.short}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMouseNearTop, setIsMouseNearTop] = useState(false);
  const t = useTranslations("nav.tooltips");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 當滑鼠在視窗上方 100px 以內時顯示導覽列
      setIsMouseNearTop(e.clientY <= 100);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <NavigationMenu
      viewport={false}
      className={`fixed top-0 left-0 right-0 w-full px-4 py-2 z-20 bg-white/40 backdrop-blur-sm shadow-sm transition-all duration-300
      ${
        isScrolled || isMouseNearTop
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-full"
      }`}
    >
      <SidebarTrigger />
      <Link
        href="/"
        className="absolute left-1/2 -translate-x-1/2 w-24 md:w-36"
      >
        <Image
          src="/logo/logo_text.svg"
          alt="logo"
          width={200}
          height={200}
          objectFit="cover"
        />
      </Link>
      <NavigationMenuList className="gap-4">
        <NavigationMenuItem>
          <SearchBar />
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/login">
                <LogIn className="size-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("login")}</p>
            </TooltipContent>
          </Tooltip>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/mypage?tab=likes">
                <Heart className="size-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("favorites")}</p>
            </TooltipContent>
          </Tooltip>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <CartSheet />
        </NavigationMenuItem>
        <NavigationMenuItem>
          <LanguageSwitcher />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
