// Shared Framer Motion variants — smooth and deliberate, no bouncing.
export const EASE = "easeOut";

export const reveal = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export const viewportOnce = { once: true, margin: "-80px" };
