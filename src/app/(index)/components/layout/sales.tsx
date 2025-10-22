"use client";

import Image from "next/image";
import Link from "next/link";
import * as motion from "motion/react-client";
import type { Variants } from "motion/react";
import content from "@/data/content.json";
import SectionHeader from "../common/SectionHeader";

export default function Sales() {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };
  return (
    <section className="w-full max-w-5xl mx-auto px-4 md:px-0 py-4">
      <SectionHeader
        title_en={content.home.sales.section_info.title.en}
        title_jp={content.home.sales.section_info.title.jp}
        description={content.home.sales.section_info.description.jp}
        reverse={true}
      />
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-6">
        <h2 className="relative text-3xl md:text-7xl font-calligraphy leading-none md:[writing-mode:vertical-lr] after:content-[''] after:absolute after:top-0 md:after:top-1/2 after:right-1/3 md:after:right-1/2 after:translate-x-1/2 after:translate-y-0 md:after:translate-y-1/2 after:size-12 md:after:size-20 after:rounded-full after:bg-secondary after:-z-10">
          {content.home.sales.campaign_name.jp}
        </h2>
        <p className="w-full self-end mt-6 col-start-2 text-xs md:text-sm font-sans font-[300] text-neutral-400 text-justify leading-6 tracking-wide">
          {content.home.sales.description}
        </p>
        <motion.div className="grid grid-cols-subgrid col-start-1 md:col-start-3 mx-auto col-span-2 md:col-span-4 gap-2">
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
                className="group w-full h-full flex flex-col justify-center items-center hover:bg-card/40 transition-colors duration-200"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={300}
                  height={300}
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="p-4 bg-background/50 backdrop-blur-sm shadow-lg rounded-xl">
                  <h2 className="text-lg font-bold">{item.name}</h2>
                  <p className="text-sm text-center">
                    <span className="line-through text-gray-500">
                      ￥{item.price}
                    </span>
                    <span className="text-red-500 font-bold">
                      ￥{item.price}円
                    </span>
                    (税込)
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
