export default function Cm() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-7xl h-full min-h-screen mx-auto p-6">
      <div className="bg-gray-200 row-span-1 md:row-span-2 col-span-2 md:col-span-1" >
        <div className="flex flex-col items-center justify-center w-full h-full">
          <h1 className="text-3xl font-bold text-center uppercase">
            情報CMエリア
          </h1>
        </div>
      </div>
      <div className="bg-gray-200" />
      <div className="bg-gray-200" />
      <div className="bg-gray-200 col-span-1 md:col-span-2" />
    </div>
  );
}