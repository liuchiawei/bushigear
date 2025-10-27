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
                    console.log("Output object:", output);
                    console.log("ImageUrl:", output?.imageUrl);
                    
                    // 檢查 imageUrl 是否存在
                    if (!output?.imageUrl) {
                      return (
                        <div key={`image-${messageIndex}-${i}`} className="mt-2">
                          <div className="text-red-600 text-sm">
                            ❌ 画像生成に失敗しました：画像 URL が取得できませんでした
                          </div>
                          <div className="text-sm text-gray-600">
                            Output: {JSON.stringify(output)}
                          </div>
                        </div>
                      );
                    }
                    
                    return (
                      <div key={`image-${messageIndex}-${i}`} className="mt-2">
                        <div className="text-green-600 text-sm mb-2">
                          ✅ 画像が生成されました！
                        </div>
                        <img
                          src={output.imageUrl}
                          alt={output.prompt || "Generated image"}
                          className="max-w-full h-auto rounded"
                          style={{ maxHeight: "400px" }}
                          onLoad={() => console.log("Image loaded successfully")}
                          onError={(e) => console.log("Image failed to load:", e)}
                        />
                      </div>
                    );
                  }
                
                  // Show generating message for other states
                  return (
                    <div key={partKey} className="text-blue-600 text-sm">
                      🔧 画像を生成しています... (State: {part.state})
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
