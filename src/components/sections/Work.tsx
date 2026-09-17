import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useGSAP } from "../../lib/useGSAP";
import { getLenis, gsap } from "../../lib/smoothScroll";
import { useCoarsePointer, useMediaQuery, usePrefersReducedMotion } from "../../lib/hooks";

type IconKind = "lens" | "voice" | "study" | "collab";

type Project = {
  index: string;
  title: string;
  category: string;
  stack: string;
  blurb: string;
  year: string;
  tint: string;
  surface: string;
  icon: IconKind;
  image: string;
  gallery: string[];
};

const PROJECTS: Project[] = [
  {
    index: "01",
    title: "AI 视觉质量评估工具",
    category: "AI 产品 / 独立负责",
    stack: "Agent Evaluation · Human-in-the-loop · Web 原型",
    blurb:
      "针对 AI 素材生成快但质量判断依赖经验的问题，建立检测、定位、判断、修复与复核闭环。",
    year: "2026",
    tint: "#ece8df",
    surface:
      "radial-gradient(120% 90% at 20% 15%, #232220 0%, #0e0d0c 55%), linear-gradient(135deg, #171614, #0a0908)",
    icon: "lens",
    image: "/assets/ai-image-checker.png",
    gallery: ["/assets/ai-image-checker.png", "/assets/signal-noise.png", "/assets/agent-workspace.png", "/assets/common-ground.png"],
  },
  {
    index: "02",
    title: "二次元游戏多 Agent 内容生产",
    category: "内容生产系统 / 腾讯 IEG",
    stack: "Multi-Agent · Workflow · Bad Case · Evaluation",
    blurb:
      "将角色、脚本、动作、镜头、生成修复与质量复核拆成可协作的 Agent 节点，提升内容生产稳定性。",
    year: "2026",
    tint: "#c7c2b8",
    surface:
      "radial-gradient(110% 80% at 80% 10%, #1e1d1a 0%, #0c0b0a 60%), linear-gradient(135deg, #15140f, #0a0908)",
    icon: "voice",
    image: "/assets/agent-workspace.png",
    gallery: ["/assets/agent-workspace.png", "/assets/ai-image-checker.png", "/assets/common-ground.png", "/assets/signal-noise.png"],
  },
  {
    index: "03",
    title: "雇主品牌内容系统",
    category: "品牌内容设计 / MKS 中国",
    stack: "内容系统 · 视觉规则 · 7 套模板 / SOP",
    blurb:
      "针对年轻求职人群的认知问题，从一次次内容制作转向可持续的品牌内容系统。",
    year: "2026",
    tint: "#a7a299",
    surface:
      "radial-gradient(120% 90% at 70% 30%, #201f1c 0%, #0d0c0b 60%), linear-gradient(135deg, #161512, #0a0908)",
    icon: "study",
    image: "/assets/signal-noise.png",
    gallery: ["/assets/signal-noise.png", "/assets/common-ground.png", "/assets/ai-image-checker.png", "/assets/agent-workspace.png"],
  },
  {
    index: "04",
    title: "AI 辅助视觉运营",
    category: "品牌视觉 / 锐明技术",
    stack: "Midjourney · 品牌视觉 · 多端延展",
    blurb:
      "将创意探索、人工修复、版本适配与交付复核串成稳定流程，让视觉生产从单次执行走向可复用。",
    year: "2026",
    tint: "#837e75",
    surface:
      "radial-gradient(120% 90% at 30% 80%, #1b1a17 0%, #0c0b0a 60%), linear-gradient(135deg, #141310, #0a0908)",
    icon: "collab",
    image: "/assets/common-ground.png",
    gallery: ["/assets/common-ground.png", "/assets/agent-workspace.png", "/assets/signal-noise.png", "/assets/ai-image-checker.png"],
  },
  {
    index: "05",
    title: "AIRTH 情绪支持体验",
    category: "C 端 AI 陪伴 / 产品负责人",
    stack: "用户研究 · Unity / VR · DeepSeek API",
    blurb: "通过用户研究，将情绪输入映射为空间、天气和互动状态，探索低负担、非评判的情绪支持。",
    year: "2025",
    tint: "#d9d0bd",
    surface: "radial-gradient(120% 90% at 30% 20%, #29251f 0%, #0e0d0c 65%)",
    icon: "voice",
    image: "/assets/agent-workspace.png",
    gallery: ["/assets/agent-workspace.png", "/assets/common-ground.png", "/assets/ai-image-checker.png", "/assets/signal-noise.png"],
  },
  {
    index: "06",
    title: "PetFit 宠物陪伴式饮食管理",
    category: "C 端健康管理 / 独立负责",
    stack: "用户研究 · 微信小程序 · AI 陪伴",
    blurb: "围绕晚餐、嘴馋等高风险时刻，设计从饮食决策、宠物反馈到再次行动的行为闭环。",
    year: "2025",
    tint: "#b8c5b2",
    surface: "radial-gradient(120% 90% at 70% 20%, #1d2920 0%, #0b0d0b 65%)",
    icon: "collab",
    image: "/assets/common-ground.png",
    gallery: ["/assets/common-ground.png", "/assets/ai-image-checker.png", "/assets/signal-noise.png", "/assets/agent-workspace.png"],
  },
];

export default function Work() {
  const [selected, setSelected] = useState<{ project: Project; origin: DOMRect } | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const coarse = useCoarsePointer();
  const narrow = useMediaQuery("(max-width: 767px)");
  const reduced = usePrefersReducedMotion();
  // single source of truth: stack vertically (no pin) on small screens, touch
  // devices, or when reduced motion is requested — pin/scrub otherwise.
  const stacked = coarse || narrow || reduced;

  useGSAP(() => {
    if (stacked) return;
    const trackEl = track.current!;
    const getScroll = () => trackEl.scrollWidth - window.innerWidth;

    const tween = gsap.to(trackEl, {
      x: () => -getScroll(),
      ease: "none",
      scrollTrigger: {
        trigger: section.current,
        start: "top top",
        end: () => `+=${getScroll()}`,
        pin: true,
        scrub: 1, // inertia / smoothing on the horizontal track
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    // progress bar
    const bar = section.current!.querySelector("[data-work-bar]") as HTMLElement;
    gsap.to(bar, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: section.current,
        start: "top top",
        end: () => `+=${getScroll()}`,
        scrub: true,
      },
    });

    return () => {
      tween.kill();
    };
  }, [stacked]);

  return (
    <section id="work" ref={section} className="relative overflow-hidden bg-[var(--color-ink)]">
      {/* header — in flow on mobile, overlays the pinned track on desktop */}
      <div className="pointer-events-none z-20 flex items-start justify-between px-[var(--gutter)] pt-28 pb-2 md:absolute md:inset-x-0 md:top-0 md:pb-0 md:pt-28">
        <p className="label">
          <span className="text-[var(--color-acid)]">[02]</span>
          <br />
          精选作品
        </p>
        {!stacked && (
          <p className="label hidden text-right md:block">
            拖动 · 滚动
            <br />
            {PROJECTS.length} projects
          </p>
        )}
      </div>

      {/* track — horizontal (pinned) on desktop, vertical stack otherwise */}
      <div
        ref={track}
        className={
          stacked
            ? "flex flex-col gap-14 px-[var(--gutter)] pb-24 pt-2"
            : "flex h-[100svh] items-center gap-[6vw] px-[var(--gutter)] will-change-transform"
        }
        style={stacked ? undefined : { width: "max-content" }}
      >
        {/* intro plate */}
        <div
          className={`flex shrink-0 flex-col justify-end ${stacked ? "w-full" : "h-[70vh] w-[60vw]"}`}
        >
          <h2 className="text-h2 font-display leading-[0.9]">
            精选
            <br />
            <span className="font-serif font-normal italic text-[var(--color-acid)]">Projects</span>
          </h2>
          <p className="mt-6 max-w-[34ch] text-body text-[var(--color-bone-dim)]">
            视觉系统、数字体验与 AI 创意实践。
          </p>
        </div>

        {PROJECTS.map((p) => (
          <Card key={p.index} project={p} stacked={stacked} onOpen={(origin) => { setSelected({ project: p, origin }); setGalleryIndex(0); }} />
        ))}

        {/* end plate */}
        <div
          className={`flex shrink-0 flex-col justify-center ${stacked ? "w-full py-6" : "h-[70vh] w-[42vw]"}`}
        >
          <p className="label mb-4">更多项目</p>
          <a
            href="#contact"
            data-cursor="view"
            data-cursor-label="Say hi"
            className="text-h3 font-display leading-none transition-colors hover:text-[var(--color-acid)]"
          >
            继续<br />了解 →
          </a>
        </div>
      </div>

      {/* scrub progress (horizontal mode only) */}
      {!stacked && (
        <div className="absolute inset-x-[var(--gutter)] bottom-8 z-20 hidden h-px bg-[var(--color-bone)]/15 md:block">
          <div data-work-bar className="h-full w-full origin-left scale-x-0 bg-[var(--color-acid)]" />
        </div>
      )}
      {selected && (
        <Gallery project={selected.project} origin={selected.origin} index={galleryIndex} onClose={() => setSelected(null)} onChange={setGalleryIndex} reduced={reduced} />
      )}
    </section>
  );
}

function Card({ project, stacked, onOpen }: { project: Project; stacked: boolean; onOpen: (origin: DOMRect) => void }) {
  return (
    <article
      data-cursor="view"
      data-cursor-label="View"
      className={`group relative shrink-0 overflow-hidden rounded-[2px] ${
        stacked ? "h-[60vh] w-full" : "h-[70vh] w-[clamp(320px,46vw,640px)]"
      }`}
      style={{ background: project.surface }}
      onClick={(event) => onOpen(event.currentTarget.getBoundingClientRect())}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onOpen(event.currentTarget.getBoundingClientRect()); }}
    >
      {/* accent edge that grows on hover */}
      <span
        className="absolute left-0 top-0 z-10 h-1 w-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full"
        style={{ background: project.tint }}
      />

      <img src={project.image} alt={`${project.title} project artwork`} className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035] group-hover:opacity-75" loading="lazy" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--color-void)] via-[var(--color-void)]/55 to-transparent" />
      <div className="relative z-10 flex h-full flex-col justify-between p-8 md:p-10">
        <div className="flex items-start justify-between font-mono text-label uppercase tracking-[0.16em] text-[var(--color-bone-dim)]">
          <span style={{ color: project.tint }}>{project.index}</span>
          <span>{project.year}</span>
        </div>

        <div data-card-meta>
          <ProjectIcon
            kind={project.icon}
            className="mb-4 h-8 w-8 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1"
            style={{ color: project.tint }}
          />
          <p className="label mb-3">{project.category}</p>
          <h3 className="font-display text-[clamp(1.6rem,4.2vw,3.75rem)] leading-[0.95] [overflow-wrap:break-word] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">
            {project.title}
          </h3>
          <p className="mt-4 max-w-[40ch] text-body leading-snug text-[var(--color-bone-dim)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:opacity-0 md:group-hover:opacity-100">
            {project.blurb}
          </p>
        </div>
      </div>

      {/* hover wash */}
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          background: `radial-gradient(80% 60% at 50% 100%, ${project.tint}14, transparent 70%)`,
        }}
      />
    </article>
  );
}

function Gallery({ project, origin, index, onClose, onChange, reduced }: { project: Project; origin: DOMRect; index: number; onClose: () => void; onChange: (index: number) => void; reduced: boolean }) {
  const [closing, setClosing] = useState(false);
  const [opened, setOpened] = useState(reduced);
  const wheelLock = useRef(false);
  const overlay = useRef<HTMLDivElement>(null);
  const folder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousOverscroll = html.style.overscrollBehavior;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    getLenis()?.stop();

    const folderEl = folder.current;
    if (folderEl && !reduced) {
      const targetWidth = Math.min(window.innerWidth * 0.78, 880);
      const scale = Math.max(0.22, Math.min(0.8, origin.width / targetWidth));
      const originX = origin.left + origin.width / 2 - window.innerWidth / 2;
      const originY = origin.top + origin.height / 2 - window.innerHeight / 2;
      gsap.fromTo(folderEl, { x: originX, y: originY, scale, rotate: -1.5 }, { x: 0, y: 0, scale: 1, rotate: 0, duration: 0.72, ease: "expo.out", clearProps: "transform" });
      requestAnimationFrame(() => setOpened(true));
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      html.style.overscrollBehavior = previousOverscroll;
      getLenis()?.start();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    const node = overlay.current;
    if (!node) return;
    const blockTouch = (event: TouchEvent) => event.preventDefault();
    node.addEventListener("touchmove", blockTouch, { passive: false });
    return () => node.removeEventListener("touchmove", blockTouch);
  }, []);

  const requestClose = () => {
    if (closing) return;
    setClosing(true);
    setOpened(false);
    if (folder.current && !reduced) {
      const targetWidth = Math.min(window.innerWidth * 0.78, 880);
      const scale = Math.max(0.22, Math.min(0.8, origin.width / targetWidth));
      const originX = origin.left + origin.width / 2 - window.innerWidth / 2;
      const originY = origin.top + origin.height / 2 - window.innerHeight / 2;
      gsap.to(folder.current, { x: originX, y: originY, scale, rotate: -1.5, duration: 0.42, ease: "power3.in", onComplete: onClose });
    } else {
      window.setTimeout(onClose, 260);
    }
  };

  const slides = project.gallery;
  const total = slides.length;
  const previous = () => onChange((index - 1 + total) % total);
  const next = () => onChange((index + 1) % total);
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (wheelLock.current || Math.abs(event.deltaY) < 8 && Math.abs(event.deltaX) < 8) return;
    wheelLock.current = true;
    if (event.deltaX > 0 || event.deltaY > 0) next();
    else previous();
    window.setTimeout(() => { wheelLock.current = false; }, 420);
  };

  const positionFor = (slideIndex: number) => {
    let offset = slideIndex - index;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;
    const isCenter = offset === 0;
    return {
      transform: opened
        ? `translate3d(${offset * 62}%, ${Math.abs(offset) * 3}%, 0) scale(${isCenter ? 1 : 0.62}) rotate(${offset * 2.4}deg)`
        : `translate3d(0, 12%, 0) scale(0.76) rotate(${(slideIndex - (total - 1) / 2) * 1.8}deg)`,
      opacity: opened ? (Math.abs(offset) <= 1 ? (isCenter ? 1 : 0.38) : 0) : 0.72,
      zIndex: isCenter ? 20 : 10 - Math.abs(offset),
      pointerEvents: isCenter ? "auto" as const : "none" as const,
    };
  };

  return (
    <div ref={overlay} className={`fixed inset-0 z-[10000] flex items-center justify-center bg-[var(--color-void)]/95 px-4 py-8 backdrop-blur-md ${closing ? "animate-[gallery-out_450ms_cubic-bezier(0.16,1,0.3,1)]" : "animate-[gallery-in_500ms_cubic-bezier(0.16,1,0.3,1)]"}`} role="dialog" aria-modal="true" aria-label={`${project.title} 图片画廊`} onClick={requestClose} onWheel={handleWheel}>
      <button className="absolute right-6 top-6 z-20 min-h-11 px-3 font-mono text-label uppercase tracking-[0.16em] text-[var(--color-bone-dim)] hover:text-[var(--color-acid)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-acid)]" onClick={(event) => { event.stopPropagation(); requestClose(); }}>关闭 ×</button>
      <div ref={folder} className="relative flex h-[82vh] w-full max-w-7xl flex-col items-center justify-center" onClick={(event) => event.stopPropagation()}>
        <div className="pointer-events-none absolute left-1/2 top-[12%] h-[64vh] w-[min(78vw,880px)] -translate-x-1/2 rounded-[10px] bg-[#171512] shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
          <span className="absolute -top-5 left-0 h-7 w-36 rounded-t-[8px] bg-[#171512]" />
          <span className="absolute inset-x-0 bottom-0 h-[16%] rounded-b-[10px] bg-[#201d18]" />
        </div>
        <div className="relative h-[58vh] w-[min(78vw,880px)]">
          {slides.map((src, slideIndex) => (
            <img
              key={`${project.index}-${slideIndex}`}
              src={src}
              alt={`${project.title} 项目图片 ${slideIndex + 1}`}
              className="absolute inset-0 h-full w-full rounded-[8px] object-contain shadow-[0_24px_70px_rgba(0,0,0,0.46)] transition-[transform,opacity,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
              style={positionFor(slideIndex)}
            />
          ))}
        </div>
        <div className="relative z-30 mt-5 flex w-[min(78vw,880px)] items-center justify-between font-mono text-micro uppercase tracking-[0.16em] text-[var(--color-bone-dim)]">
          <span>{project.title}</span>
          <span>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        </div>
        <button aria-label="返回精选作品" onClick={requestClose} className="relative z-30 mt-5 flex min-h-11 items-center gap-3 border-b border-[var(--color-bone)]/40 px-3 py-2 font-mono text-label uppercase tracking-[0.16em] text-[var(--color-bone)] transition-colors hover:border-[var(--color-acid)] hover:text-[var(--color-acid)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-acid)]">
          <span aria-hidden="true">←</span> 返回精选作品
        </button>
      </div>
      <button aria-label="上一张图片" onClick={(event) => { event.stopPropagation(); previous(); }} className="absolute left-4 top-1/2 -translate-y-1/2 font-display text-4xl text-[var(--color-bone)] hover:text-[var(--color-acid)] md:left-10">←</button>
      <button aria-label="下一张图片" onClick={(event) => { event.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 font-display text-4xl text-[var(--color-bone)] hover:text-[var(--color-acid)] md:right-10">→</button>
    </div>
  );
}

// one small line-icon per project, matching what it actually does rather than
// a generic badge — kept in the same thin-stroke language as the rest of the
// site's iconography (mic/speaker/send in Assistant.tsx).
function ProjectIcon({
  kind,
  className,
  style,
}: {
  kind: IconKind;
  className?: string;
  style?: CSSProperties;
}) {
  const shared = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg className={className} style={style} {...shared}>
      {kind === "lens" && (
        <>
          <circle cx="10.2" cy="10.2" r="6.7" />
          <path d="M15.2 15.2 21 21" />
        </>
      )}
      {kind === "voice" && (
        <>
          <path d="M3 12h.01" />
          <path d="M7.5 8.5v7" />
          <path d="M12 4.5v15" />
          <path d="M16.5 8.5v7" />
          <path d="M21 12h.01" />
        </>
      )}
      {kind === "study" && (
        <path d="M2.5 4.5h6a3.5 3.5 0 0 1 3.5 3.5v13a2.5 2.5 0 0 0-2.5-2.5h-7zM21.5 4.5h-6A3.5 3.5 0 0 0 12 8v13a2.5 2.5 0 0 1 2.5-2.5h7z" />
      )}
      {kind === "collab" && (
        <>
          {/* two cursor arrows, clearly offset — reads as "live, multiple
              collaborators" rather than a single pointer */}
          <path
            d="M3 3l7.07 16.97 2.51-7.39L21 12 3 3z"
            transform="translate(-2,-2) scale(0.55)"
            fill="currentColor"
            stroke="#0f0e0c"
            strokeWidth={1}
            opacity={0.4}
          />
          <path
            d="M3 3l7.07 16.97 2.51-7.39L21 12 3 3z"
            transform="translate(7,7) scale(0.55)"
            fill="currentColor"
            stroke="#0f0e0c"
            strokeWidth={1}
          />
        </>
      )}
    </svg>
  );
}
