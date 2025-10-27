"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import content from "@/data/content.json";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-100 relative overflow-hidden">



            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-4 py-16 relative z-10">
                <div className="space-y-16">
                    {/* Title Section */}
                    <div className="text-center relative">
                        <h1 className="font-roboto font-[900] text-foreground uppercase leading-none tracking-tight text-[84px] md:text-[14vw]">ABOUT</h1>
                        <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-600 text-lg font-medium -rotate-12 whitespace-nowrap">ブシギアについて</p>
                    </div>

                    {/* Content Section */}
                    <div className="max-w-4xl mx-auto space-y-12">
                        {/* First Text Block */}
                        <div className="space-y-8">
                            <div className="text-center space-y-4">
                                <h2 className="text-2xl font-bold text-black">世界の闘志に、日本の誇りを。</h2>
                                <p className="text-xl font-bold text-black">Fight with Honor. Train with BushiGear.</p>
                            </div>

                            <div className="space-y-6 text-base leading-relaxed max-w-2xl mx-auto">
                                <p className="text-left">
                                    世界中の格闘技に憧れる人に、日本製の高品質でおしゃれな格闘用品を届けるサービス。
                                </p>
                                <p className="text-left">
                                    創業以来、プロフェッショナルな格闘家からアマチュア愛好家まで、
                                    幅広い層のお客様にご支持いただいております。
                                    私たちの商品は、日本の伝統的な職人技術と最新の素材技術を融合させ、
                                    最高のパフォーマンスを発揮できるよう設計されています。
                                </p>
                            </div>
                        </div>

                        {/* Logo Section */}
                        <div className="flex justify-center ">
                            <div className="w-70 h-70 flex items-center justify-center">
                                <Image
                                    src="/logo/logo_white.svg"
                                    alt="logo"
                                    width={200}
                                    height={80}
                                    className="text-white"
                                />
                            </div>
                        </div>

                        {/* Second Text Block */}
                        <div className="space-y-6 text-base leading-relaxed max-w-2xl mx-auto">
                            <p className="text-left">
                                ブシギアは、高品質な日本製の格闘用品を中心に取り扱う専門ECサイトです。国内外の格闘技愛好者に向けて、信頼性の高い製品を提供します。また、AIチャットボットを導入し、ユーザーのニーズに応じた製品提案や在庫確認など、リアルタイムなサポートを実現するサービスです。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
