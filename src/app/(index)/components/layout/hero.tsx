"use client";
import Image from "next/image";
import { motion } from "motion/react";
import KatakanaTitle from "../common/KatakanaTitle";
import content from "@/data/content.json";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";

export default function Hero() {
  return (
    <header className="w-full h-full relative select-none">
      <div className="w-full max-w-5xl mx-auto h-full min-h-screen flex flex-col items-center justify-between px-4 md:px-0 py-4">
        <div className="w-full flex items-center gap-2 uppercase">
          <h1 className="text-xl md:text-2xl font-sans font-[900] bg-accent text-white p-2">
            武
          </h1>
          <KatakanaTitle
            text="BUSHIGEAR"
            className="text-2xl md:text-4xl font-roboto font-[900] text-foreground"
          />
        </div>
        <div className="relative w-full h-full">
          <h1 className="text-[160px] md:text-[18vw] text-center font-roboto-condensed font-[900] text-foreground uppercase tracking-[-0.075em] leading-none w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            Bushi Gear
          </h1>
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
