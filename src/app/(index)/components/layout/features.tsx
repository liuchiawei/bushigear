"use client";

import SectionHeader from "../common/SectionHeader";
import FeatureCarousel from "../common/FeatureCarousel";
import content from "@/data/content.json";
import { useLocale } from "next-intl";
import { getLocalizedText, type Locale } from "@/lib/i18n";

export default function Features() {
  const locale = useLocale() as Locale;
  const sectionTitle = content.home.features.section_info.title;
  const sectionDescription = content.home.features.section_info.description;

  const headerTitleJp =
    locale === "jp" ? sectionTitle.jp : getLocalizedText(sectionTitle, locale);
  const headerTitleEn = sectionTitle.en;
  const headerDescription =
    locale === "jp"
      ? sectionDescription.jp
      : getLocalizedText(sectionDescription, locale);

  return (
    <section className="w-full max-w-5xl mx-auto py-4">
      <SectionHeader
        title_en={headerTitleEn}
        title_jp={headerTitleJp}
        description={headerDescription}
      />
      <FeatureCarousel />
    </section>
  );
}
