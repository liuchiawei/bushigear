'use server';

import prisma from '@/lib/prisma';
import { generateEmbeddings } from '@/lib/ai/embedding';

export async function createResource({ content }: { content: string }) {
  try {
    const resource = await prisma.resource.create({
      data: { content },
    });

    const embeddings = await generateEmbeddings(content);

    await Promise.all(
      embeddings.map(async ({ content: chunk, embedding }) => {
        await prisma.$executeRaw`
          INSERT INTO "Embedding" ("resourceId", "content", "embedding", "createdAt")
          VALUES (${resource.id}, ${chunk}, ${JSON.stringify(embedding)}::vector, NOW())
        `;
      })
    );

    return resource;
  } catch (error) {
    console.error('Error creating resource:', error);
    throw error;
  }
}
