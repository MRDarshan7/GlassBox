import { motion } from "framer-motion";
import { reveal, stagger, viewportOnce } from "../lib/motion";

const cards = [
  {
    title: "Tokenization",
    body: "Before a model can read your sentence, it chops the text into small pieces called tokens — whole words, word fragments, even punctuation. Everything the model does next happens to those pieces, not to your original words.",
    glyph: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <rect x="2" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="9" width="4" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="16" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Attention",
    body: "For every token, the model asks: which earlier words matter right now? Attention is the scoring system that lets a word like “it” look back at “the cat” and borrow meaning from it.",
    glyph: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <circle cx="5" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="19" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6.3 16.4 10.7 7.8M13.3 7.8l4.4 8.6M7 18h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Next-word probabilities",
    body: "The model never picks just one word — it gives a probability to every word it knows. The reply you see is simply the top of a very long, invisible ranking.",
    glyph: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path d="M4 20V10M10 20V4M16 20v-6M22 20v-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function WhatYouSee() {
  return (
    <section id="seeing" className="scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <p className="text-xs font-medium uppercase tracking-widest text-accent/80">
            The invisible steps
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            What you&rsquo;re seeing
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {cards.map((card) => (
            <motion.div
              key={card.title}
              variants={reveal}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md transition-[border-color,box-shadow] duration-300 hover:border-accent/30 hover:shadow-[0_8px_40px_rgba(34,211,238,0.08)] sm:p-7"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-accent">
                {card.glyph}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">
                {card.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-400">
                {card.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
