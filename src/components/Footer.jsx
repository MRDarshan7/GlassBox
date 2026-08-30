const KEYWORDS = [
  "tokenization",
  "attention",
  "probabilities",
  "temperature",
  "entropy",
  "next word",
];

const SHAPES = ["●", "▲", "■"];

function MarqueeRow() {
  return (
    <span className="inline-flex items-center">
      {KEYWORDS.map((word, i) => (
        <span key={word} className="inline-flex items-center">
          <span className="mx-5 font-display text-sm font-extrabold uppercase tracking-widest text-ink">
            {word}
          </span>
          <span aria-hidden="true" className="text-xs text-ink/60">
            {SHAPES[i % SHAPES.length]}
          </span>
        </span>
      ))}
    </span>
  );
}

export default function Footer() {
  return (
    <footer>
      <div className="overflow-hidden border-y-2 border-ink bg-amber py-3">
        <div className="marquee-track flex w-max whitespace-nowrap">
          <MarqueeRow />
          <MarqueeRow />
          <MarqueeRow />
          <MarqueeRow />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-10 text-center">
        <p className="text-xs font-medium leading-relaxed text-slate-500 sm:text-sm">
          Built by The Outliers · Prompt-engineered with Claude Code · Model
          runs entirely in your browser
        </p>
        <p className="mt-3 text-xs font-medium leading-relaxed tracking-wide text-slate-500 sm:text-sm">
          M R Darshan<span className="mx-2.5">·</span>Tarun A
          <span className="mx-2.5">·</span>Akash S
        </p>
        <p className="mt-1 text-[11px] font-medium leading-relaxed text-slate-500 sm:text-xs">
          Sri Krishna College of Technology
        </p>
      </div>
    </footer>
  );
}
