import prisma from '../src/lib/prisma';
import { createProductResource } from '../src/lib/actions/resources';

async function importProducts() {
  console.log('🚀 開始導入商品到 RAG 系統...\n');

  const products = await prisma.product.findMany();
  console.log(`📦 找到 ${products.length} 個商品\n`);

  let successCount = 0;
  let errorCount = 0;
  let totalChunks = 0;

  for (const product of products) {
    try {
      console.log(`處理中: ${product.name_jp} (ID: ${product.id})...`);

      const resource = await createProductResource({ product });

      const chunks = await prisma.embedding.count({
        where: { resourceId: resource.id }
      });
      
      totalChunks += chunks;
      console.log(`  ✅ 成功！生成了 ${chunks} 個 chunks\n`);
      successCount++;

    } catch (error) {
      console.error(`  ❌ ${product.name_jp} 導入失敗:`, error);
      errorCount++;
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 導入完成！');
  console.log(`✅ 成功: ${successCount} 個商品`);
  console.log(`❌ 失敗: ${errorCount} 個商品`);
  console.log(`📈 總共生成了 ${totalChunks} 个 embeddings`);
  console.log('='.repeat(60) + '\n');

  const productResources = await prisma.resource.count({
    where: { type: 'product' }
  });
  console.log(`✅ Resource 表中有 ${productResources} 個商品紀錄`);

  const productEmbeddings = await prisma.embedding.count({
    where: {
      resource: { type: 'product' }
    }
  });
  console.log(`✅ Embedding 表中有 ${productEmbeddings} 個商品相關的 embeddings`);
  console.log('');
}

importProducts()
  .catch((error) => {
    console.error('💥 導入過程出錯:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

