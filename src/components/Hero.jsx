import { motion } from "framer-motion";
import { EASE } from "../lib/motion";

const HEADLINE = "Every word an AI writes is the end of an invisible process.";
const words = HEADLINE.split(" ");

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
};

const word = {
  hidden: { opacity: 0, y: "0.5em" },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const lateFade = (delay) => ({
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay } },
});

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 pt-14 text-center sm:px-6 sm:pt-16"
    >
      {/* Soft radial cyan glow behind the headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[30rem] w-[90vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.14),transparent_70%)] blur-2xl"
      />

      <motion.div variants={container} initial="hidden" animate="show">
        <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          {words.map((w, i) => (
            <motion.span
              key={i}
              variants={word}
              className="mr-[0.27em] inline-block will-change-transform"
            >
              {w}
            </motion.span>
          ))}
        </h1>
      </motion.div>

      <motion.p
        variants={lateFade(words.length * 0.07 + 0.35)}
        initial="hidden"
        animate="show"
        className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-slate-400 sm:text-lg"
      >
        GlassBox opens the black box. Type a sentence and watch a language model
        decide what comes next.
      </motion.p>

      <motion.div
        variants={lateFade(words.length * 0.07 + 0.55)}
        initial="hidden"
        animate="show"
        className="mt-10"
      >
        <motion.a
          href="#visualization"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2, ease: EASE }}
          className="inline-block rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-ink shadow-[0_0_30px_rgba(34,211,238,0.35)] transition-shadow duration-300 hover:shadow-[0_0_45px_rgba(34,211,238,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:text-base"
        >
          Open the box
        </motion.a>
      </motion.div>
    </section>
  );
}
