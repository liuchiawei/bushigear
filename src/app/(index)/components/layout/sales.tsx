"use client";

import Image from "next/image";
import * as motion from "motion/react-client";
import type { Variants } from "motion/react"
import content from "@/data/content.json";

export default function Sales() {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };
  return (
    <div style={{ backgroundImage: `url(/images/sale_area_bg.jpg)` }} className="p-10 bg-cover bg-center">
      <h1 className="my-6 text-3xl font-bold text-center text-white">
        {content.home.sales.title}
      </h1>
      <motion.div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-7xl h-full mx-auto p-6">
        {content.home.sales.items.map((item, index) => (
          <motion.div
          key={item.id}
          variants={itemVariants}
          className="bg-gray-400 w-full"
          initial="hidden"
          whileInView="visible"
          transition={{ delay: 0.1 * index, type: "spring", duration: 0.5 }}
          >
            <Image src={item.image} alt={item.name} width={480} height={480} className="w-full h-auto" />
            <div className="p-4 bg-white">
              <h2 className="text-lg font-bold">{item.name}</h2>
              <p className="text-sm text-center">
                <span className="line-through text-gray-500">￥{item.price}</span>
                <span className="text-red-500 font-bold">￥{item.price}円</span>
                (税込)
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}