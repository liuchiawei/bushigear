import { openai } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages, tool } from "ai";
import { z } from "zod";
import products from "@/data/products.json";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// 簡單的文本相似性搜索函數
function searchProducts(query: string, limit: number = 3) {
  const queryLower = query.toLowerCase();
  
  // 添加關鍵詞映射
  const keywordMap: { [key: string]: string[] } = {
    'グローブ': ['glove', 'グローブ', 'gloves'],
    'ミット': ['mitt', 'ミット', 'mitts'],
    'プロテクター': ['protector', 'プロテクター', 'protection'],
    'glove': ['グローブ', 'glove', 'gloves'],
    'mitt': ['ミット', 'mitt', 'mitts'],
    'protector': ['プロテクター', 'protector', 'protection']
  };
  
  return products
    .map(product => {
      let score = 0;
      const searchText = `${product.name_jp} ${product.name_en} ${product.name_cn} ${product.category} ${product.brand} ${product.description_jp}`.toLowerCase();
      
      // 檢查直接匹配
      const keywords = queryLower.split(' ');
      keywords.forEach(keyword => {
        if (searchText.includes(keyword)) {
          score += 2;
        }
        
        // 檢查關鍵詞映射
        if (keywordMap[keyword]) {
          keywordMap[keyword].forEach(mappedKeyword => {
            if (searchText.includes(mappedKeyword)) {
              score += 1;
            }
          });
        }
      });
      
      return { ...product, score };
    })
    .filter(product => product.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  
  console.log("=== API CALL DEBUG ===");
  console.log("Received messages:", JSON.stringify(messages, null, 2));
  console.log("Last message content:", messages[messages.length - 1]?.content);
  console.log("API Key exists:", !!process.env.OPENAI_API_KEY);
  console.log("Products available:", products.length);
  console.log("=== END DEBUG ===");

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages: convertToModelMessages(messages),
    system: `あなたはブシギアのAIアシスタントです。

重要：ユーザーの質問に応じて適切なツールを使用してください。

ツールの使用ガイドライン：

1. **search_products** を使用する場合：
   - ユーザーが商品を探している、検索したい、おすすめを知りたい場合
   - 例：「グローブを探しています」「おすすめの商品を教えて」「ミットはありますか」
   
2. **get_product_details** を使用する場合：
   - ユーザーが特定の商品の「詳細」「詳しい情報」「詳細情報」を知りたい場合のみ
   - 例：「商品1の詳細を教えて」「商品0の詳細情報を知りたい」
   
3. **商品名だけを聞かれた場合**：
   - 「商品1を教えて」「商品0について教えて」などの場合
   - search_productsツールを使用して、簡潔に商品を紹介してください
   - get_product_detailsは使用しないでください

回答のルール：
- search_productsの結果を使う場合：簡潔に商品の概要を紹介する
- get_product_detailsの結果を使う場合：詳細な説明を提供する
- Markdown形式を使用してください

ユーザーが「詳細」というキーワードを使わない限り、get_product_detailsツールは使用しないでください。`,
    tools: {
      search_products: tool({
        description: "ブシギアの商品を検索します。ユーザーが商品について質問した場合や、商品の基本情報を知りたい場合に使用してください。「詳細」というキーワードがない限り、このツールを優先的に使用してください。",
        inputSchema: z.object({
          query: z.string().describe("検索クエリ（例：グローブ、ミット、プロテクター、商品1など）"),
          limit: z.number().optional().default(3).describe("返す商品の最大数")
        }),
        execute: async ({ query, limit }) => {
          console.log("🔍 TOOL CALLED: search_products");
          console.log("Query:", query);
          console.log("Limit:", limit);
          
          try {
            const results = searchProducts(query, limit);
            console.log("Search results:", JSON.stringify(results, null, 2));
            return {
              products: results,
              query,
              totalFound: results.length
            };
          } catch (error) {
            console.error("❌ Product search error:", error);
            return {
              error: "商品検索に失敗しました",
              query
            };
          }
        },
      }),
      
      get_product_details: tool({
        description: "特定の商品の詳細情報を取得します。ユーザーが明確に「詳細」「詳しい情報」「詳細情報」などを求めている場合のみ使用してください。",
        inputSchema: z.object({
          productId: z.number().describe("商品ID")
        }),
        execute: async ({ productId }) => {
          console.log("📋 TOOL CALLED: get_product_details");
          console.log("Product ID:", productId);
          
          try {
            const product = products.find(p => p.id === productId);
            if (!product) {
              return { error: "商品が見つかりませんでした", productId };
            }
            return product;
          } catch (error) {
            console.error("Product details error:", error);
            return { error: "商品詳細の取得に失敗しました", productId };
          }
        },
      }),

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
