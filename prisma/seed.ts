import { PrismaClient } from '../src/generated/prisma';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

type ProductJson = {
  id: number;
  name: { en: string; jp: string; cn: string };
  category: string;
  brand: string;
  price: number;
  image: string;
  description: { en: string; jp: string; cn: string };
};

async function main() {
  const jsonPath = path.resolve(__dirname, '../src/data/products.json');
  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const products: ProductJson[] = JSON.parse(raw);

  await prisma.product.deleteMany();

  const res = await prisma.product.createMany({
    data: products.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      brand: p.brand,
      price: p.price,
      image: p.image,
      description: p.description,
    })),
    skipDuplicates: true,
  });

  console.log(`✅ Seed completed: inserted ${res.count} products`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
