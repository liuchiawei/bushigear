import Link from "next/link";
import { Button } from "@/components/ui/button";
import content from "@/data/content.json";
import { useLocale } from "next-intl";
import { getLocalizedText, type Locale } from "@/lib/i18n";

export default function CategoryPage() {
  const locale = useLocale() as Locale;
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center gap-12">
      <header className="w-full relative select-none overflow-hidden flex justify-center items-center">
        <h1 className="font-roboto font-[900] text-center uppercase leading-none tracking-[-0.08em] text-[92px] md:text-[180px]">
          Category
        </h1>
        <h6 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg md:text-5xl font-calligraphy text-accent leading-none tracking-widest rotate-[-20deg]">
          カテゴリ一覧
        </h6>
      </header>
      <section className="w-full h-full p-2 grid grid-cols-2 md:grid-cols-4 gap-2">
        {content.nav.categories.map((category) => (
          <Button
            size="lg"
            className="w-full h-full aspect-square hover:bg-accent hover:text-accent-foreground text-2xl font-bold uppercase"
            asChild
            key={category.id}
          >
            <Link href={`/category/${category.slug}`}>
              {locale === "jp"
                ? category.name.jp
                : getLocalizedText(category.name as any, locale)}
            </Link>
          </Button>
        ))}
      </section>
    </div>
  );
}
