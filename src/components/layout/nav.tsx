"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Search, Languages } from "lucide-react";

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
    <nav
      className={`w-full p-3 fixed top-0 left-0 z-50 flex justify-between items-center transition-all duration-300
    ${
      isHome && isScrolled
        ? "opacity-100 translate-y-0"
        : "opacity-0 -translate-y-full"
    }`}
    >
      <div className="w-24">
        <Link href="/" className="text-2xl font-bold text-center">
          LOGO
        </Link>
      </div>
      <ul className="flex items-center gap-4">
        <li>
          <a href="#">HOME</a>
        </li>
        <li>
          <a href="#">商品を探す</a>
        </li>
        <li>
          <a href="#">ご利用ガイド</a>
        </li>
        <li>
          <a href="#">送料ガイド</a>
        </li>
        <li>
          <a href="#">ABOUT</a>
        </li>
        <li>
          <a href="#">お問い合わせ</a>
        </li>
      </ul>
      <ul className="flex items-center gap-4">
        <li>
          <a title="検索" href="#">
            <Search className="size-4" />
          </a>
        </li>
        <li>
          <a href="#">
            {" "}
            <span className="material-symbols-outlined align-middle mr-1 text-sm">
              person
            </span>
            会員登録
          </a>
        </li>
        <li>
          <a href="#">
            {" "}
            <span className="material-symbols-outlined align-middle mr-1 text-sm">
              lock
            </span>
            ログイン
          </a>
        </li>
        <li>
          <a href="#">
            {" "}
            <span className="material-symbols-outlined align-middle mr-1 text-sm">
              favorite
            </span>
            お気に入り
          </a>
        </li>
        <li>
          <a title="言語切り替え" href="#">
            <Languages className="size-4" />
          </a>
        </li>
      </ul>
    </nav>
  );
}
