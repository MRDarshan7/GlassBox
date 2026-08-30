// Shared Framer Motion variants — bouncy, elastic, fun.
export const EASE = "easeOut"; // for draw-on / continuous animations
export const EASE_POP = [0.34, 1.56, 0.64, 1]; // overshoot: elements pop in

export const reveal = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: EASE_POP },
  },
};

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export const viewportOnce = { once: true, margin: "-80px" };
