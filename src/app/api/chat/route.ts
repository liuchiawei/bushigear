import { openai } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages, tool, stepCountIs } from "ai";
import { z } from "zod";
import products from "@/data/products.json";
import { findRelevantProducts } from "@/lib/ai/embedding";
import prisma from "@/lib/prisma";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  console.log("=== API CALL DEBUG ===");
  console.log("Received messages count:", messages.length);
  console.log("API Key exists:", !!process.env.OPENAI_API_KEY);
  console.log("Products available:", products.length);
  console.log("=== END DEBUG ===");

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    system: `あなたはブシギアのAIアシスタントです。

重要：ユーザーの質問に応じて適切なツールを使用してください。

ツールの使用ガイドライン：

1. **商品検索（search_products_semantic）**：
   - ユーザーが商品を探している、検索したい、おすすめを知りたい場合
   - 例：「グローブを探しています」「おすすめの商品を教えて」「初心者向けの商品」
   - 必ずこのツールを使用してください（AIによる意味理解で検索します）
      - **重要：このツールを使用した後は、商品の詳細情報を繰り返さないでください。UIに既に表示されています。簡単な確認だけで十分です。**

2. **画像生成（generate_image）**：
   - ユーザーが画像生成を依頼した場合

重要なルール：
- 商品検索ツールを使用した後は、商品詳細を繰り返し記載しないでください
- Markdown形式を使用してください`,
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

      search_products_semantic: tool({
        description: "セマンティック検索を使用して関連商品を検索します。ユーザーの意図を理解し、表現が異なっても関連商品を見つけることができます。例：「初心者向け」で「ビギナー用」の商品も検索できます。",
        inputSchema: z.object({
          query: z.string().describe("検索クエリまたはユーザーの意図"),
          limit: z.number().optional().default(5).describe("返す商品の最大数")
        }),
        execute: async ({ query, limit }) => {
          console.log("🔍 TOOL CALLED: search_products_semantic");
          console.log("Query:", query);
          console.log("Limit:", limit);
          
          try {
            // 使用 vector 搜索找到相关商品
            const semanticResults = await findRelevantProducts(query);
            
            if (semanticResults.length === 0) {
              return {
                products: [],
                query,
                totalFound: 0,
                message: "該当する商品が見つかりませんでした"
              };
            }

            // 根据 productId 获取完整商品信息
            const productIds = semanticResults
              .slice(0, limit)
              .map((r: { productId: number | null }) => r.productId)
              .filter((id: number | null): id is number => id !== null);

            const productsData = await prisma.product.findMany({
              where: {
                id: { in: productIds }
              }
            });

            // 按相似度排序
            const orderedProducts = productIds
              .map((id: number) => productsData.find((p: any) => p.id === id))
              .filter((p: any): p is NonNullable<typeof p> => p !== null);

            return {
              products: orderedProducts,
              query,
              totalFound: orderedProducts.length,
              semanticSearch: true
            };
          } catch (error) {
            console.error("❌ Search error:", error);
            return {
              error: "検索に失敗しました",
              query
            };
          }
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
