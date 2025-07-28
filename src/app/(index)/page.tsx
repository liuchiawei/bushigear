import Hero from "./components/layout/hero";
import Cm from "./components/layout/cm";
import Sales from "./components/layout/sales";
import Features from "./components/layout/features";
import Ranking from "./components/layout/ranking";
import About from "./components/layout/about";
import News from "./components/layout/news";

export default function Home() {
  return (
    <>
      <Hero />
      <Cm />
      <Sales />
      <Features />
      <Ranking />
      <About />
      <News />
    </>
  );
}
