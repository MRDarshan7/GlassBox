// Shared "Playful Geometric" primitives: squiggles, section headings and the
// candy/secondary button class strings used across the site.

const BOUNCE = "ease-[cubic-bezier(0.34,1.56,0.64,1)]";

export const CANDY_BTN = `inline-block rounded-full border-2 border-ink bg-accent px-6 py-2.5 text-sm font-bold text-white shadow-[4px_4px_0_0_#1E293B] transition-all duration-300 ${BOUNCE} hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#1E293B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_#1E293B] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_0_#1E293B]`;

export const OUTLINE_BTN = `inline-block rounded-full border-2 border-ink bg-white px-5 py-2.5 text-sm font-bold text-ink transition-all duration-300 ${BOUNCE} hover:bg-amber active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white`;

export const SUBTLE_BTN = `inline-block rounded-full border-2 border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-500 transition-all duration-300 ${BOUNCE} hover:border-ink hover:text-ink active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40`;

export function Squiggle({ className = "", stroke = "#F472B6" }) {
  return (
    <svg
      viewBox="0 0 140 12"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="none"
      className={className}
    >
      <path
        d="M2 8 Q 12 2 22 8 T 42 8 T 62 8 T 82 8 T 102 8 T 122 8 T 138 8"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SectionHeading({ kicker, kickerColor = "bg-accent", title, sub }) {
  return (
    <div>
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
        <span
          aria-hidden="true"
          className={`inline-block h-3 w-3 rotate-12 rounded-[3px] border-2 border-ink ${kickerColor}`}
        />
        {kicker}
      </p>
      <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      <Squiggle className="mt-2 h-3 w-36" />
      {sub && (
        <p className="mt-4 max-w-2xl font-medium text-slate-500">{sub}</p>
      )}
    </div>
  );
}
