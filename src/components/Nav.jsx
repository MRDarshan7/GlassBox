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
          ? "border-b-2 border-ink bg-paper/95 backdrop-blur-sm"
          : "border-b-2 border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <a
          href="#top"
          className="flex items-center gap-2.5 font-display text-base font-extrabold tracking-tight text-ink sm:text-lg"
        >
          <span
            aria-hidden="true"
            className="grid h-7 w-7 place-items-center rounded-lg border-2 border-ink bg-accent shadow-[2px_2px_0_0_#1E293B]"
          >
            <span className="h-2 w-2 rounded-full bg-paper" />
          </span>
          GlassBox
        </a>
        <div className="flex items-center gap-4 text-xs font-bold text-ink sm:gap-7 sm:text-sm">
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
