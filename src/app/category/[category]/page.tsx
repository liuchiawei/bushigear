import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Product } from "@/lib/type";
import Grid from "@/components/common/Grid";
import Header from "./components/layout/Header";

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
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-6 pb-16">
      {Category && <Header Category={Category} />}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 border-t border-l">
        {products.map((product: Product) => (
          <Grid key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
