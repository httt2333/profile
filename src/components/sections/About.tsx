import { useRef, useState } from "react";
import { useGSAP } from "../../lib/useGSAP";
import { gsap } from "../../lib/smoothScroll";
import { Reveal } from "../ui/Reveal";

// Portrait lives in /public so it can be swapped without a rebuild.
// If it's missing, the monogram fallback below shows instead.
const portraitJpg = "/assets/zhixuan-portrait.jpg";
const portraitWebp = "/assets/zhixuan-portrait.jpg";

const STATS = [
  { value: 6, suffix: "+", label: "精选项目" },
  { value: 80, suffix: "%", label: "成片一次通过率" },
  { value: 100, suffix: "万+", label: "AI 内容播放量" },
  { value: 1, suffix: "项", label: "全国一等奖" },
];

const TIMELINE = [
  {
    range: "2026 — Now",
    role: "AI 视觉与内容应用",
    org: "腾讯 IEG · 深圳",
    note: "围绕多 Agent 内容生产、质量评估和人工复核设计视觉与内容流程。",
  },
  {
    range: "2026",
    role: "品牌内容设计与运营",
    org: "MKS 中国",
    note: "围绕本地化雇主品牌建立内容模板、视觉规则与数据复盘链路。",
  },
  {
    range: "2024 — 2025",
    role: "AI 辅助视觉运营 / 品牌视觉",
    org: "锐明技术",
    note: "将 AI 辅助视觉探索引入品牌、多端物料和业务汇报的生产流程。",
  },
  {
    range: "2023 — 2027",
    role: "数字媒体艺术",
    org: "哈尔滨工业大学（深圳）",
    note: "学习视觉设计、交互体验、数字影像、游戏引擎与技术原型。",
  },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const obj = { v: 0 };
      gsap.to(obj, {
        v: value,
        duration: 2,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 90%" },
        onUpdate: () => {
          if (ref.current) ref.current.textContent = String(Math.round(obj.v));
        },
      });
    },
    [],
    // reduced motion: show the final number immediately
    () => {
      if (ref.current) ref.current.textContent = String(value);
    },
  );
  return (
    <span className="tabular-nums">
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
}

export default function About() {
  const [imgOk, setImgOk] = useState(true);

  return (
    <section id="about" className="relative bg-[var(--color-coal)] px-[var(--gutter)] py-[14vh] md:py-[20vh]">
      <div className="grid grid-cols-12 gap-x-6 gap-y-14">
        {/* portrait — sticky, offset left, asymmetric */}
        <div className="col-span-12 md:col-span-5">
          <div className="md:sticky md:top-28">
            <p className="label mb-8">
              <span className="text-[var(--color-acid)]">[04]</span>
              <br />
              关于我
            </p>

            <figure
              data-cursor="hover"
              className="group relative aspect-[4/5] w-full max-w-[26rem] overflow-hidden rounded-[3px] bg-[radial-gradient(120%_90%_at_30%_20%,#35322e,#0e0d0b)]"
            >
              {/* monogram fallback (shows if the portrait is missing) */}
              <span className="absolute inset-0 flex items-center justify-center font-display text-mega leading-none text-[var(--color-bone)]/10">
                ZZ
              </span>

              {imgOk && (
                <picture>
                  <source srcSet={portraitWebp} type="image/webp" />
                  <img
                    src={portraitJpg}
                    alt="张紫瑄的证件照"
                    width={880}
                    height={1100}
                    loading="lazy"
                    decoding="async"
                    onError={() => setImgOk(false)}
                    className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                </picture>
              )}

              {/* acid duotone wash + grain seat */}
              <span className="pointer-events-none absolute inset-0 bg-[var(--color-acid)] opacity-0 mix-blend-color transition-opacity duration-700 group-hover:opacity-25" />
              <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(10,9,8,0.7),transparent_55%)]" />

              <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5 font-mono text-micro uppercase tracking-[0.16em] text-[var(--color-bone)]">
                <span>Zhixuan Zhang</span>
                <span className="text-[var(--color-acid)]">CN</span>
              </figcaption>
            </figure>
          </div>
        </div>

        {/* bio + experience timeline, pushed right */}
        <div className="col-span-12 md:col-span-6 md:col-start-7">
          <SplitHeading />

          <Reveal as="p" className="mt-8 max-w-[52ch] text-lead font-light leading-[1.45] text-[var(--color-bone-dim)]">
            我是张紫瑄，一名关注视觉、交互与 AI 应用的综合型设计者。我不希望设计只停在“做得好看”，而是更习惯从真实业务和用户问题出发，通过研究、视觉系统、交互原型和技术工具，把想法推进到可验证、可复用的结果。
          </Reveal>

          {/* experience timeline */}
          <ul className="mt-16 border-t edge">
            {TIMELINE.map((t) => (
              <li
                key={t.range}
                className="group grid grid-cols-12 gap-x-4 gap-y-1 border-b edge py-6 transition-colors"
              >
                <span className="col-span-12 font-mono text-micro uppercase tracking-[0.16em] text-[var(--color-ash)] md:col-span-3">
                  {t.range}
                </span>
                <div className="col-span-12 md:col-span-9">
                  <p className="font-display text-h3 leading-none text-[var(--color-bone)] transition-colors duration-500 group-hover:text-[var(--color-acid)]">
                    {t.role}
                  </p>
                  <p className="mt-2 text-body text-[var(--color-bone-dim)]">{t.org}</p>
                  <p className="mt-1 max-w-[48ch] text-body text-[var(--color-ash)]">{t.note}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-[52ch] text-body text-[var(--color-ash)]">
            现居深圳，关注视觉设计、交互体验、AI 创意应用与数字产品方向。
          </p>
        </div>
      </div>

      {/* stat band — breaks the column rhythm */}
      <div className="mt-24 grid grid-cols-2 gap-px border edge bg-[var(--color-bone)]/[0.06] md:mt-32 md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="bg-[var(--color-coal)] p-7 md:p-9">
            <p className="font-display text-h2 leading-none text-[var(--color-bone)]">
              <Counter value={s.value} suffix={s.suffix} />
            </p>
            <p className="label mt-4">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-28 grid grid-cols-12 gap-y-10 md:mt-40">
        <p className="label col-span-12 md:col-span-3">我的工作方式</p>
        <ol className="col-span-12 md:col-span-8 md:col-start-5">
          {[
            ["01", "理解问题", "用户是谁，业务真正需要解决什么，什么结果才算有效。"],
            ["02", "做出判断", "不默认从视觉开始，根据问题决定信息、交互、视觉或技术的表达方式。"],
            ["03", "快速落地", "通过 Figma、Web、Unity、AI 工具和轻量代码，把想法尽快做成可体验的原型。"],
            ["04", "用反馈继续设计", "把用户反馈、数据表现、Bad Case 和真实使用结果重新写回下一轮设计。"],
          ].map(([number, title, text]) => (
            <li key={number} className="grid grid-cols-12 gap-4 border-t edge py-7 md:gap-8">
              <span className="col-span-2 font-mono text-label text-[var(--color-acid)]">{number}</span>
              <div className="col-span-10 md:col-span-4"><h3 className="font-display text-h3 leading-none">{title}</h3></div>
              <p className="col-span-10 col-start-3 text-body leading-relaxed text-[var(--color-bone-dim)] md:col-span-6 md:col-start-7">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function SplitHeading() {
  return (
    <h2 className="text-h2 font-display leading-[0.92]">
      Designer
      <br />
      <span className="font-serif font-normal italic text-[var(--color-acid)]">with systems</span>.
    </h2>
  );
}

