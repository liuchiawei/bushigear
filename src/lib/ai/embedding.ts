import { embed, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import prisma from '@/lib/prisma';

const embeddingModel = openai.embedding('text-embedding-ada-002');

const generateChunks = (input: string): string[] => {
  const sentenceChunks = input
    .trim()
    .split('.')
    .filter(i => i.trim() !== '');
  
  if (sentenceChunks.length === 1) {
    const lineChunks = input
      .trim()
      .split('\n')
      .map(line => line.trim())
      .filter(i => i !== '');
    
    if (lineChunks.length > 1) {
      return lineChunks;
    }
  }
  
  return sentenceChunks;
};

export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\\n', ' ');
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);

  const similarGuides = await prisma.$queryRaw<Array<{
    content: string;
    similarity: number;
  }>>`
    SELECT 
      content,
      1 - (embedding <=> ${JSON.stringify(userQueryEmbedded)}::vector) as similarity
    FROM "Embedding"
    WHERE 1 - (embedding <=> ${JSON.stringify(userQueryEmbedded)}::vector) > 0.3
    ORDER BY similarity DESC
    LIMIT 4
  `;
  
  return similarGuides;
};

export const findRelevantProducts = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);

  const allResults = await prisma.$queryRaw<Array<{
    content: string;
    similarity: number;
    productId: number;
    weight: number;
  }>>`
    SELECT 
      e.content,
      r."productId",
      1 - (e.embedding <=> ${JSON.stringify(userQueryEmbedded)}::vector) as similarity,
      CASE 
        WHEN e.content LIKE '商品名称:%' THEN 1.15
        WHEN e.content LIKE '価格:%' THEN 1.05
        ELSE 1.0
      END as weight
    FROM "Embedding" e
    JOIN "Resource" r ON e."resourceId" = r.id
    WHERE r.type = 'product'
    AND r."productId" IS NOT NULL
    AND 1 - (e.embedding <=> ${JSON.stringify(userQueryEmbedded)}::vector) > 0.5
    ORDER BY (1 - (e.embedding <=> ${JSON.stringify(userQueryEmbedded)}::vector)) * 
      CASE 
        WHEN e.content LIKE '商品名称:%' THEN 1.15
        WHEN e.content LIKE '価格:%' THEN 1.05
        ELSE 1.0
      END DESC
    LIMIT 20
  `;
  
  const productScores = new Map<number, number>();
  
  allResults.forEach((result: { productId: number; similarity: number; content: string; weight: number }) => {
    const currentScore = productScores.get(result.productId) || 0;
    const weightedScore = result.similarity * result.weight; 
    if (weightedScore > currentScore) {
      productScores.set(result.productId, weightedScore);
    }
  });
  
   const MAX_RESULTS = 3;
  
  const sortedProducts = Array.from(productScores.entries())
    .map(([productId, similarity]) => ({
      productId,
      similarity,
      content: allResults.find((r: typeof allResults[0]) => r.productId === productId)?.content || ''
    }))
    .sort((a, b) => b.similarity - a.similarity);
  
  const topScore = sortedProducts[0]?.similarity || 0;
  const SIMILARITY_THRESHOLD = topScore * 0.99;
  
  const rankedProducts = sortedProducts
    .filter((p: { similarity: number }) => p.similarity > SIMILARITY_THRESHOLD) 
    .slice(0, MAX_RESULTS); 
  
  return rankedProducts;
};
