import { openai } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages, tool } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  
  console.log("Received messages:", messages);
  console.log("API Key exists:", !!process.env.OPENAI_API_KEY);

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages: convertToModelMessages(messages),
    system: "You are a helpful assistant. Always answer in Japanese using Markdown format. When users ask for images, use the generate_image tool to create them.",
    tools: {
      generate_image: tool({
        description: "Generate an image using DALL-E 3 based on a text description",
        inputSchema: z.object({
          prompt: z.string().describe("The detailed description of the image to generate"),
          size: z.enum(["1024x1024", "1792x1024", "1024x1792"]).optional().default("1024x1024"),
          quality: z.enum(["standard", "hd"]).optional().default("standard"),
        }),
        execute: async ({ prompt, size, quality }) => {
          try {
            const response = await fetch('https://api.openai.com/v1/images/generations', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'dall-e-3',
                prompt,
                size,
                quality,
                n: 1,
              }),
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            return {
              imageUrl: data.data[0].url,
              prompt,
              size,
              quality,
            };
          } catch (error) {
            console.error("Image generation error:", error);
            return {
              error: "Failed to generate image",
              prompt,
            };
          }
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
