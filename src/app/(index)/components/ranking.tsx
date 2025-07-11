export default function Ranking() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-3 w-full max-w-7xl h-full min-h-screen mx-auto p-6">
      <div className="w-full">
        <h1 className="text-xl font-bold mb-4">
          カテゴリーランキング
        </h1>
        <ul className="flex flex-col gap-2 [&_li]:py-2 [&_li]:px-4 [&_li]:border [&_li]:rounded-full [&_li]:border-gray-300 [&_li]:text-lg [&_li]:font-bold [&_li]:cursor-pointer [&_li]:hover:bg-gray-900 [&_li]:hover:text-white">
          <li>グローブ</li>
          <li>ミット</li>
          <li>プロテクター</li>
          <li>サポーター</li>
        </ul>
      </div>
      <div className="bg-gray-200 w-full h-96">
      </div>
    </div>
  );
}