import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "../lib/motion";
import {
  attentionWeights,
  entropy,
  nextWordDistribution,
  sampleNextWord,
  tokenize,
  vocabHas,
} from "../lib/model";

// Chosen by ranking sentence-initial 3-word starts by the confidence of
// their continuations in the trained model.
const EXAMPLES = ["The model predicts", "The river flows", "The bus stops"];
const PUNCT = /^[.,?!]$/;
const CONTEXT_WINDOW = 12;
const MAX_TOKENS = 40;
const ARC_ROOM = 56; // vertical headroom above the chips for attention arcs

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const pct = (p) => (p >= 0.001 ? `${(p * 100).toFixed(1)}%` : "<0.1%");

function StageShell({ n, title, aside, lit, children }) {
  return (
    <section className="border-t border-white/5 pt-5">
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span
          className={`text-xs font-semibold tabular-nums transition-colors duration-300 ${
            lit
              ? "text-accent [text-shadow:0_0_8px_rgba(34,211,238,0.6)]"
              : "text-slate-600"
          }`}
        >
          {n}
        </span>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {aside && <span className="ml-auto text-xs text-slate-500">{aside}</span>}
      </div>
      {children}
    </section>
  );
}

function Btn({ children, variant = "primary", ...props }) {
  const styles = {
    primary:
      "bg-accent text-ink shadow-[0_0_18px_rgba(34,211,238,0.28)] hover:shadow-[0_0_26px_rgba(34,211,238,0.45)]",
    outline:
      "border border-accent/40 text-accent hover:border-accent/70 hover:bg-accent/10",
    subtle:
      "border border-white/10 text-slate-400 hover:border-white/25 hover:text-slate-200",
  };
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.2, ease: EASE }}
      className={`rounded-full px-4 py-2 text-xs font-semibold transition-[box-shadow,color,border-color,background-color] duration-200 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm ${styles[variant]}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

function TokenStage({ tokens, tokensKey, reduce, lit }) {
  return (
    <StageShell
      n="01"
      title="Tokenization"
      lit={lit}
      aside={`${tokens.length} token${tokens.length === 1 ? "" : "s"}`}
    >
      <div key={tokensKey} className="flex flex-wrap gap-2">
        {tokens.map((t, i) => (
          <motion.span
            key={`${i}-${t}`}
            initial={reduce ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: reduce ? 0 : Math.min(i, 20) * 0.06,
              duration: 0.3,
              ease: EASE,
            }}
            className={
              PUNCT.test(t)
                ? "rounded-lg border border-white/5 bg-white/[0.02] px-2.5 py-1 text-sm text-slate-500"
                : "rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1 text-sm text-slate-200"
            }
          >
            {t}
          </motion.span>
        ))}
      </div>
    </StageShell>
  );
}

// Attention over the last CONTEXT_WINDOW tokens only. Chips wrap onto
// multiple rows; arcs are drawn on an SVG overlay sized to the chip
// container, from each chip's measured position, above the chips.
function AttentionStage({ tokens, tokensKey, weights, truncated, delay, reduce, lit }) {
  const boxRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [hover, setHover] = useState(-1);

  const measure = useCallback(() => {
    const box = boxRef.current;
    if (!box) return;
    const boxRect = box.getBoundingClientRect();
    setPoints(
      [...box.querySelectorAll("[data-chip]")].map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left - boxRect.left + r.width / 2, y: r.top - boxRect.top };
      })
    );
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [tokensKey, measure]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const n = tokens.length;
  const maxW = weights.length ? Math.max(...weights) : 1;
  const strongest = weights.indexOf(maxW);
  const lastPt = points[n - 1];

  return (
    <StageShell
      n="02"
      title="Attention"
      lit={lit}
      aside={
        <span className="group relative cursor-help underline decoration-dotted decoration-white/25 underline-offset-2">
          context window: last {CONTEXT_WINDOW} tokens
          <span className="pointer-events-none absolute right-0 top-full z-20 mt-1.5 hidden w-60 rounded-md border border-white/10 bg-ink px-2.5 py-1.5 text-[11px] leading-snug text-slate-400 group-hover:block">
            Real models also see only a limited window of text.
          </span>
        </span>
      }
    >
      {n < 2 ? (
        <p className="text-sm text-slate-500">
          Attention needs at least two tokens — keep typing.
        </p>
      ) : (
        <div ref={boxRef} className="relative" style={{ paddingTop: ARC_ROOM }}>
          <svg
            key={`arcs-${tokensKey}`}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            {lastPt &&
              weights.map((w, i) => {
                const pt = points[i];
                if (!pt) return null;
                const rel = w / maxW;
                const lift = Math.min(20 + Math.abs(lastPt.x - pt.x) * 0.15, 52);
                const cy = Math.max(Math.min(lastPt.y, pt.y) - lift, 6);
                return (
                  <motion.path
                    key={i}
                    d={`M ${lastPt.x} ${lastPt.y - 2} Q ${(lastPt.x + pt.x) / 2} ${cy} ${pt.x} ${pt.y - 2}`}
                    fill="none"
                    stroke="#22D3EE"
                    strokeWidth={1 + 4 * rel}
                    strokeLinecap="round"
                    style={{ opacity: 0.15 + 0.85 * rel }}
                    initial={reduce ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      delay: reduce ? 0 : delay + i * 0.06,
                      duration: 0.5,
                      ease: EASE,
                    }}
                  />
                );
              })}
          </svg>
          <div className="flex flex-wrap gap-2">
            {truncated && (
              <span className="rounded-lg border border-white/5 bg-white/[0.02] px-2.5 py-1 text-sm text-slate-600">
                …
              </span>
            )}
            {tokens.map((t, i) => {
              const isLast = i === n - 1;
              const isStrong = i === strongest;
              let cls =
                "relative rounded-lg border px-2.5 py-1 text-sm transition-shadow duration-300 ";
              if (isLast) {
                cls += "border-accent/60 bg-accent/10 text-accent";
              } else if (isStrong) {
                cls +=
                  "border-accent/50 bg-white/[0.05] text-white shadow-[0_0_16px_rgba(34,211,238,0.35)]";
              } else if (PUNCT.test(t)) {
                cls += "border-white/5 bg-white/[0.02] text-slate-500";
              } else {
                cls += "border-white/10 bg-white/[0.05] text-slate-300";
              }
              return (
                <span
                  key={`${i}-${t}`}
                  data-chip
                  className={cls}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(-1)}
                >
                  {t}
                  {hover === i && !isLast && weights[i] != null && (
                    <span className="absolute -top-7 left-1/2 z-10 -translate-x-1/2 rounded-md border border-white/10 bg-ink px-1.5 py-0.5 text-[10px] tabular-nums text-accent">
                      {(weights[i] * 100).toFixed(0)}%
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      )}
      <p className="mt-3 text-[11px] italic text-slate-500">
        Illustrative attention — a simplified stand-in for real transformer
        attention.
      </p>
    </StageShell>
  );
}

function UncertaintyGauge({ value, delay, reduce }) {
  const R = 42;
  const C = 2 * Math.PI * R;
  const guessing = value >= 0.65;
  const color = guessing ? "#FBBF24" : "#22D3EE";
  const caption =
    value < 0.35
      ? "The model is confident"
      : value < 0.65
        ? "Several plausible options"
        : "The model is guessing";
  return (
    <div className="flex flex-col items-center gap-2 lg:w-44">
      <div className="relative h-28 w-28">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="7"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={C}
            initial={reduce ? false : { strokeDashoffset: C, stroke: color }}
            animate={{ strokeDashoffset: C * (1 - value), stroke: color }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.8, ease: EASE, delay }
            }
            style={{
              filter: `drop-shadow(0 0 6px ${
                guessing ? "rgba(251,191,36,0.45)" : "rgba(34,211,238,0.45)"
              })`,
            }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="text-xl font-bold tabular-nums text-white">
              {Math.round(value * 100)}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500">
              uncertainty
            </div>
          </div>
        </div>
      </div>
      <p
        className={`text-center text-xs transition-colors duration-300 ${
          guessing ? "text-amber-300/90" : "text-slate-400"
        }`}
      >
        {caption}
      </p>
    </div>
  );
}

function NextWordStage({ dist, uncertainty, delay, reduce, lit }) {
  // After the mount intro, further changes (temperature) animate with no delay.
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    setSettled(true);
  }, []);

  const maxP = Math.max(...dist.map((d) => d.prob), 1e-9);

  return (
    <StageShell n="03" title="Next word" lit={lit} aside="top 8 candidates">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="space-y-2">
          {dist.map((item, i) => (
            <div key={item.word} className="flex items-center gap-3">
              <span
                className={`w-24 shrink-0 text-right ${
                  item.isOther
                    ? "whitespace-nowrap text-xs italic text-slate-500"
                    : i === 0
                      ? "truncate text-sm font-semibold text-accent"
                      : "truncate text-sm text-slate-300"
                }`}
              >
                {item.isOther ? "everything else" : item.word}
              </span>
              <div
                className={`h-2.5 min-w-0 flex-1 overflow-hidden rounded-full ${
                  item.isOther ? "bg-transparent" : "bg-white/5"
                }`}
              >
                <motion.div
                  className={`h-full rounded-full ${
                    i === 0
                      ? "bg-accent shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                      : item.isOther
                        ? "border border-dashed border-slate-500/60 bg-slate-500/10"
                        : "bg-slate-500/50"
                  }`}
                  initial={reduce ? false : { width: 0 }}
                  animate={{ width: `${(item.prob / maxP) * 100}%` }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : {
                          type: "spring",
                          stiffness: 150,
                          damping: 24,
                          delay: settled ? 0 : delay + i * 0.05,
                        }
                  }
                />
              </div>
              <span
                className={`w-12 shrink-0 text-right text-xs tabular-nums ${
                  i === 0 ? "text-accent" : "text-slate-500"
                }`}
              >
                {pct(item.prob)}
              </span>
            </div>
          ))}
        </div>
        <UncertaintyGauge
          value={uncertainty}
          delay={settled ? 0 : delay}
          reduce={reduce}
        />
      </div>
    </StageShell>
  );
}

export default function GlassBox() {
  const reduce = useReducedMotion();
  const [input, setInput] = useState("");
  const [debounced, setDebounced] = useState("");
  const [temperature, setTemperature] = useState(0.6);
  const [auto, setAuto] = useState(false);
  const [flash, setFlash] = useState(null); // { word, id } — last auto-written word
  const [progress, setProgress] = useState(0); // stages finished animating (0–3)

  const inputRef = useRef(input);
  inputRef.current = input;
  const tempRef = useRef(temperature);
  tempRef.current = temperature;
  const autoRef = useRef(false);
  const typeId = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(input), 250);
    return () => clearTimeout(t);
  }, [input]);

  useEffect(
    () => () => {
      autoRef.current = false;
      typeId.current += 1;
    },
    []
  );

  const tokens = useMemo(() => tokenize(debounced), [debounced]);
  const tokensKey = tokens.join(" ") || "empty";
  const windowTokens = useMemo(
    () => tokens.slice(-CONTEXT_WINDOW),
    [tokensKey] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const weights = useMemo(
    () => attentionWeights(windowTokens),
    [tokensKey] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const dist = useMemo(
    () => nextWordDistribution(tokens, temperature),
    [tokensKey, temperature] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const uncertainty = useMemo(() => entropy(dist), [dist]);

  const lastToken = tokens[tokens.length - 1];
  const unknownLast = lastToken != null && !vocabHas(lastToken);
  const contextFull = tokens.length >= MAX_TOKENS;

  // Stage delays so the eye follows the pipeline: 01 → 02 → 03.
  const nAnim = Math.min(tokens.length, 20);
  const d2 = reduce ? 0 : nAnim * 0.06 + 0.45;
  const d3 = reduce ? 0 : d2 + 0.65;

  // Light up the 01/02/03 labels as each stage finishes animating.
  useEffect(() => {
    setProgress(0);
    if (!tokens.length) return undefined;
    if (reduce) {
      setProgress(3);
      return undefined;
    }
    const timers = [
      setTimeout(() => setProgress(1), (nAnim * 0.06 + 0.3) * 1000),
      setTimeout(() => setProgress(2), (d2 + 0.9) * 1000),
      setTimeout(() => setProgress(3), (d3 + 0.8) * 1000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [tokensKey, reduce]); // eslint-disable-line react-hooks/exhaustive-deps

  const setSentence = (text) => {
    typeId.current += 1; // cancel any in-flight typewriter
    setInput(text);
    setDebounced(text); // skip the debounce for instant feedback
  };

  const appendWord = useCallback(
    async (word) => {
      const id = ++typeId.current;
      const isPunct = PUNCT.test(word);
      const prefix = inputRef.current && !isPunct ? " " : "";
      // Capitalise the word in the display when it starts a new sentence.
      const display =
        !isPunct && inputRef.current.trimEnd().endsWith(".")
          ? word[0].toUpperCase() + word.slice(1)
          : word;
      const text = prefix + display;
      if (reduce) {
        setInput(inputRef.current + text);
        setFlash({ word: display, id });
        return;
      }
      for (const ch of text) {
        if (typeId.current !== id) return;
        setInput((prev) => prev + ch);
        await sleep(30);
      }
      setFlash({ word: display, id });
    },
    [reduce]
  );

  const writeOne = useCallback(async () => {
    const toks = tokenize(inputRef.current);
    if (!toks.length || toks.length >= MAX_TOKENS) return;
    const word = sampleNextWord(toks, tempRef.current);
    if (word) await appendWord(word);
  }, [appendWord]);

  const toggleAuto = useCallback(async () => {
    if (autoRef.current) {
      autoRef.current = false;
      setAuto(false);
      return;
    }
    autoRef.current = true;
    setAuto(true);
    for (let i = 0; i < 10 && autoRef.current; i++) {
      await writeOne();
      if (tokenize(inputRef.current).length >= MAX_TOKENS) break;
      if (!autoRef.current || i === 9) break;
      await sleep(600);
    }
    autoRef.current = false;
    setAuto(false);
  }, [writeOne]);

  const reset = () => {
    autoRef.current = false;
    setAuto(false);
    setFlash(null);
    setSentence("");
    setTemperature(0.6);
  };

  const hint =
    temperature <= 0.6 ? "cautious" : temperature >= 1.3 ? "creative" : "balanced";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-8">
      <div className="mb-3 flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <motion.button
            key={ex}
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => setSentence(ex)}
            className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-400 transition-colors duration-200 hover:border-accent/40 hover:text-accent"
          >
            {ex}
          </motion.button>
        ))}
      </div>

      <label
        htmlFor="glassbox-prompt"
        className="mb-2 block text-xs font-medium uppercase tracking-widest text-slate-400"
      >
        Your sentence
      </label>
      <div className="relative">
        <input
          id="glassbox-prompt"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Try "The model predicts"'
          autoComplete="off"
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-white placeholder:text-slate-500 outline-none transition-colors duration-200 focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
        />
        {flash && (
          <motion.span
            key={flash.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.4, times: [0, 0.1, 0.7, 1], ease: "easeOut" }}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent shadow-[0_0_12px_rgba(34,211,238,0.4)]"
          >
            +{flash.word}
          </motion.span>
        )}
      </div>
      <p className="mt-2 text-xs text-slate-500">
        This is a tiny model trained on ~1,500 sentences — when it writes
        nonsense, that&rsquo;s the point. Bigger models do the same thing with
        far more data.
      </p>
      {unknownLast && (
        <p className="mt-1 text-xs italic text-slate-500">
          New word to me — falling back to what I know overall.
        </p>
      )}

      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:max-w-xs">
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-medium text-slate-400">Temperature</span>
            <span className="tabular-nums text-slate-300">
              {temperature.toFixed(2)}{" "}
              <span className="text-slate-500">· {hint}</span>
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.05"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            aria-label="Temperature"
            className="mt-1.5 w-full accent-accent"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            writing samples from the top 5
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 md:items-end">
          <div className="flex flex-wrap gap-2">
            <Btn onClick={writeOne} disabled={!tokens.length || auto || contextFull}>
              Let it write
            </Btn>
            <Btn
              variant="outline"
              onClick={toggleAuto}
              disabled={(!tokens.length || contextFull) && !auto}
            >
              {auto ? "Stop" : "Auto-write ×10"}
            </Btn>
            <Btn variant="subtle" onClick={reset}>
              Reset
            </Btn>
          </div>
          {contextFull && (
            <p className="text-xs text-slate-400">
              Context full — reset to continue.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {tokens.length === 0 ? (
          <div className="grid min-h-48 place-items-center rounded-xl border border-dashed border-white/10 bg-ink/40">
            <p className="text-sm text-slate-500">
              Type a few words to open the box.
            </p>
          </div>
        ) : (
          <>
            <TokenStage
              tokens={tokens}
              tokensKey={tokensKey}
              reduce={reduce}
              lit={progress >= 1}
            />
            <AttentionStage
              tokens={windowTokens}
              tokensKey={tokensKey}
              weights={weights}
              truncated={tokens.length > CONTEXT_WINDOW}
              delay={d2}
              reduce={reduce}
              lit={progress >= 2}
            />
            <NextWordStage
              key={tokensKey}
              dist={dist}
              uncertainty={uncertainty}
              delay={d3}
              reduce={reduce}
              lit={progress >= 3}
            />
          </>
        )}
      </div>
    </div>
  );
}
