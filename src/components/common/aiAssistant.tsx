"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    setIsOpen(!isOpen);
  };
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat({
    maxSteps: 3,
  });

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Button onClick={handleOpen}>
        <h1>AI</h1>
      </Button>
      {isOpen && (
        <section className="absolute bottom-0 left-0 flex flex-col justify-between w-lg max-h-60 p-3 stretch bg-white rounded-md shadow-lg overflow-y-auto">
          {messages.map(message => (
            <div key={message.id} className="whitespace-pre-wrap">
              {message.role === 'user' ? 'User: ' : 'AI: '}
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case 'text':
                    return <div key={`${message.id}-${i}`}>{part.text}</div>;
                  case 'tool-weather':
                    return (
                      <pre key={`${message.id}-${i}`}>
                        {JSON.stringify(part, null, 2)}
                      </pre>
                    );
                }
              })}
            </div>
          ))}
          <form
            onSubmit={e => {
              e.preventDefault();
              sendMessage({ text: input });
              setInput('');
            }}
          >
            <input
              className="dark:bg-zinc-900 w-full p-2 border border-zinc-300 dark:border-zinc-800 focus:outline-none rounded"
              value={input}
              placeholder="何か入力してください..."
              onChange={e => setInput(e.currentTarget.value)}
            />
          </form>
          <button title="閉じる" className="absolute top-4 right-4 size-4 cursor-pointer" onClick={handleOpen}>
            <X />
          </button>
        </section>
      )}
    </div>
  );
}