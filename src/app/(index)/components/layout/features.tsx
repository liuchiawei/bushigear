import SectionHeader from "../common/SectionHeader";
import FeatureCarousel from "../common/FeatureCarousel";
import content from "@/data/content.json";

export default function Features() {
  return (
    <section className="w-full max-w-5xl mx-auto py-4">
      <SectionHeader
        title_en={content.home.features.section_info.title.en}
        title_jp={content.home.features.section_info.title.jp}
        description={content.home.features.section_info.description.jp}
      />
      <FeatureCarousel />
    </section>
  );
}
