"use client";
import Image from "next/image";
import { motion } from "motion/react";
import content from "@/data/content.json";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";

export default function Hero() {
  return (
    <header className="w-full h-full relative select-none">
      <div className="w-full max-w-5xl mx-auto h-full min-h-screen flex flex-col items-center justify-between px-4 md:px-0 py-4">
        <div className="w-full flex items-center gap-2 uppercase">
          <Image
            src="/logo/logo_icon.svg"
            alt="logo"
            width={40}
            height={40}
            objectFit="cover"
          />
          <Image
            src="/logo/logo_text.svg"
            alt="logo"
            width={200}
            height={40}
            objectFit="cover"
          />
        </div>
        <div className="relative w-full h-full">
          <Image
            src="/logo/logo_text.svg"
            alt="logo"
            width={1000}
            height={120}
            objectFit="cover"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
          <motion.h1
            initial={{ opacity: 0, y: 5, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-20deg] text-[66px] md:text-[108px] text-center font-calligraphy text-accent tracking-wider leading-none break-keep z-0"
          >
            武士ギア
          </motion.h1>
          <CardContainer className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 object-cover">
            <CardBody className="flex items-center justify-center">
              <CardItem translateZ={50}>
                <Image
                  src="/images/protector_10.png"
                  alt="bushigear"
                  width={200}
                  height={200}
                  className="object-cover"
                />
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>
        <div className="w-full flex flex-col gap-2 text-neutral-400 text-sm font-[200] tracking-wider text-border uppercase">
          <h3 className="text-xl md:text-4xl font-roboto">
            Tokyo Fighting Gear Shop
          </h3>
          <h4 className="text-sm md:text-lg font-sans">
            {content.home.catchcopy.jp}
          </h4>
        </div>
        <h6 className="hidden md:block absolute top-1/2 right-4 -translate-y-1/2 text-2xl text-neutral-400 font-roboto font-[200] tracking-[0.1em] [writing-mode:vertical-lr] uppercase">
          since 2025
        </h6>
      </div>
    </header>
  );
}
