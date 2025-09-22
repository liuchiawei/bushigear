import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Product } from "@/lib/type";
import Grid from "@/components/common/Grid";

export const revalidate = 60;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const Category = category;
  if (!Category) notFound();

  const products = await prisma.product.findMany({
    where: { category: Category },
  });
  if (!products) notFound();

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-6">
      <div className="w-full max-w-8xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-center">
          Category: {Category}
        </h1>
      </div>
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product: Product) => (
          <Grid key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
