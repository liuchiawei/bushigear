import { embed, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import prisma from '@/lib/prisma';

const embeddingModel = openai.embedding('text-embedding-ada-002');

const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split('.')
    .filter(i => i !== '');
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
    WHERE 1 - (embedding <=> ${JSON.stringify(userQueryEmbedded)}::vector) > 0.5
    ORDER BY similarity DESC
    LIMIT 4
  `;
  
  return similarGuides;
};
