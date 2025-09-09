import content from "@/data/content.json";
import prisma from "@/lib/prisma";
import Grid from "./components/Grid";

export const revalidate = 60;

export default async function Products() {
  const products = await prisma.product.findMany({
    orderBy: { id: "asc" },
  });

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-6">
      <div className="w-full max-w-6xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-center">
          {content.products.title}
        </h1>
        <p className="w-full max-w-lg mx-auto text-sm text-gray-500 text-justify">
          {content.products.description}
        </p>
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {products.map((product) => {
          return (
            <Grid key={product.id} product={product} />
          );
        })}
      </div>
    </div>
  );
}
