import { openai } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages, tool, stepCountIs } from "ai";
import { z } from "zod";
import products from "@/data/products.json";
import { createResource } from "@/lib/actions/resources";
import { findRelevantContent } from "@/lib/ai/embedding";

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
      
      const keywords = queryLower.split(' ');
      keywords.forEach(keyword => {
        if (searchText.includes(keyword)) {
          score += 2;
        }
        
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

1. **個人情報の記憶（addResource）**：
   - ユーザーが自分について何か教えてくれたら、必ずこのツールで記憶する
   - 例：「私は醤油ラーメンが好きです」「私の趣味はテニスです」
   - 確認なしで自動的に記憶してください
   
2. **個人情報の検索（getInformation）**：
   - ユーザーが自分について質問したら、まずこのツールで検索してから回答
   - 例：「私の好きな食べ物は何ですか？」「私の趣味は何でしたか？」
   - 見つかった情報を使って回答してください
   - 見つからない場合は「その情報は記憶にありません」と伝える

3. **商品検索（search_products）**：
   - ユーザーが商品を探している、検索したい場合
   - 例：「グローブを探しています」「おすすめの商品を教えて」
   
4. **商品詳細（get_product_details）**：
   - ユーザーが特定の商品の「詳細」を明示的に求めた場合のみ
   - 例：「商品1の詳細を教えて」

5. **画像生成（generate_image）**：
   - ユーザーが画像生成を依頼した場合

重要なルール：
- ユーザーが何か情報を教えてくれたら、必ずaddResourceを使用して記憶する
- ユーザーが「私の〜は？」と質問したら、必ずgetInformationで検索してから回答する
- 記憶を確認せずに推測で答えない
- Markdown形式を使用してください`,
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

      addResource: tool({
        description: `add a resource to your knowledge base.
          If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
        inputSchema: z.object({
          content: z
            .string()
            .describe('the content or resource to add to the knowledge base'),
        }),
        execute: async ({ content }) => createResource({ content }),
      }),

      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        inputSchema: z.object({
          question: z.string().describe('the users question'),
        }),
        execute: async ({ question }) => findRelevantContent(question),
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
