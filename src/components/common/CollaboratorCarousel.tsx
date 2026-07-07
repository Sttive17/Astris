import { useEffect, useState, type ReactNode } from "react";
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

  useEffect(() => {
    if (paused || reducedMotion) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % COLLABORATORS.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [paused, reducedMotion]);

  return (
    <div
      className="w-full select-none overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-label={t("landing.supported")}
      style={{ perspective: "1000px" }}
    >
      <div className="relative flex items-center justify-center min-h-[160px]">
        {COLLABORATORS.map((item, idx) => {
          // Calculate offset relative to activeIndex (0 to 3)
          const offset = (idx - activeIndex + COLLABORATORS.length) % COLLABORATORS.length;
          
          let translateX = 0;
          let scale = 1;
          let opacity = 1;
          let zIndex = 10;
          let filter = "none";
          let rotateY = 0;

          if (offset === 0) {
            // Active / Center
            translateX = 0;
            scale = 1.1;
            opacity = 1;
            zIndex = 30;
            rotateY = 0;
            filter = "none";
          } else if (offset === 1) {
            // Right Shadowed
            translateX = 120;
            scale = 0.85;
            opacity = 0.5;
            zIndex = 20;
            rotateY = -15;
            filter = "grayscale(0.6) blur(1px)";
          } else if (offset === 3) {
            // Left Shadowed
            translateX = -120;
            scale = 0.85;
            opacity = 0.5;
            zIndex = 20;
            rotateY = 15;
            filter = "grayscale(0.6) blur(1px)";
          } else {
            // Hidden (Behind)
            translateX = 0;
            scale = 0.5;
            opacity = 0;
            zIndex = 0;
            rotateY = 0;
          }

          return (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              title={item.name}
              className="absolute flex items-center justify-center rounded-3xl border-2 border-border bg-card p-4 transition-all duration-700 ease-in-out hover:!opacity-100 hover:!filter-none"
              style={{
                width: 140,
                height: 100,
                transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                opacity,
                zIndex,
                filter,
                boxShadow: offset === 0 ? "0 20px 40px -10px rgba(0,0,0,0.2)" : "none",
              }}
              tabIndex={offset === 0 ? 0 : -1}
              aria-hidden={offset !== 0}
            >
              {item.isSvg ? (
                <div className="flex items-center justify-center transition-transform duration-500 w-12 h-12">
                  {item.svgContent}
                </div>
              ) : (
                <img
                  src={item.imgSrc}
                  alt={item.name}
                  className="object-contain transition-transform duration-500 w-full h-full max-h-12"
                />
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
