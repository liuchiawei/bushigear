export default function SectionHeader({
  title_en,
  title_jp,
  description,
  reverse = false,
}: {
  title_en: string;
  title_jp: string;
  description?: string;
  reverse?: boolean;
}) {
  return (
    <div className="w-full overflow-hidden">
      <h2 className="text-sm md:text-lg font-sans font-[300] text-neutral-400 leading-none">
        {title_jp}
      </h2>
      <div
        className={`flex flex-col justify-between ${reverse ? "md:flex-row-reverse" : "md:flex-row"
          }`}
      >
        <h1
          className={`w-full font-roboto font-[900] text-foreground uppercase leading-none tracking-tight mb-18 ${reverse ? "md:text-right" : ""
            }
          ${title_en.length > 6
              ? "text-[84px] md:text-[14vw]"
              : "text-[120px] md:text-[15vw]"
            }`}
        >
          {title_en}
        </h1>
        {description && (
          <p className="self-end md:self-start w-1/4 md:w-[10%] my-2 md:my-6 text-xs md:text-sm font-robot font-[300] text-neutral-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
