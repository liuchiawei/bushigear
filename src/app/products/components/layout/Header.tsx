export default function Header() {
  return (
    <header className="w-full relative select-none overflow-hidden flex justify-center items-center">
      <h1 className="text-[120px] md:text-[210px] lg:text-[300px] font-roboto font-[900] text-center uppercase leading-none tracking-[-0.08em]">
        Products
      </h1>
      <h6 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg md:text-5xl font-calligraphy text-accent leading-none tracking-widest rotate-[-20deg]">
        商品一覧
      </h6>
    </header>
  );
}
