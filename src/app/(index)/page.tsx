import Hero from "./components/hero";
import Cm from "./components/cm";
import Features from "./components/features";
import Ranking from "./components/ranking";
import About from "./components/about";
import News from "./components/news";

export default function Home() {
  return (
    <>
      <Hero />
      <Cm />
      <Features />
      <Ranking />
      <About />
      <News />
    </>
  );
}
