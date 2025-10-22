"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useChat();
  return (
    <section className="flex flex-col relative w-full max-w-md h-full min-h-screen py-24 mx-auto stretch">
      {messages.map((message, messageIndex) => (
        <div key={`msg-${messageIndex}`} className="whitespace-pre-wrap">
          {message.role === "user" ? "User: " : "AI: "}
          {message.parts.map((part, i) => {
            console.log("Part type:", part.type, "Part:", part);
            const partKey = `msg-${messageIndex}-part-${i}-${part.type}`;
            switch (part.type) {
              case "text":
                return (
                  <div key={partKey} className="prose max-w-none">
                    <ReactMarkdown>{part.text}</ReactMarkdown>
                  </div>
                );
              case "tool-call":
                return (
                  <div key={partKey} className="text-blue-600 text-sm">
                    🔧 Generating image...
                  </div>
                );
              case "tool-result":
                if (part.state === "output-available" && part.output) {
                  const result = part.output as any;
                  console.log("Tool result:", result);
                  if (result.error) {
                    return (
                      <div
                        key={`${partKey}-error`}
                        className="text-red-600 text-sm"
                      >
                        ❌ {result.error}
                      </div>
                    );
                  } else if (result.imageUrl) {
                    return (
                      <div key={`${partKey}-image`} className="mt-2">
                        <img
                          src={result.imageUrl}
                          alt={result.prompt}
                          className="max-w-full h-auto rounded"
                          style={{ maxHeight: "400px" }}
                        />
                      </div>
                    );
                  }
                }
                return null;
              case "tool-generate_image":
                // Simple test - always show something for tool-generate_image
                if (part.state === "output-available") {
                  console.log("State is output-available, showing image");
                  const output = part.output as any;
                  return (
                    <div key={`image-${messageIndex}-${i}`} className="mt-2">
                      <div className="text-green-600 text-sm mb-2">
                        ✅ Image generated!
                      </div>
                      <Image
                        width={400}
                        height={400}
                        src={output.imageUrl}
                        alt={output.prompt}
                        className="max-w-full h-auto max-h-[400px] rounded"
                        onLoad={() => console.log("Image loaded successfully")}
                        onError={(e) => console.log("Image failed to load:", e)}
                      />
                    </div>
                  );
                }

                // Show generating message for other states
                return (
                  <div key={partKey} className="text-blue-600 text-sm">
                    🔧 Generating image... (State: {part.state})
                  </div>
                );
              case "tool-search_products":
                if (part.state === "output-available" && part.output) {
                  const result = part.output as any;
                  console.log("Search result:", result);
                  
                  if (result.error) {
                    return (
                      <div key={`${partKey}-error`} className="text-red-600 text-sm">
                        ❌ {result.error}
                      </div>
                    );
                  }
                  
                  if (result.products && result.products.length > 0) {
                    return (
                      <div key={`${partKey}-products`} className="mt-4">
                        <div className="text-green-600 text-sm mb-2">
                          ✅ {result.totalFound}件の商品が見つかりました
                        </div>
                        <div className="grid gap-4">
                          {result.products.map((product: any, index: number) => (
                            <div key={`product-${index}`} className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex items-center gap-4">
                                <img 
                                  src={product.image} 
                                  alt={product.name_jp}
                                  className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg">{product.name_jp}</h3>
                                  <p className="text-gray-600">{product.brand}</p>
                                  <p className="text-sm text-gray-500">{product.category}</p>
                                  <p className="text-lg font-bold text-blue-600">¥{product.price.toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div key={`${partKey}-no-results`} className="text-yellow-600 text-sm">
                        ⚠️ 該当する商品が見つかりませんでした
                      </div>
                    );
                  }
                }
                
                // 顯示搜索中狀態
                return (
                  <div key={partKey} className="text-blue-600 text-sm">
                    🔍 商品を検索中...
                  </div>
                );
              case "tool-get_product_details":
                if (part.state === "output-available" && part.output) {
                  const result = part.output as any;
                  console.log("Product details result:", result);
                  
                  if (result.error) {
                    return (
                      <div key={`${partKey}-error`} className="text-red-600 text-sm">
                        ❌ {result.error}
                      </div>
                    );
                  }
                  
                  // 顯示單個商品的詳細信息
                  return (
                    <div key={`${partKey}-product-detail`} className="mt-4">
                      <div className="text-green-600 text-sm mb-2">
                        ✅ 商品詳細情報
                      </div>
                      <div className="border rounded-lg p-6 bg-gray-50">
                        <div className="flex items-start gap-6">
                          <img 
                            src={result.image} 
                            alt={result.name_jp}
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2">{result.name_jp}</h2>
                            <p className="text-gray-600 mb-1">
                              <span className="font-semibold">英語名:</span> {result.name_en}
                            </p>
                            <p className="text-gray-600 mb-1">
                              <span className="font-semibold">中文名:</span> {result.name_cn}
                            </p>
                            <p className="text-gray-600 mb-1">
                              <span className="font-semibold">カテゴリ:</span> {result.category}
                            </p>
                            <p className="text-gray-600 mb-1">
                              <span className="font-semibold">ブランド:</span> {result.brand}
                            </p>
                            <p className="text-2xl font-bold text-blue-600 mt-4">
                              ¥{result.price.toLocaleString()}
                            </p>
                            <div className="mt-4 p-4 bg-white rounded">
                              <p className="text-sm text-gray-700">
                                <span className="font-semibold">説明:</span> {result.description_jp}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                // 顯示獲取中狀態
                return (
                  <div key={partKey} className="text-blue-600 text-sm">
                    📋 商品詳細を取得中...
                  </div>
                );
              case "step-start":
                return null; // Ignore step-start parts
              default:
                console.log("Unknown part type:", part.type);
                return null;
            }
          })}
        </div>
      ))}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput("");
          }
        }}
      >
        <input
          className="absolute bottom-0 dark:bg-zinc-900 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 focus:outline-none rounded shadow-xl"
          value={input}
          placeholder="何か入力してください..."
          onChange={(e) => setInput(e.currentTarget.value)}
        />
      </form>
    </section>
  );
}
