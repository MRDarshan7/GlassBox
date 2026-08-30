# GlassBox

**Type a sentence and watch a language model decide what comes next — every invisible step made visible, live in your browser.**

## Problem statement

**PS2 – Visualizing the Invisible: "How AI thinks."**

Every word an AI writes is the end of an invisible process. GlassBox opens the
black box: a real (tiny) language model runs entirely in your browser, and the
page shows the pipeline between your text and the model's next word.

## What the demo shows

1. **Tokenization** — your sentence is chopped into tokens (words and
   punctuation), the pieces the model actually operates on.
2. **Attention** — arcs from the last token back to the earlier tokens that
   most influence the prediction, over a finite context window of the last 12
   tokens (real models also see only a limited window of text).
3. **Next-word probabilities** — the top 8 candidate words as animated bars,
   the long tail as "everything else", and an uncertainty gauge driven by the
   normalised entropy of the distribution. A temperature slider (0.1–2.0)
   reshapes the distribution live, and "Let it write" / "Auto-write ×10"
   sample from it to extend your sentence.

## How the model works

- A **word-level trigram language model** trained at page load from ~258
  short sentences bundled with the app. No network, no APIs, no backend.
- **Backoff:** trigram → bigram → unigram, combined by recursive
  interpolation — a context seen *c* times earns weight *c*/(*c*+4), and
  unseen contexts fall through to the next level down.
- **Smoothing:** add-k (k = 0.01) at every level, so no word ever has zero
  probability.
- **Temperature:** applied as softmax over log-probabilities divided by T
  (equivalently p^(1/T), renormalised) — low T sharpens the distribution,
  high T flattens it.

**An honest note on attention:** the attention view is *illustrative* — a
simplified stand-in for real transformer attention, not the real thing. Each
earlier token is scored by recency decay (0.85 per token of distance) times
the KL divergence between "what the model would predict if that word sat
right before the last word" and the corpus-wide unigram baseline. There are
no learned queries, keys, or values; it exists to make the *concept* of
attention visible, and the UI labels it as such.

## Tech stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

## Tools used

- **Claude Code** (with Claude Fable 5) — the entire project was
  prompt-engineered
- Vite, React, Tailwind CSS, Framer Motion
- Vercel (deployment)

## Run locally

```bash
npm install
npm run dev      # dev server at http://localhost:5173
npm run build    # production build
npm run preview  # preview the production build
```

## Team

**The Outliers**
