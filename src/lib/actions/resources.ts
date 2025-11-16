'use server';

import prisma from '@/lib/prisma';
import { generateEmbeddings } from '@/lib/ai/embedding';

export async function createProductResource({
  product
}: {
  product: {
    id: number;
    name_jp: string;
    name_en: string;
    name_cn: string;
    category: string;
    brand: string;
    price: number;
    description_jp: string;
    description_en: string;
    description_cn: string;
  }
}) {
  try {
    const content = `
商品ID: ${product.id}
商品名称: ${product.name_jp} / ${product.name_en} / ${product.name_cn}
カテゴリー: ${product.category}
ブランド: ${product.brand}
価格: ¥${product.price.toLocaleString()}
日本語説明: ${product.description_jp}
English Description: ${product.description_en}
中文说明: ${product.description_cn}
    `.trim();

    // 创建 Resource（标记为 product 类型）
    const resource = await prisma.resource.create({
      data: {
        content,
        type: 'product',
        productId: product.id,
      },
    });

    // 生成 chunks 和 embeddings
    const embeddings = await generateEmbeddings(content);

    // 存入 Embedding 表
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
    console.error('Error creating product resource:', error);
    throw error;
  }
}
