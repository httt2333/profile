import Magnetic from "./ui/Magnetic";
import MobileMenu from "./MobileMenu";
import { scrollTo } from "../lib/smoothScroll";

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-[9000] flex items-center justify-between px-[var(--gutter)] py-5 mix-blend-difference">
      <Magnetic strength={0.5}>
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            scrollTo(0);
          }}
          data-cursor="hover"
          className="font-display text-xl font-extrabold tracking-tight text-[var(--color-bone)]"
        >
          Zixuan<span className="text-[var(--color-acid)]">°</span>
        </a>
      </Magnetic>

      <nav className="hidden items-center gap-8 font-mono text-label uppercase tracking-[0.16em] text-[var(--color-bone)] md:flex">
        {[
          ["作品", "#work"],
          ["能力", "#stack"],
          ["关于", "#about"],
        ].map(([label, href]) => (
          <a
            key={href}
            href={href}
            onClick={(e) => {
              e.preventDefault();
              scrollTo(href);
            }}
            data-cursor="hover"
            className="group relative"
          >
            {label}
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-[var(--color-acid)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-6 font-mono text-label text-[var(--color-bone)]">
        <span className="hidden sm:inline">深圳 / 远程合作</span>
        <Magnetic strength={0.5} className="hidden md:block">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("#contact");
            }}
            data-cursor="hover"
            className="rounded-full border border-[var(--color-bone)]/40 px-4 py-2 uppercase tracking-[0.16em] transition-colors hover:border-[var(--color-acid)]"
          >
            联系
          </a>
        </Magnetic>
        <MobileMenu />
      </div>
    </header>
  );
}
