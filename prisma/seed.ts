// TODO: Delete this file before production
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  // 既存のデータを削除
  await prisma.product.deleteMany();
  // 新しいデータを挿入
  const whiteGlove = await prisma.product.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name_en: "White Glove",
      name_jp: "白グローブ",
      name_cn: "白色拳套",
      category: "グローブ",
      brand: "ブランド1",
      price: 2000,
      image: "/images/glove_01.jpg",
      description_en: "Product 1 description",
      description_jp: "商品1の説明",
      description_cn: "商品1の説明",
    },
  });
  // シード処理が完了したことを日本語で表示
  console.log(`✅ シードが完了しました：${whiteGlove.name_jp}をデータベースに挿入しました`);
  const blackGlove = await prisma.product.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name_en: "Black Glove",
      name_jp: "黒グローブ",
      name_cn: "黒色拳套",
      category: "グローブ",
      brand: "ブランド2",
      price: 2000,
      image: "/images/glove_02.jpg",
      description_en: "Product 2 description",
      description_jp: "商品2の説明",
      description_cn: "商品2の説明",
    },
  });
  console.log(`✅ シードが完了しました：${blackGlove.name_jp}をデータベースに挿入しました`);
  const redGlove = await prisma.product.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name_en: "Red Glove",
      name_jp: "赤グローブ",
      name_cn: "赤色拳套",
      category: "グローブ",
      brand: "ブランド3",
      price: 2000,
      image: "/images/glove_03.jpg",
      description_en: "Product 3 description",
      description_jp: "商品3の説明",
      description_cn: "商品3の説明",
    },
  });
  console.log(`✅ シードが完了しました：${redGlove.name_jp}をデータベースに挿入しました`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
