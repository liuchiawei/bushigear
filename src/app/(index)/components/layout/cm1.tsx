"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import items from "@/data/heroImageList.json";

export default function Cm() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    // 自動再生(5秒ごとに次の画像に切り替える)
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  // 次の画像に切り替える
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setIsAutoPlaying(false);
  };

  // 前の画像に切り替える
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 text-5xl font-bold text-white text-center uppercase drop-shadow-lg"
      >
        Bushi Gear
      </motion.h1>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "-100%" }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={items[currentIndex].image}
            alt={items[currentIndex].title}
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/20 rounded-full hover:bg-background/80 cursor-pointer"
        onClick={prevSlide}
        title="previous"
      >
        <ArrowLeft className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/20 rounded-full hover:bg-background/80 cursor-pointer"
        onClick={nextSlide}
        title="next"
      >
        <ArrowRight className="size-4" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300
              ${index === currentIndex
                ? "bg-primary w-4"
                : "bg-foreground/30 hover:bg-foreground/50"
              }`}
            onClick={() => {
              setCurrentIndex(index);
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
