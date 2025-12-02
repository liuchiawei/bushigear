import Image from "next/image";
import content from "@/data/content.json";

export default function AboutPage() {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center gap-12">
      {/* Main Content */}
      {/* Title Section */}
      <div className="text-center relative">
        <h1 className="font-roboto font-[900] text-foreground uppercase leading-none tracking-tight text-[84px] md:text-[14vw]">
          ABOUT
        </h1>
        <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-600 text-lg font-medium -rotate-12 whitespace-nowrap">
          {content.about.title}
        </p>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto space-y-12">
        {/* First Text Block */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-black">
              {content.about.catchcopy}
            </h2>
            <p className="text-xl font-bold text-black">
              {content.about.catchcopy_en}
            </p>
          </div>

          <div className="space-y-6 text-base leading-relaxed max-w-2xl mx-auto">
            <p className="text-left">{content.about.description}</p>
            <p className="text-left">{content.about.brand_story_jp}</p>
          </div>
        </div>

        {/* Logo Section */}
        <div className="flex justify-center ">
          <div className="w-70 h-70 flex items-center justify-center">
            <Image
              src="/logo/logo_white.svg"
              alt="logo"
              width={200}
              height={80}
              className="text-white"
            />
          </div>
        </div>

        {/* Second Text Block */}
        <div className="space-y-6 text-base leading-relaxed max-w-2xl mx-auto">
          <p className="text-left">{content.about.logo_concept}</p>
        </div>
      </div>
    </div>
  );
}
