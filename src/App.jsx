import { MotionConfig } from "framer-motion";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Visualization from "./components/Visualization";
import WhatYouSee from "./components/WhatYouSee";
import WhyItMatters from "./components/WhyItMatters";
import Footer from "./components/Footer";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Nav />
      <main>
        <Hero />
        <Visualization />
        <WhatYouSee />
        <WhyItMatters />
      </main>
      <Footer />
    </MotionConfig>
  );
}
