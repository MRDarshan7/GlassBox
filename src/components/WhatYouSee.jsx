import { motion } from "framer-motion";
import { reveal, stagger, viewportOnce } from "../lib/motion";
import { SectionHeading } from "./ui";

const cards = [
  {
    title: "Tokenization",
    color: "bg-accent",
    shadow: "shadow-[4px_4px_0_0_#E2E8F0] sm:shadow-[8px_8px_0_0_#E2E8F0]",
    body: "Before a model can read your sentence, it chops the text into small pieces called tokens — whole words, word fragments, even punctuation. Everything the model does next happens to those pieces, not to your original words.",
    glyph: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <rect x="2" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="10" y="9" width="4" height="6" rx="1.5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="16" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Attention",
    color: "bg-pink",
    shadow: "shadow-[4px_4px_0_0_#FBCFE8] sm:shadow-[8px_8px_0_0_#FBCFE8]",
    body: "For every token, the model asks: which earlier words matter right now? Attention is the scoring system that lets a word like “it” look back at “the cat” and borrow meaning from it.",
    glyph: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <circle cx="5" cy="18" r="2" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="12" cy="6" r="2" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="19" cy="18" r="2" stroke="currentColor" strokeWidth="2.5" />
        <path d="M6.3 16.4 10.7 7.8M13.3 7.8l4.4 8.6M7 18h10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Next-word probabilities",
    color: "bg-amber",
    shadow: "shadow-[4px_4px_0_0_#FDE68A] sm:shadow-[8px_8px_0_0_#FDE68A]",
    body: "The model never picks just one word — it gives a probability to every word it knows. The reply you see is simply the top of a very long, invisible ranking.",
    glyph: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path d="M4 20V10M10 20V4M16 20v-6M22 20v-3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function WhatYouSee() {
  return (
    <section id="seeing" className="relative scroll-mt-20 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <SectionHeading
            kicker="The invisible steps"
            kickerColor="bg-pink"
            title="What you’re seeing"
          />
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {/* dashed connector behind the cards */}
          <div
            aria-hidden="true"
            className="absolute -top-6 left-8 right-8 hidden border-t-2 border-dashed border-slate-300 lg:block"
          />
          {cards.map((card) => (
            <motion.div
              key={card.title}
              variants={reveal}
              whileHover={{ rotate: -1, scale: 1.02 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
              className={`group relative rounded-2xl border-2 border-ink bg-white p-6 pt-10 ${card.shadow} sm:p-7 sm:pt-10`}
            >
              <div
                className={`absolute -top-6 left-6 grid h-12 w-12 place-items-center rounded-full border-2 border-ink text-white group-hover:animate-[wiggle_0.4s_ease-in-out] ${card.color} ${
                  card.color === "bg-amber" ? "text-ink" : "text-white"
                }`}
              >
                {card.glyph}
              </div>
              <h3 className="font-display text-lg font-bold text-ink">
                {card.title}
              </h3>
              <p className="mt-2.5 text-sm font-medium leading-relaxed text-slate-500">
                {card.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
