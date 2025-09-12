import content from "@/data/content.json";
import prisma from "@/lib/prisma";
import Grid from "./components/Grid";
import { Product } from "@/lib/type";

export const revalidate = 60;

export default async function Products() {
  const products = await prisma.product.findMany({
    orderBy: { id: "asc" },
  });

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-6">
      <div className="w-full max-w-8xl mx-auto text-center">
        <div className="mb-6">
          <img
            src="/images/top_bg_01.jpg"
            alt="products"
            className="w-full max-w-7xl mx-auto mt-15"
          />
        </div>
        <h1 className="text-3xl font-bold text-center">
          {content.products.title}
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
