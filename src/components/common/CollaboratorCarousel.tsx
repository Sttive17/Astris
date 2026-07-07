import { useEffect, useState, useCallback, type ReactNode } from "react";
import { Lang } from "@/types";
import { useT } from "@/i18n/useT";
import genuineImg from "@/assets/genuine.png";
import vibralatinaImg from "@/assets/vibralatina.png";
import closerImg from "/closertothestars.png";

interface Collaborator {
  name: string;
  url: string;
  isSvg?: boolean;
  svgContent?: ReactNode;
  imgSrc?: string;
}

const COLLABORATORS: Collaborator[] = [
  {
    name: "The Genuine Foundation",
    url: "https://genuinecup.org/",
    imgSrc: genuineImg,
  },
  {
    name: "Microsoft",
    url: "https://support.microsoft.com/",
    isSvg: true,
    svgContent: (
      <svg width="60" height="60" viewBox="0 0 21 21" aria-hidden="true">
        <rect x="1" y="1" width="9" height="9" fill="#F25022" />
        <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
        <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
        <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
      </svg>
    ),
  },
  {
    name: "Closer To The Stars",
    url: "https://closertothestars.org/",
    imgSrc: closerImg,
  },
  {
    name: "Vibra Latina",
    url: "https://www.vibralatinatx.com/",
    imgSrc: vibralatinaImg,
  },
];

export function CollaboratorCarousel({ lang }: { lang: Lang }) {
  const t = useT(lang);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % COLLABORATORS.length);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const interval = setInterval(next, 1000);
    return () => clearInterval(interval);
  }, [paused, reducedMotion, next]);

  const total = COLLABORATORS.length;

  const getItem = (offset: number) => {
    const idx = ((activeIndex + offset) % total + total) % total;
    return COLLABORATORS[idx];
  };

  return (
    <div
      className="w-full select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-label={t("landing.supported")}
    >
      <div className="flex items-center justify-center gap-6 md:gap-10 min-h-[140px]">
        {/* Left (shadowed) */}
        <a
          href={getItem(-1).url}
          target="_blank"
          rel="noreferrer"
          title={getItem(-1).name}
          className="hidden sm:flex items-center justify-center rounded-2xl border-2 border-border transition-all duration-500 shrink-0"
          style={{
            width: 90,
            height: 90,
            opacity: 0.45,
            filter: "grayscale(0.6) blur(0.5px)",
            transform: "scale(0.85)",
            backgroundColor: "var(--card)",
          }}
          tabIndex={-1}
          aria-hidden="true"
        >
          {getItem(-1).isSvg ? (
            getItem(-1).svgContent
          ) : (
            <img
              src={getItem(-1).imgSrc}
              alt=""
              className="object-contain"
              style={{ width: 56, height: 56 }}
            />
          )}
        </a>

        {/* Center (active / main) */}
        <a
          href={getItem(0).url}
          target="_blank"
          rel="noreferrer"
          title={getItem(0).name}
          className="flex items-center justify-center rounded-3xl border-2 border-border shadow-lg transition-all duration-500 shrink-0 hover:scale-105 hover:shadow-xl"
          style={{
            width: 130,
            height: 130,
            backgroundColor: "var(--card)",
            zIndex: 10,
          }}
        >
          {getItem(0).isSvg ? (
            <div className="transition-transform duration-500">{getItem(0).svgContent}</div>
          ) : (
            <img
              src={getItem(0).imgSrc}
              alt={getItem(0).name}
              className="object-contain transition-transform duration-500"
              style={{ width: 80, height: 80 }}
            />
          )}
        </a>

        {/* Right (shadowed) */}
        <a
          href={getItem(1).url}
          target="_blank"
          rel="noreferrer"
          title={getItem(1).name}
          className="hidden sm:flex items-center justify-center rounded-2xl border-2 border-border transition-all duration-500 shrink-0"
          style={{
            width: 90,
            height: 90,
            opacity: 0.45,
            filter: "grayscale(0.6) blur(0.5px)",
            transform: "scale(0.85)",
            backgroundColor: "var(--card)",
          }}
          tabIndex={-1}
          aria-hidden="true"
        >
          {getItem(1).isSvg ? (
            getItem(1).svgContent
          ) : (
            <img
              src={getItem(1).imgSrc}
              alt=""
              className="object-contain"
              style={{ width: 56, height: 56 }}
            />
          )}
        </a>
      </div>

    </div>
  );
}
