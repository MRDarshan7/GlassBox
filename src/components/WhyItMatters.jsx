import { motion } from "framer-motion";
import { reveal, stagger, viewportOnce } from "../lib/motion";

const points = [
  {
    number: "01",
    title: "Trust",
    body: "Seeing the process builds calibrated trust — you learn what the model actually does instead of imagining a mind behind the words.",
  },
  {
    number: "02",
    title: "Bias",
    body: "Probabilities are learned from data. Watching them shift shows where the training data leans — and where bias quietly slips into the output.",
  },
  {
    number: "03",
    title: "Knowing when not to trust",
    body: "When the top choices are nearly tied, the model is guessing. Visible uncertainty tells you exactly when to double-check the answer.",
  },
];

export default function WhyItMatters() {
  return (
    <section id="why" className="scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <p className="text-xs font-medium uppercase tracking-widest text-accent/80">
            Beyond the demo
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Why it matters
          </h2>
        </motion.div>

        <motion.ul
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-10 max-w-3xl divide-y divide-white/5"
        >
          {points.map((point) => (
            <motion.li
              key={point.number}
              variants={reveal}
              className="flex gap-5 py-7 first:pt-0 last:pb-0 sm:gap-8"
            >
              <span className="pt-0.5 text-sm font-semibold tabular-nums text-accent/70">
                {point.number}
              </span>
              <div>
                <h3 className="text-base font-semibold text-white sm:text-lg">
                  {point.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400 sm:text-base">
                  {point.body}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
