export default function Header({ Category }: { Category: string }) {
  const category_jp =
    Category == "glove"
      ? "グローブ"
      : Category == "mitt"
      ? "ミット"
      : Category == "protector"
      ? "プロテクター"
      : "シャツ";
  return (
    <header className="w-full relative select-none overflow-hidden flex justify-center items-center">
      <h1 className="text-[180px] md:text-[270px] lg:text-[360px] font-roboto font-[900] text-center uppercase leading-none tracking-[-0.08em]">
        {Category}
      </h1>
      <h6 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg md:text-5xl font-calligraphy text-accent leading-none tracking-widest rotate-[-20deg]">
        {category_jp}
      </h6>
    </header>
  );
}
