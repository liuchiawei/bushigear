import content from "@/data/content.json";
import SectionHeader from "../common/SectionHeader";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 md:px-0 py-4">
      <SectionHeader
        title_en={content.home.about.section_info.title.en}
        title_jp={content.home.about.section_info.title.jp}
      />
      <div className="w-full max-w-xl h-full mx-auto flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-center">
          {content.home.about.title}
        </h1>
        <p className="text-sm text-justify mb-6">
          {content.home.about.description}
        </p>
        <Button className="font-bold text-sm text-black rounded-none" variant="outline" asChild>
          <Link href="/about">
            {content.home.about.button}
          </Link>
        </Button>
      </div>
    </section>
  );
}