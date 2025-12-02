import prisma from "@/lib/prisma";
import Grid from "@/components/common/Grid";
import { Product } from "@/lib/type";
import Header from "./components/layout/Header";

export const revalidate = 60;

export default async function Products() {
  const products = await prisma.product.findMany({
    orderBy: { id: "asc" },
  });

  return (
    <div className="w-full py-16 flex flex-col items-center justify-center gap-6">
      <Header />
      <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 border-t border-l">
        {products.map((product: Product) => (
          <Grid key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
