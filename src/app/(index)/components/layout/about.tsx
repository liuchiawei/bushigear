import content from "@/data/content.json";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-screen bg-black text-white" style={{ backgroundImage: `url(/images/top_bg_03.jpg)` }}>
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
    </div>
  );
}