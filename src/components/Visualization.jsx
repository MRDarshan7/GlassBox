import { motion } from "framer-motion";
import { reveal, viewportOnce } from "../lib/motion";
import GlassBox from "./GlassBox";

export default function Visualization() {
  return (
    <section id="visualization" className="scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32">
      <motion.div
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mx-auto w-full max-w-5xl"
      >
        <p className="text-xs font-medium uppercase tracking-widest text-accent/80">
          The demo
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Look inside the box
        </h2>
        <p className="mt-3 max-w-2xl text-slate-400">
          A small language model runs entirely in your browser. Nothing you type
          leaves this page.
        </p>
        <div className="mt-8">
          <GlassBox />
        </div>
      </motion.div>
    </section>
  );
}
