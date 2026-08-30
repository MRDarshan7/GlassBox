import { motion } from "framer-motion";
import { reveal, stagger, viewportOnce } from "../lib/motion";
import { SectionHeading } from "./ui";

const points = [
  {
    number: "01",
    color: "bg-accent text-white",
    title: "Trust",
    body: "Seeing the process builds calibrated trust — you learn what the model actually does instead of imagining a mind behind the words.",
  },
  {
    number: "02",
    color: "bg-pink text-white",
    title: "Bias",
    body: "Probabilities are learned from data. Watching them shift shows where the training data leans — and where bias quietly slips into the output.",
  },
  {
    number: "03",
    color: "bg-mint text-ink",
    title: "Knowing when not to trust",
    body: "When the top choices are nearly tied, the model is guessing. Visible uncertainty tells you exactly when to double-check the answer.",
  },
];

export default function WhyItMatters() {
  return (
    <section id="why" className="scroll-mt-20 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <SectionHeading
            kicker="Beyond the demo"
            kickerColor="bg-mint"
            title="Why it matters"
          />
        </motion.div>

        <motion.ul
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-10 max-w-3xl"
        >
          {points.map((point) => (
            <motion.li
              key={point.number}
              variants={reveal}
              className="flex gap-5 border-b-2 border-dashed border-slate-200 py-7 first:pt-0 last:border-b-0 last:pb-0 sm:gap-7"
            >
              <span
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-ink font-display text-sm font-extrabold shadow-[3px_3px_0_0_#1E293B] ${point.color}`}
              >
                {point.number}
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-ink sm:text-lg">
                  {point.title}
                </h3>
                <p className="mt-1.5 text-sm font-medium leading-relaxed text-slate-500 sm:text-base">
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
