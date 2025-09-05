"use client"

import content from "@/data/content.json";

export default function Ranking() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-3 w-full max-w-7xl h-full min-h-screen mx-auto p-6">
      <div className="w-full md:w-1/3">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-2xl font-bold uppercase">
            {content.home.ranking.title}
          </h1>
          <p className="text-sm text-gray-500">
            {content.home.ranking.description}
          </p>
        </div>
        <ul className="flex flex-col gap-2 [&_li]:py-2 [&_li]:px-4 [&_li]:border [&_li]:rounded-full [&_li]:border-gray-300 [&_li]:text-lg [&_li]:font-bold [&_li]:cursor-pointer [&_li]:hover:bg-gray-900 [&_li]:hover:text-white">
          {content.home.ranking.categories.map((category) => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-200 w-full h-96">
      </div>
    </div>
  );
}