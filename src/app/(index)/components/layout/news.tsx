import SectionHeader from "../common/SectionHeader";
import content from "@/data/content.json";

export default function News() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 md:px-0 py-4">
      <SectionHeader
        title_en={content.home.news.section_info.title.en}
        title_jp={content.home.news.section_info.title.jp}
        reverse={true}
      />
      <ul className="flex flex-col gap-2 text-lg [&_li]:flex [&_li]:gap-6 ">
        <li>
          <span>2025/07/11</span>
          <span>News 1</span>
          <span>
            內容... <a href="#">more</a>
          </span>
        </li>
        <li>
          <span>2025/07/10</span>
          <span>News 2</span>
          <span>
            內容... <a href="#">more</a>
          </span>
        </li>
        <li>
          <span>2025/07/09</span>
          <span>News 3</span>
          <span>
            內容... <a href="#">more</a>
          </span>
        </li>
      </ul>
    </section>
  );
}
