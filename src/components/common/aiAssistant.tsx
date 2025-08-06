"use client";

import { useState } from "react";
import { useChat } from "ai/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { X, Bot } from "lucide-react";

export default function AiAssistant() {
  const pathname = usePathname();
  const isAi = pathname === "/ai";

  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    setIsOpen(!isOpen);
  };
  const { messages, input: chatInput, handleInputChange, handleSubmit } = useChat({
    maxSteps: 3,
  });

  if (isAi) return null;
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="rounded-full size-12 hover:shadow-xl hover:animate-bounce" onClick={handleOpen}>
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
            <Link href="/ai" className="text-xl font-bold text-center">AIアシスタント</Link>
            <button title="閉じる" className="size-4 flex items-center justify-center cursor-pointer" onClick={handleOpen}>
              <X />
            </button>
          </div>
          <div className="p-3">
            {messages.map(message => (
              <div key={message.id} className="whitespace-pre-wrap">
                {message.role === 'user' ? 'User: ' : 'AI: '}
                {message.content}
                {message.toolInvocations && message.toolInvocations.length > 0 && (
                  <pre className="mt-2 text-sm text-gray-600">
                    {JSON.stringify(message.toolInvocations, null, 2)}
                  </pre>
                )}
              </div>
            ))}
            <form onSubmit={handleSubmit}>
              <input
                className="dark:bg-zinc-900 w-full p-2 border border-zinc-300 dark:border-zinc-800 focus:outline-none rounded"
                value={chatInput}
                placeholder="何か入力してください..."
                onChange={handleInputChange}
              />
            </form>
          </div>
        </section>
      )}
    </div>
  );
}