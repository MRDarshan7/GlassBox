import { useEffect, useRef } from "react";

// Full-viewport background canvas: drifting nodes with connecting lines,
// clearly visible but never competing with text. Nodes near the cursor
// brighten slightly. Renders a single static frame when the user prefers
// reduced motion.
export default function NeuralCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let nodes = [];
    let raf = 0;
    let w = 0;
    let h = 0;
    const mouse = { x: -1e9, y: -1e9 };

    const LINK_DIST = 140;
    const CURSOR_DIST = 160;

    const seed = () => {
      const count = Math.min(90, Math.round((w * h) / 24000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: 1 + Math.random() * 1.4,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          if (Math.abs(dx) > LINK_DIST || Math.abs(dy) > LINK_DIST) continue;
          const d = Math.hypot(dx, dy);
          if (d < LINK_DIST) {
            ctx.strokeStyle = `rgba(148, 180, 210, ${(1 - d / LINK_DIST) * 0.3})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        const dm = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        const boost = dm < CURSOR_DIST ? 1 - dm / CURSOR_DIST : 0;
        ctx.fillStyle = `rgba(34, 211, 238, ${0.5 + boost * 0.45})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + boost * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = w + 20;
        else if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        else if (n.y > h + 20) n.y = -20;
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (reduceMotion.matches) draw();
      else raf = requestAnimationFrame(step);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduceMotion.matches) draw();
    };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -1e9;
      mouse.y = -1e9;
    };

    resize();
    start();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    reduceMotion.addEventListener("change", start);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      reduceMotion.removeEventListener("change", start);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 h-full w-full opacity-60"
    />
  );
}
