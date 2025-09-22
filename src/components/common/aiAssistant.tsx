"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { X, Bot } from "lucide-react";

export default function AiAssistant() {
  const pathname = usePathname();
  const isAi = pathname === "/ai";

  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    setIsOpen(!isOpen);
  };
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useChat({});

  if (isAi) return null;
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="rounded-full size-12 hover:shadow-xl"
              onClick={handleOpen}
            >
              <Bot className="size-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>AIアシスタント</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {isOpen && (
        <section className="absolute bottom-0 left-0 flex flex-col justify-between w-lg max-h-60 stretch bg-white rounded-md shadow-lg overflow-y-auto">
          <div className="flex justify-between items-center p-3 text-background bg-foreground">
            <Link href="/ai" className="text-xl font-bold text-center">
              AIアシスタント
            </Link>
            <button
              title="閉じる"
              className="size-4 flex items-center justify-center cursor-pointer"
              onClick={handleOpen}
            >
              <X />
            </button>
          </div>
          <div className="p-3">
            {messages.map((message) => (
              <div key={message.id} className="whitespace-pre-wrap">
                {message.role === "user" ? "User: " : "AI: "}
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return <div key={`${message.id}-${i}`}>{part.text}</div>;
                    case "tool-call":
                      return (
                        <div
                          key={`${message.id}-${i}`}
                          className="text-blue-600 text-sm"
                        >
                          🔧 Generating image...
                        </div>
                      );
                    case "tool-result":
                      // Check if the tool result has completed successfully
                      if ("output" in part && part.output) {
                        const result = part.output as any;
                        if (result.error) {
                          return (
                            <div
                              key={`${message.id}-${i}`}
                              className="text-red-600 text-sm"
                            >
                              ❌ {result.error}
                            </div>
                          );
                        } else if (result.imageUrl) {
                          return (
                            <div key={`${message.id}-${i}`} className="mt-2">
                              <Image
                                width={1000}
                                height={1000}
                                src={result.imageUrl}
                                alt={result.prompt}
                                className="max-w-full h-auto rounded"
                                style={{ maxHeight: "200px" }}
                              />
                            </div>
                          );
                        }
                      }
                      return null;
                    default:
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
                name="prompt"
                value={input}
                className="dark:bg-zinc-900 w-full p-2 border border-zinc-300 dark:border-zinc-800 focus:outline-none rounded"
                placeholder="何か入力してください..."
                onChange={(e) => setInput(e.currentTarget.value)}
              />
            </form>
          </div>
        </section>
      )}
    </div>
  );
}
