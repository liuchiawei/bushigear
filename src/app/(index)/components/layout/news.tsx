"use client";

import { useState } from "react";
import SectionHeaderNews from "../common/SectionHeaderNews";
import content from "@/data/content.json";
import { useLocale } from "next-intl";
import { getLocalizedText, type Locale } from "@/lib/i18n";

export default function News() {
  const locale = useLocale() as Locale;
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const newsItems = content.home.news.items.map((item) => ({
    ...item,
    title:
      locale === "jp"
        ? item.title.jp
        : getLocalizedText(item.title, locale),
    details:
      locale === "jp"
        ? item.details.jp
        : item.details[locale] ?? item.details.jp,
  }));

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const moreLabel = getLocalizedText(content.home.news.actions.more, locale);
  const closeLabel = getLocalizedText(content.home.news.actions.close, locale);

  const sectionTitle = content.home.news.section_info.title;
  const headerTitleJp =
    locale === "jp" ? sectionTitle.jp : getLocalizedText(sectionTitle, locale);
  const headerTitleEn = sectionTitle.en;

  return (
    <section className="w-full max-w-5xl mx-auto px-4 md:px-0 py-4 mb-50">
      <div className="flex flex-col items-end">
        <SectionHeaderNews
          title_en={headerTitleEn}
          title_jp={headerTitleJp}
          reverse={true}
        />
        <div className="mt-8 w-full max-w-2xl">
          <ul className="flex flex-col gap-4">
            {newsItems.map((item) => (
              <li key={item.id} className="flex flex-col">
                <div className="flex items-center gap-6">
                  <span className="text-sm font-sans text-foreground whitespace-nowrap">{item.date}</span>
                  <span className="text-sm font-sans text-foreground w-48">{item.title}</span>
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className="text-xs font-sans text-foreground border border-foreground px-3 py-1 hover:bg-foreground hover:text-background transition-colors cursor-pointer"
                  >
                    {expandedItems.includes(item.id) ? closeLabel : moreLabel}
                  </button>
                </div>
                {expandedItems.includes(item.id) && (
                  <div className="mt-3 ml-24 p-4 rounded" style={{ backgroundColor: '#DFDFDF' }}>
                    <div className="text-sm font-sans text-foreground space-y-2">
                      {item.details.map((detail, index) => (
                        <p key={index}>{detail}</p>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
