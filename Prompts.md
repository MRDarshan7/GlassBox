Prompt 1 — Scaffold:
Create a single-page website called "GlassBox" using Vite + React + Tailwind CSS + Framer Motion.

Purpose: an interactive visualization that makes visible how a language model "thinks" — the invisible steps between a user's text and the model's next word. Built for a hackathon problem statement "Visualizing the Invisible". Team: The Outliers.

Page sections, in order:
1. Hero — headline "Every word an AI writes is the end of an invisible process." Subheadline: "GlassBox opens the black box. Type a sentence and watch a language model decide what comes next." CTA button "Open the box" that smooth-scrolls to section 2.
2. Visualization — a full-width section containing a component <GlassBox />. For now render a placeholder glass card with a text input and the text "Visualization goes here". Keep it isolated in src/components/GlassBox.jsx — I will build the real component next.
3. "What you're seeing" — three cards explaining Tokenization, Attention, and Next-word probabilities in 2 sentences each, plain language.
4. "Why it matters" — 3 short points: trust, bias, and knowing when not to trust the output.
5. Footer — "Built by The Outliers · Prompt-engineered with Claude Code · Model runs entirely in your browser".

Visual direction — this must feel premium, not like a template:
- Dark background #0B0F19 with a slow-drifting animated background of faint nodes and connecting lines (a subtle "neural network" canvas, low opacity, respects prefers-reduced-motion).
- Single accent colour electric cyan #22D3EE, used sparingly: CTA, glows, active states. Soft radial cyan glow behind the hero headline.
- Glassmorphism cards: translucent surface, 1px border with low-alpha white, backdrop blur, gentle hover lift and border glow.
- Typography: Inter via Google Fonts; hero headline large with tight tracking, animate in word-by-word (staggered).
- Motion: every section fades and rises into view on scroll (Framer Motion whileInView, once), cards stagger in, buttons have scale-on-hover and press feedback. Motion should feel smooth and deliberate — easeOut, 0.5–0.8s, no bouncing.
- Sticky minimal top nav with logo "GlassBox" and links that smooth-scroll to sections; nav gets a blurred background on scroll.
- Mobile-first responsive; everything must look intentional at 375px width.

Constraints: no stock images, no external APIs, no backend. Set up package.json scripts, a node .gitignore, a placeholder README.md. Run the dev server at the end and confirm it builds without errors.

Prompt 2 — The model + visualization
Build the real <GlassBox /> in src/components/GlassBox.jsx. Keep the existing glass card and input styling; replace the placeholder panel with a live, animated pipeline. Everything runs in the browser, no network.

THE MODEL (src/lib/model.js)
- A word-level trigram language model with backoff to bigram and unigram, add-k smoothing (k=0.01). Tokens are lowercase words; punctuation (. , ? !) are their own tokens.
- Train at load time from a bundled corpus in src/lib/corpus.js: write ~250 short, simple, varied English sentences yourself (everyday life, animals, weather, cities, food, school, plus ~40 sentences about computers, the internet and artificial intelligence so tech prompts work). Public-domain-safe, original text, no copied passages.
- Export: tokenize(text), nextWordDistribution(tokens, temperature) → sorted array of {word, prob} for the top 8 plus "other" mass; entropy(distribution) normalised 0–1; and attentionWeights(tokens) → for the last token, a weight for each earlier token (0–1, sum 1). Compute attention as: recency decay × how strongly that earlier word shifts the next-word distribution versus the unigram baseline (KL divergence between P(next | that word, last word) and P(next)). Label this in the UI as "illustrative attention — a simplified stand-in for real transformer attention".
- Temperature: apply as softmax over log-probs divided by T, T in [0.1, 2.0].

THE VISUALIZATION (inside the card, three stages stacked vertically, each with a small cyan label 01 / 02 / 03)
Stage 01 — Tokenization: the sentence rendered as token chips that pop in one by one (stagger 60ms, scale from 0.8, easeOut). Punctuation chips styled dimmer. Show a counter "N tokens".
Stage 02 — Attention: the same chips in a row, with an SVG overlay drawing curved arcs from the last token to every earlier token; arc stroke width and opacity proportional to the attention weight, arcs draw-on animated (pathLength 0→1). Hovering a chip shows its weight as a percentage tooltip. The strongest-attended chip gets a cyan glow.
Stage 03 — Next word: horizontal bars for the top 8 candidate words, widths animated with a spring, sorted descending, probability shown as percentage. The top candidate is cyan, the rest muted. To the right (stacked on mobile), an "Uncertainty" ring gauge (SVG circle, animated) driven by normalised entropy, with a one-line caption: low → "The model is confident", mid → "Several plausible options", high → "The model is guessing".

CONTROLS (a slim bar under the input)
- Temperature slider 0.1–2.0 (default 0.8), cyan thumb, label showing the value and a hint: low = "cautious", high = "creative". Changing it re-animates Stage 03 only.
- Button "Let it write" → samples one word from the current distribution at the current temperature, appends it to the sentence with a typewriter reveal, and re-runs all three stages. Button "Auto-write ×10" → does this ten times with 600ms between steps, disableable/stoppable. Button "Reset".
- Three example chips above the input: "The cat sat on the", "The internet is a", "I think the weather" — clicking fills the input.

BEHAVIOUR
- Recompute on input with a 250ms debounce. Empty input shows a friendly empty state: "Type a few words to open the box."
- If the last token is unknown to the model, still work (backoff to unigram) and show a small note "New word to me — falling back to what I know overall."
- Stages animate in sequence (01 → 02 → 03) with ~200ms between stages so the eye follows the pipeline. Use the shared motion variants in src/lib/motion.js where sensible. Respect reduced motion.
- Performance: model trains once (memoised); all recomputation should feel instant.

Then run the build, fix any errors, and give me a short summary of what the attention heuristic actually computes so I can document it honestly.


Prompt 3 — Fixes + polish
Refinements to GlassBox. Keep everything that works; change only what's listed.

ATTENTION STAGE (Stage 02) — fix the overflow
- Never show scrollbars. Attention is computed and drawn only over a context window of the last 12 tokens. Show a small muted label "context window: last 12 tokens" and, if the sentence is longer, a faded "…" chip at the start. This is a real concept (models have finite context), so add one sentence of tooltip on hover of the label: "Real models also see only a limited window of text."
- Chips must wrap onto multiple rows if needed; arcs must be drawn on an SVG overlay sized to the chip container, using each chip's measured position (getBoundingClientRect relative to the container), re-measured on resize. Arcs go above the chips, not below, with enough vertical room so nothing clips.
- Colour arcs by weight: strongest = solid cyan, weaker = fading to 15% opacity.

NEXT WORD STAGE (Stage 03)
- Rename the last row to "everything else" and never truncate it; make it visibly different (italic, dashed bar).
- When the model is guessing (high uncertainty), give the gauge a warm amber ring instead of cyan so uncertainty is readable at a glance.

WRITING CONTROLS
- Under the sentence input, add a one-line muted caption: "This is a tiny model trained on ~250 sentences — when it writes nonsense, that's the point. Bigger models do the same thing with far more data." 
- Cap the sentence at 40 tokens; when reached, stop auto-write and show "Context full — reset to continue."
- Auto-write: while running, the button becomes "Stop" and the newly written word flashes cyan as it lands.

GLOBAL POLISH
- The NeuralCanvas background is too faint. Raise node/line opacity so it's clearly visible but still atmospheric (target: noticeable at a glance, never competing with text). Make nodes near the cursor brighten slightly.
- Use one consistent max-width container (max-w-5xl) for all sections so the Demo, "What you're seeing" and "Why it matters" sections align on the same left edge.
- Add a subtle progress indicator in the demo card: the three stage labels (01/02/03) light up in sequence as each stage finishes animating.
- Add an Open Graph title/description and a favicon (simple cyan square glyph as SVG).

README.md — replace the placeholder with: project name and one-line pitch; problem statement (PS2 – Visualizing the Invisible: "How AI thinks"); what the demo shows (three stages); how the model works (trigram + backoff + temperature) and an honest note that attention is illustrative; tech stack; tools used (Claude Code with Claude Fable 5, Vite, React, Tailwind, Framer Motion, Vercel); how to run locally; team: The Outliers.

Run the build and confirm no errors or console warnings.