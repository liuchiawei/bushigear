import Link from "next/link";
import { Search, Languages, Bot } from "lucide-react";

export default function Nav() {
  return (
    <nav className="w-full p-3 fixed top-0 left-0 z-50 flex justify-between items-center">
      <div className="w-24">
        <Link href="/" className="text-2xl font-bold text-center">LOGO</Link>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-center">ナビゲーション</h1>
      </div>
      <ul className="flex items-center gap-4">
        <li>
          <a title="検索" href="#">
            <Search className="size-4" />
          </a>
        </li>
        <li>
          <a href="#">
            会員登録
          </a>
        </li>
        <li>
          <a href="#">
            ログイン
          </a>
        </li>
        <li>
          <Link title="AI" href="/ai">
            <Bot className="size-4" />
          </Link>
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