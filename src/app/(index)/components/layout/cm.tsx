"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import items from "@/data/heroImageList.json";

export default function Cm() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // 自動再生（5秒ごとに次の画像に切り替える）
  useEffect(() => {
    if (!api || !isAutoPlaying) return;

    const timer = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [api, isAutoPlaying]);

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Title Overlay */}
      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 text-5xl font-bold text-white text-center uppercase drop-shadow-lg"
      >
        Bushi Gear
      </motion.h1>

      {/* Carousel */}
      <Carousel
        setApi={setApi}
        className="w-full max-w-6xl"
        opts={{
          loop: true,
          align: "start",
          slidesToScroll: 1,
        }}
      >
        <CarouselContent className="h-[28rem]">
          {items.map((item) => (
            <CarouselItem key={item.id} className="basis-1/3 pl-4">
              <div className="w-full h-full relative rounded-xl overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 size-12 rounded-full hover:bg-primary hover:text-background cursor-pointer"
        onClick={() => {
          api?.scrollPrev();
          setIsAutoPlaying(false);
        }}
        title="Previous"
      >
        <ChevronLeft className="size-6" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 size-12 rounded-full hover:bg-primary hover:text-background cursor-pointer"
        onClick={() => {
          api?.scrollNext();
          setIsAutoPlaying(false);
        }}
        title="Next"
      >
        <ChevronRight className="size-6" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        {items.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current
                ? "bg-primary w-8"
                : "bg-white/30 hover:bg-white/50 w-2"
            }`}
            onClick={() => {
              api?.scrollTo(index);
              setIsAutoPlaying(false);
            }}
            title={`Switch to the ${index + 1}th slide`}
            aria-label={`Switch to the ${index + 1}th slide`}
          />
        ))}
      </div>
    </div>
  );
}
