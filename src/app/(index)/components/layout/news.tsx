"use client";

import { useState } from "react";
import SectionHeaderNews from "../common/SectionHeaderNews";
import content from "@/data/content.json";

export default function News() {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const newsItems = [
    {
      id: 1,
      date: "2025/09/10",
      title: "2025年9月臨時休業",
      details: [
        "当店は下記の日程で臨時休業とさせて頂きます。",
        "2025年9月20日~2025年9月23日",
        "2025年9月24日から通常営業となります。",
        "発送等は通常営業明けからとなりますが、メール対応等は行います。"
      ]
    },
    {
      id: 2,
      date: "2025/08/10",
      title: "送料体系の改定について",
      details: [
        "送料体系を改定いたします。",
        "詳細は後日お知らせいたします。",
        "ご不便をおかけして申し訳ございません。"
      ]
    },
    {
      id: 3,
      date: "2025/08/10",
      title: "新商品を入荷しました",
      details: [
        "新しい商品が入荷いたしました。",
        "詳細は商品ページをご確認ください。",
        "お得な価格でご提供しております。"
      ]
    }
  ];

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 md:px-0 py-4 mb-50">
      <div className="flex flex-col items-end">
        <SectionHeaderNews
          title_en={content.home.news.section_info.title.en}
          title_jp={content.home.news.section_info.title.jp}
          reverse={true}
        />
        <div className="mt-8 w-full max-w-2xl">
          <ul className="flex flex-col gap-4">
            {newsItems.map((item) => (
              <li key={item.id} className="flex flex-col">
                <div className="flex items-center gap-6">
                  <span className="text-sm font-sans text-foreground whitespace-nowrap">{item.date}</span>
                  <span className="text-sm font-sans text-foreground w-48">{item.title}</span>
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className="text-xs font-sans text-foreground border border-foreground px-3 py-1 hover:bg-foreground hover:text-background transition-colors"
                  >
                    {expandedItems.includes(item.id) ? "CLOSE" : "MORE"}
                  </button>
                </div>
                {expandedItems.includes(item.id) && (
                  <div className="mt-3 ml-24 p-4 rounded" style={{ backgroundColor: '#DFDFDF' }}>
                    <div className="text-sm font-sans text-foreground space-y-2">
                      {item.details.map((detail, index) => (
                        <p key={index}>{detail}</p>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
