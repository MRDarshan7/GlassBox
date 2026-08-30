import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { CANDY_BTN, Squiggle } from "./ui";

const DOTS = {
  backgroundImage: "radial-gradient(#E2E8F0 2px, transparent 2px)",
  backgroundSize: "22px 22px",
};

function HeroContent() {
  return (
    <div className="relative mx-auto max-w-4xl px-4 text-center">
      {/* massive amber circle behind the headline */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-amber sm:h-[26rem] sm:w-[26rem]"
      />
      {/* confetti */}
      <div
        aria-hidden="true"
        className="absolute -left-2 -top-6 hidden h-6 w-6 rotate-12 rounded-md border-2 border-ink bg-mint sm:block"
      />
      <div
        aria-hidden="true"
        className="absolute -right-8 top-8 hidden h-5 w-5 rounded-full border-2 border-ink bg-pink sm:block"
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 24 22"
        className="absolute -bottom-10 left-6 hidden h-6 w-6 -rotate-12 sm:block"
      >
        <path
          d="M12 2 22 20 H2 Z"
          fill="#8B5CF6"
          stroke="#1E293B"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>

      <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-6xl lg:text-7xl">
        Every word an{" "}
        <span className="mx-1 inline-block -rotate-2 rounded-xl border-2 border-ink bg-accent px-3 text-white shadow-[3px_3px_0_0_#1E293B]">
          AI
        </span>{" "}
        writes is the end of an{" "}
        <span className="relative inline-block">
          invisible
          <Squiggle className="absolute -bottom-2 left-0 h-3 w-full" />
        </span>{" "}
        process.
      </h1>

      <p className="mx-auto mt-8 max-w-xl text-base font-semibold text-ink/80 sm:text-lg">
        GlassBox opens the black box. Type a sentence and watch a language
        model decide what comes next.
      </p>

      <div className="mt-10">
        <a href="#visualization" className={`${CANDY_BTN} px-8 py-3.5 text-base`}>
          Open the box
        </a>
      </div>
    </div>
  );
}

// The hero is an "opening box": two flat paper panels meet at the centre and
// slide apart as the user scrolls (bound to scroll position, so it reverses
// on scroll up). Under prefers-reduced-motion it renders already open.
export default function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const xLeft = useTransform(scrollYProgress, [0.05, 0.7], ["0%", "-104%"]);
  const xRight = useTransform(scrollYProgress, [0.05, 0.7], ["0%", "104%"]);
  const claspOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  if (reduce) {
    return (
      <section
        id="top"
        ref={ref}
        className="flex min-h-svh items-center justify-center overflow-hidden pt-16"
      >
        <HeroContent />
      </section>
    );
  }

  return (
    <section id="top" ref={ref} className="relative h-[190vh]">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden pt-16">
        <HeroContent />

        {/* left panel */}
        <motion.div
          aria-hidden="true"
          style={{ x: xLeft }}
          className="absolute inset-y-0 left-0 z-20 w-1/2 border-r-4 border-ink bg-paper"
        >
          <div className="absolute inset-0" style={DOTS} />
          <div className="absolute -left-16 bottom-16 h-44 w-44 rounded-full border-2 border-ink bg-amber" />
          <div className="absolute left-10 top-24 h-6 w-6 rotate-12 rounded-md border-2 border-ink bg-mint" />
        </motion.div>

        {/* right panel */}
        <motion.div
          aria-hidden="true"
          style={{ x: xRight }}
          className="absolute inset-y-0 right-0 z-20 w-1/2 border-l-4 border-ink bg-paper"
        >
          <div className="absolute inset-0" style={DOTS} />
          <div className="absolute -right-12 top-20 h-36 w-36 rotate-12 rounded-3xl border-2 border-ink bg-pink" />
          <div className="absolute bottom-28 right-16 h-5 w-5 rounded-full border-2 border-ink bg-accent" />
        </motion.div>

        {/* clasp + hint, fades as the box opens */}
        <motion.div
          style={{ opacity: claspOpacity }}
          className="pointer-events-none absolute left-1/2 top-1/2 z-30 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4"
        >
          <div className="grid h-20 w-20 place-items-center rounded-full border-2 border-ink bg-accent shadow-[4px_4px_0_0_#1E293B]">
            <svg viewBox="0 0 24 24" fill="none" className="h-9 w-9">
              <rect
                x="4"
                y="8"
                width="16"
                height="12"
                rx="2"
                stroke="#fff"
                strokeWidth="2.5"
              />
              <path
                d="M4 8l2-4h12l2 4M12 8v12"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="rounded-full border-2 border-ink bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-ink shadow-[3px_3px_0_0_#1E293B]">
            scroll to open the box
          </div>
          <motion.svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="#1E293B"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.div>
      </div>
    </section>
  );
}
