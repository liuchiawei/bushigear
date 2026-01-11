"use client";

import Image from "next/image";
import Link from "next/link";
import * as motion from "motion/react-client";
import type { Variants } from "motion/react";
import content from "@/data/content.json";
import SectionHeader from "../common/SectionHeader";
import { useLocale } from "next-intl";
import { getLocalizedText, type Locale } from "@/lib/i18n";

export default function Sales() {
  const locale = useLocale() as Locale;
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const sectionTitle = content.home.sales.section_info.title;
  const sectionDescription = content.home.sales.section_info.description;
  const campaignName =
    locale === "jp"
      ? content.home.sales.campaign_name.jp
      : getLocalizedText(content.home.sales.campaign_name, locale);
  const headerTitleJp =
    locale === "jp" ? sectionTitle.jp : getLocalizedText(sectionTitle, locale);
  const headerTitleEn = sectionTitle.en;
  const headerDescription =
    locale === "jp"
      ? sectionDescription.jp
      : getLocalizedText(sectionDescription, locale);

  return (
    <section className="w-full max-w-5xl mx-auto px-4 md:px-0 py-4">
      <SectionHeader
        title_en={headerTitleEn}
        title_jp={headerTitleJp}
        description={headerDescription}
        reverse={true}
      />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-6">
        <h2 className="relative text-3xl md:text-7xl flex items-center font-calligraphy leading-none md:[writing-mode:vertical-lr] after:content-[''] after:absolute after:top-0 md:after:top-1/4 after:right-1/3 md:after:right-1/2 after:translate-x-1/2 after:translate-y-0 md:after:translate-y-1/2 after:size-12 md:after:size-20 after:rounded-full after:bg-secondary after:-z-10">
          {campaignName}
        </h2>
        {/* <p className="w-full self-end mt-6 col-start-2 text-xs md:text-sm font-sans font-[300] text-neutral-400 text-justify leading-6 tracking-wide">
          {content.home.sales.description}
        </p> */}
        <motion.div className="w-full grid grid-cols-subgrid col-start-1 md:col-start-2 mx-auto col-span-2 md:col-span-4 gap-2">
          {content.home.sales.items.map((item, index) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className={`w-full ${
                index === 0 ? "col-span-2 row-span-2" : "col-span-1"
              }`}
              initial="hidden"
              whileInView="visible"
              transition={{ delay: 0.1 * index, type: "spring", duration: 0.5 }}
            >
              <Link
                href={`/products/${item.id}`}
                className="group w-full h-full p-2 flex flex-col justify-center items-center bg-card/[0.2] rounded-xl hover:bg-card/40 transition-colors duration-200"
              >
                <div className="w-full h-full p-0 md:p-6 flex items-center justify-center">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={300}
                    height={300}
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div
                  className={`w-full flex flex-col justify-center items-center p-4 bg-background/50 backdrop-blur-sm shadow-lg rounded-xl ${
                    index === 0 ? "h-2/5" : "h-full"
                  }`}
                >
                  <h2
                    className={`font-bold text-center ${
                      index === 0 ? "text-xl md:text-3xl" : "text-lg"
                    }`}
                  >
                    {item.name}
                  </h2>
                  <h5
                    className={`line-through text-gray-500 font-thin ${
                      index === 0 ? "text-sm md:text-lg" : "text-sm"
                    }`}
                  >
                    ￥{item.price}
                  </h5>
                  <h4
                    className={`text-accent font-bold ${
                      index === 0 ? "text-xl md:text-3xl" : "text-lg"
                    }`}
                  >
                    ￥{item.price}円
                  </h4>
                  <p className="text-xs text-muted-foreground">税込</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
