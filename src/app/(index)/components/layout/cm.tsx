'use client'

import { useRef } from "react";
import * as motion from "motion/react-client"
import content from "@/data/content.json";

export default function Cm() {
  const ref = useRef(null);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-7xl h-full min-h-screen mx-auto p-6 *:first:row-span-1 *:first:md:row-span-2 *:first:col-span-2 *:first:md:col-span-1 *:last:col-span-1 *:last:md:col-span-2"
    >
      {content.home.cm.items.map((item, index) => (
        <motion.div
          key={item.id}
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          transition={{ delay: 0.15 * index, type: "spring", duration: 0.3 }}
          className="p-6 relative bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url(${item.image})` }}
        >
          {/* <h1 className="text-xl font-bold text-center uppercase">
            {item.title}
          </h1>
          <p className="text-justify">{item.description}</p> */}
        </motion.div>
      ))}
    </div>
  );
}