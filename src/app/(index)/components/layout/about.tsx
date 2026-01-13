"use client";

import content from "@/data/content.json";
import SectionHeader from "../common/SectionHeader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";
import { getLocalizedText, type Locale } from "@/lib/i18n";

export default function About() {
  const locale = useLocale() as Locale;

  const sectionTitle = content.home.about.section_info.title;
  const headerTitleJp =
    locale === "jp"
      ? sectionTitle.jp
      : getLocalizedText(sectionTitle, locale);
  const headerTitleEn = sectionTitle.en;

  const aboutTitle =
    locale === "jp"
      ? content.home.about.title.jp
      : getLocalizedText(content.home.about.title, locale);
  const aboutDescription =
    locale === "jp"
      ? content.home.about.description.jp
      : getLocalizedText(content.home.about.description, locale);
  const aboutButton =
    locale === "jp"
      ? content.home.about.button.jp
      : getLocalizedText(content.home.about.button, locale);

  return (
    <section className="w-full max-w-5xl mx-auto px-4 md:px-0 py-4 mb-10">
      <SectionHeader
        title_en={headerTitleEn}
        title_jp={headerTitleJp}
      />
      <div className="w-full max-w-xl h-full mx-auto flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold text-center mb-6">
          {aboutTitle}
        </h1>
        <p className="text-base text-justify mb-6">
          {aboutDescription}
        </p>
        <Button className="font-bold text-sm rounded-none py-4 px-8" asChild>
          <Link href="/about">{aboutButton}</Link>
        </Button>
      </div>
    </section>
  );
}
