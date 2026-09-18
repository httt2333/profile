import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { usePointer, usePrefersReducedMotion, useCoarsePointer } from "../../lib/hooks";
import { useGSAP } from "../../lib/useGSAP";
import { gsap } from "../../lib/smoothScroll";
import { scrollTo } from "../../lib/smoothScroll";

const GravScene = lazy(() => import("./GravScene"));

// honour Data Saver — skip the heavy WebGL on metered/save-data connections
const saveData =
  typeof navigator !== "undefined" &&
  (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const coarse = useCoarsePointer();
  const { target } = usePointer();
  const root = useRef<HTMLElement>(null);
  // only render the WebGL while the hero is on (or near) screen
  const [heroOnScreen, setHeroOnScreen] = useState(true);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setHeroOnScreen(entry.isIntersecting),
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // entrance choreography (fires after preloader hands off)
  useGSAP(() => {
    const el = root.current!;
    const tl = gsap.timeline({ delay: 0.15 });
    tl.from(el.querySelectorAll("[data-hero-line] > span"), {
      yPercent: 120,
      duration: 1.3,
      ease: "expo.out",
      stagger: 0.09,
    })
      .from(
        el.querySelectorAll("[data-hero-fade]"),
        { autoAlpha: 0, y: 24, duration: 1, ease: "expo.out", stagger: 0.12 },
        "-=0.8",
      )
      .from(
        "[data-hero-canvas]",
        { autoAlpha: 0, scale: 1.08, duration: 1.6, ease: "expo.out" },
        0,
      );

    // parallax drift on scroll — scrub smoothing keeps it buttery
    gsap.to(el.querySelector("[data-hero-type]"), {
      yPercent: 16,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.5 },
    });
    gsap.to("[data-hero-canvas]", {
      yPercent: 10,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.5 },
    });
  }, []);

  return (
    <section
      ref={root}
      className="vignette relative flex min-h-[100svh] w-full flex-col overflow-hidden px-[var(--gutter)] pb-10 pt-28 md:pt-32"
    >
      {/* WebGL layer */}
      <div data-hero-canvas className="pointer-events-none absolute inset-0 -z-0">
        {!reduced && !saveData ? (
          <Suspense fallback={null}>
            <GravScene pointer={target} reduced={reduced} lite={coarse} active={heroOnScreen} />
          </Suspense>
        ) : (
          <div className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#35322e,transparent_70%)] blur-2xl" />
        )}
      </div>

      <img
        data-hero-fade
            src="/assets/projects/airth-cover.png"
        alt="A translucent inspection lens over a monochrome image contact sheet"
        className="pointer-events-none absolute bottom-[12vh] right-[6vw] z-0 hidden aspect-[4/3] w-[min(38vw,560px)] object-cover opacity-70 mix-blend-screen md:block"
        loading="eager"
      />

      {/* top meta row */}
      <div
        data-hero-fade
        className="relative z-10 flex items-start justify-between"
      >
        <p className="label max-w-[18ch] leading-relaxed">
          视觉 / 交互 / AI
          <br />
          
        </p>
        <p className="label hidden text-right md:block">
          深圳
          <br />
          <span className="text-[var(--color-acid)]">● 开放机会</span>
        </p>
      </div>

      {/* headline — centered over the blob */}
      <div
        data-hero-type
        className="relative z-10 flex flex-1 flex-col items-center justify-center text-center select-none"
      >
        {/* the edge vignette darkens the frame, not the center — exactly where
            this text sits — so the blob's own light/dark variance can bleed
            through the type. This scrim dims specifically behind the text
            block, independent of that decorative edge treatment. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 62% 58% at 50% 50%, color-mix(in oklab, var(--color-void) 60%, transparent) 0%, color-mix(in oklab, var(--color-void) 28%, transparent) 55%, transparent 78%)",
          }}
        />
        <h1 className="font-display text-mega leading-[0.82]">
          <span className="sr-only">
            Zixuan Zhang, Visual Designer and AI Product Maker based in Shenzhen
          </span>
          <span data-hero-line className="line-mask" aria-hidden="true">
            <span className="inline-block will-change-transform">ZIXUAN</span>
          </span>
        </h1>
        <p data-hero-fade className="mt-2 font-serif text-h3 italic leading-none text-[var(--color-acid)]">
          Zhang
        </p>
        <p
          data-hero-fade
          className="mt-7 max-w-[42ch] text-lead font-light text-[var(--color-bone-dim)]"
        >
          把复杂的问题，<br />做成清晰的体验。
          <span className="mt-4 block text-body text-[var(--color-ash)]">视觉、交互与 AI，<br />是我解决问题的不同方式。</span>
        </p>
        <button
          data-hero-fade
          data-cursor="view"
          data-cursor-label="Scroll"
          onClick={() => scrollTo("#work")}
          className="group mt-9 flex items-center gap-3 text-label uppercase tracking-[0.2em] text-[var(--color-bone-dim)] transition-colors hover:text-[var(--color-acid)]"
        >
          <span className="font-mono">[ 查看作品 ]</span>
          <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-1">
            ↓
          </span>
        </button>
      </div>
    </section>
  );
}
