import { useEffect, useState } from "react";

const links = [
  { href: "#visualization", label: "Demo" },
  { href: "#seeing", label: "What you see" },
  { href: "#why", label: "Why" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/5 bg-ink/70 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <a
          href="#top"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-white sm:text-base"
        >
          <span
            aria-hidden="true"
            className="grid h-6 w-6 place-items-center rounded-md border border-accent/60 shadow-[0_0_12px_rgba(34,211,238,0.35)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          GlassBox
        </a>
        <div className="flex items-center gap-4 text-xs text-slate-400 sm:gap-7 sm:text-sm">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors duration-200 hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
