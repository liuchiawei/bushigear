import prisma from '../src/lib/prisma';

async function clearProductEmbeddings() {
  console.log('🗑️  開始清理商品的 embeddings...\n');

  try {
    // 1. 删除所有商品相关的 embeddings（通过 Resource 的 cascade 删除）
    const deletedResources = await prisma.resource.deleteMany({
      where: {
        type: 'product'
      }
    });

    console.log(`✅ 已刪除 ${deletedResources.count} 個商品 Resource 記錄`);
    console.log('✅ 相關的 Embeddings 也已自動刪除（cascade）\n');
    
    const remainingResources = await prisma.resource.count({
      where: { type: 'product' }
    });
    
    const remainingEmbeddings = await prisma.embedding.count({
      where: {
        resource: { type: 'product' }
      }
    });

    console.log('📊 驗證結果：');
    console.log(`  - 剩餘商品 Resource: ${remainingResources}`);
    console.log(`  - 剩餘商品 Embedding: ${remainingEmbeddings}`);
    
    if (remainingResources === 0 && remainingEmbeddings === 0) {
      console.log('\n✅ 清理完成！可以重新導入商品數據了。');
    } else {
      console.warn('\n⚠️ 警告：仍有剩余数据');
    }
    
  } catch (error) {
    console.error('❌ 清理失敗:', error);
    throw error;
  }
}

clearProductEmbeddings()
  .catch((error) => {
    console.error('💥 清理過程出錯:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

