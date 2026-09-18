import { useRef } from "react";
import { useGSAP } from "../../lib/useGSAP";
import { gsap } from "../../lib/smoothScroll";

const TEXT =
  "先想清楚， 再动手。 我不把设计当作最后一层包装。 很多时候，我会先去看用户、场景和业务， 再决定该做一张图、一套系统， 还是一个真正能跑起来的体验。";

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  // word-by-word brightening tied to scroll progress
  useGSAP(
    () => {
      const words = root.current!.querySelectorAll("[data-w]");
      gsap.fromTo(
        words,
        { color: "#3a372f" },
        {
          color: "#ece8df",
          stagger: 0.4,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 75%",
            end: "bottom 80%",
            scrub: 0.5,
          },
        },
      );
    },
    [],
    // reduced motion: show the statement fully legible, no scrub
    () =>
      root.current
        ?.querySelectorAll<HTMLElement>("[data-w]")
        .forEach((w) => (w.style.color = "#ece8df")),
  );

  return (
    <section
      ref={root}
      className="relative grid grid-cols-12 gap-y-10 px-[var(--gutter)] py-[16vh] md:py-[22vh]"
    >
      <div className="col-span-12 md:col-span-3">
        <p className="label sticky top-28">
          <span className="text-[var(--color-acid)]">[01]</span>
          <br />
          设计方法
        </p>
      </div>

      <h2 className="col-span-12 text-h3 font-display font-semibold leading-[1.08] tracking-[-0.02em] md:col-span-9 md:col-start-4">
        {TEXT.split(" ").map((w, i) => (
          <span key={i} data-w className="inline-block" style={{ color: "#3a372f" }}>
            {w}&nbsp;
          </span>
        ))}
      </h2>
    </section>
  );
}
