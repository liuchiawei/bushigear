export default function SectionHeaderNews({
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
      <div className="flex justify-end items-start">
        <div className="flex items-start gap-4">
          {/* Vertical Japanese text */}
          <div className="flex flex-col justify-start">
            {title_jp.split('').map((char, index) => (
              <span
                key={index}
                className="text-sm md:text-lg font-sans font-[300] text-foreground leading-none"
                style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
              >
                {char}
              </span>
            ))}
          </div>

          {/* Large English title */}
          <h1
            className={`font-roboto font-[900] text-foreground uppercase leading-none tracking-tight ${reverse ? "md:text-right" : ""
              }
            ${title_en.length > 6
                ? "text-[84px] md:text-[14vw]"
                : "text-[120px] md:text-[15vw]"
              }`}
          >
            {title_en}
          </h1>
        </div>
      </div>

      {description && (
        <p className="mt-4 text-xs md:text-sm font-robot font-[300] text-neutral-400 text-right">
          {description}
        </p>
      )}
    </div>
  );
}
