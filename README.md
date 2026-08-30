# GlassBox

**Type a sentence and watch a language model decide what comes next — every invisible step made visible, live in your browser.**

**Live demo:** [glass-box-black.vercel.app](https://glass-box-black.vercel.app/)

`Vite` · `React` · `Tailwind CSS` · `Framer Motion` · `Vercel`

## Overview

GlassBox was built for the hackathon problem statement **PS2 – Visualizing the
Invisible: "How AI thinks."** Every word an AI writes is the end of an
invisible process, and GlassBox opens that black box: you type a sentence and
the site shows the full pipeline between your text and the model's next word.
A real (tiny) language model trains and runs entirely in the browser — no
backend, no APIs, and nothing you type ever leaves the page.

## What the demo shows

1. **Tokenization** — your sentence is chopped into tokens (words and
   punctuation), the pieces the model actually operates on.
2. **Attention** — arcs drawn from the last token back to the earlier tokens
   that most influence the prediction, over a finite context window of the
   last 12 tokens.
3. **Next word** — the top 8 candidate words as animated probability bars,
   with the remaining long tail shown honestly as "everything else."

Around the pipeline: a **temperature slider** (0.1–2.0) reshapes the
distribution live, an **uncertainty gauge** driven by the normalised entropy
of the distribution says when the model is confident versus guessing, and
**Let it write** / **Auto-write ×10** sample from the distribution to extend
your sentence one word at a time.

## How the model works

- A **word-level trigram language model** with backoff to bigram and unigram
  and **add-k smoothing** (k = 0.01), trained at page load from an original
  corpus of ~1,500 short sentences bundled with the app.
- **Temperature** is applied as softmax over log-probabilities divided by T —
  low T sharpens the distribution, high T flattens it.
- **Writing** uses **top-k sampling** (k = 5, renormalised) for coherence,
  and gently boosts the probability of "." on long sentences so they finish.
- **Context** is limited to a 12-token window, mirroring the finite context
  of real models.

### Limitations

- The attention view is an **illustrative heuristic** — recency decay
  multiplied by the KL-divergence shift each earlier word causes relative to
  the unigram baseline. It is a simplified stand-in for transformer
  attention, not the real thing, and the UI labels it as such.
- A model this small drifts after a sentence or two. That is deliberate: the
  site presents the drift as part of the lesson — bigger models do the same
  thing with far more data.

## Design

The site follows the **Playful Geometric** design system documented in
[`docs/design-system.md`](docs/design-system.md): a warm paper background,
chunky ink borders, hard offset shadows, a violet/pink/amber/mint palette,
and bouncy, elastic motion. The hero is a scroll-bound **"opening box"** —
two paper panels slide apart as you scroll to reveal the headline, and close
again on the way back up. All motion respects `prefers-reduced-motion`; with
it enabled, the box renders already open and animations settle instantly.

## Project structure

```
glassbox/
├── docs/
│   └── design-system.md      # Playful Geometric design system
├── src/
│   ├── components/           # Nav, Hero, GlassBox (the demo), sections, ui
│   ├── lib/
│   │   ├── model.js          # trigram model: training, sampling, attention
│   │   ├── corpus.js         # ~1,500-sentence original training corpus
│   │   └── motion.js         # shared Framer Motion variants
│   ├── App.jsx
│   └── index.css             # design tokens (Tailwind v4 @theme)
├── index.html
└── vercel.json
```

## Running locally

Requires **Node 18+** (Node 20 or newer recommended).

```bash
npm install
npm run dev      # dev server at http://localhost:5173
npm run build    # production build
npm run preview  # preview the production build
```

## Built with

Code generated with **Claude Code** (Claude Fable 5), driven by the prompts
documented in the submission.

## Team

**The Outliers** — M R Darshan, Tarun A, Akash S

Sri Krishna College of Engineering and Technology
