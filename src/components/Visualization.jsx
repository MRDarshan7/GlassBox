import { motion } from "framer-motion";
import { reveal, viewportOnce } from "../lib/motion";
import { SectionHeading } from "./ui";
import GlassBox from "./GlassBox";

export default function Visualization() {
  return (
    <section id="visualization" className="relative scroll-mt-20 px-4 py-24 sm:px-6">
      {/* confetti */}
      <div
        aria-hidden="true"
        className="absolute right-10 top-16 hidden h-6 w-6 rotate-12 rounded-md border-2 border-ink bg-amber lg:block"
      />
      <motion.div
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mx-auto w-full max-w-6xl"
      >
        <SectionHeading
          kicker="The demo"
          kickerColor="bg-accent"
          title="Look inside the box"
          sub="A small language model runs entirely in your browser. Nothing you type leaves this page."
        />
        <div className="mt-10">
          <GlassBox />
        </div>
      </motion.div>
    </section>
  );
}
