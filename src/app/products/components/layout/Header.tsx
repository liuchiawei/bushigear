 "use client";

import { useLocale } from "next-intl";
import { getLocalizedText, type Locale } from "@/lib/i18n";

export default function Header() {
  const locale = useLocale() as Locale;
  const title = getLocalizedText(
    {
      jp: "商品一覧",
      en: "Products",
      zh_tw: "商品一覽",
      zh_cn: "商品一览",
    } as any,
    locale
  );
  return (
    <header className="w-full relative select-none overflow-hidden flex justify-center items-center">
      <h1 className="text-[96px] md:text-[170px] font-roboto font-[900] text-center uppercase leading-none tracking-[-0.08em]">
        {getLocalizedText(
          { jp: "Products", en: "Products", zh_tw: "Products", zh_cn: "Products" } as any,
          locale
        )}
      </h1>
      <h6 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg md:text-5xl font-calligraphy text-accent leading-none tracking-widest rotate-[-20deg]">
        {title}
      </h6>
    </header>
  );
}
