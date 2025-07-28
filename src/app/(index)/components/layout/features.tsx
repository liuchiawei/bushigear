export default function Features() {
  return (
    <div className="p-10 bg-cover bg-center" style={{ backgroundImage: `url(/images/glove_area_bg.jpg)` }}>
      <h1 className="my-6 text-3xl font-bold text-center">
        おすすめ商品
      </h1>
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-7xl h-full mx-auto p-6">
        <div className="bg-gray-400 w-full h-96" />
        <div className="bg-gray-400 w-full h-96" />
        <div className="bg-gray-400 w-full h-96" />
        <div className="bg-gray-400 w-full h-96" />
      </div>
    </div>
  );
}