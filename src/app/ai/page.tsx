'use client';

import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input: chatInput, handleInputChange, handleSubmit } = useChat({
    maxSteps: 3,
  });

  return (
    <section className="flex flex-col relative w-full max-w-md h-full min-h-screen py-24 mx-auto stretch">
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

      <form
        onSubmit={handleSubmit}
        className="absolute bottom-0 w-full max-w-md"
      >
        <input
          className="dark:bg-zinc-900 w-full p-2 mb-8 border border-zinc-300 dark:border-zinc-800 focus:outline-none rounded shadow-xl"
          value={chatInput}
          placeholder="何か入力してください..."
          onChange={handleInputChange}
        />
      </form>
    </section>
  );
}