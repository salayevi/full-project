"use client";

import Image from "next/image";

export type MobileAchievementItem = {
  id: number;
  name: string;
  role: string;
  description: string;
  image: string;
  theme: {
    frame: string;
    ribbon: string;
    text: string;
    muted: string;
  };
};

type MobileAchievementCardProps = {
  items: MobileAchievementItem[];
  currentIndex: number;
  nextIndex: number;
  blend: number;
  frameRevealProgress: number;
  ribbonRevealProgress: number;
};

export default function MobileAchievementCard({
  items,
  currentIndex,
  nextIndex,
  blend,
  frameRevealProgress,
  ribbonRevealProgress,
}: MobileAchievementCardProps) {
  const currentItem = items[currentIndex];
  const nextItem = items[nextIndex] ?? currentItem;

  const frameOpacity = frameRevealProgress;
  const frameScale = 0.9 + frameRevealProgress * 0.1;
  const frameY = (1 - frameRevealProgress) * 115;

  const imageLift = ribbonRevealProgress * -22;

  const currentImageOpacity = 1 - blend;
  const nextImageOpacity = nextIndex === currentIndex ? 0 : blend;

  const ribbonOpacity = ribbonRevealProgress;
  const ribbonTranslateY = (1 - ribbonRevealProgress) * -104;
  const ribbonScaleY = 0.86 + ribbonRevealProgress * 0.14;

  const currentTextOpacity = 1 - blend;
  const nextTextOpacity = nextIndex === currentIndex ? 0 : blend;

  const frameColor = currentItem.theme.frame;
  const ribbonColor = currentItem.theme.ribbon;

  const frameShape =
    "polygon(2% 4%, 8% 1%, 18% 3%, 27% 0%, 40% 2%, 54% 1%, 67% 4%, 81% 2%, 92% 1%, 98% 5%, 99% 16%, 98% 28%, 99% 44%, 98% 59%, 99% 74%, 98% 88%, 96% 97%, 86% 96%, 72% 98%, 58% 97%, 43% 99%, 29% 97%, 16% 98%, 6% 96%, 2% 89%, 1% 74%, 2% 59%, 1% 44%, 2% 29%, 1% 15%)";

  return (
    <article
      className="absolute left-1/2 top-1/2 w-full"
      style={{
        transform: "translate(-50%, -50%)",
        opacity: frameOpacity,
        pointerEvents: "auto",
      }}
    >
      <div className="mx-auto w-full max-w-[390px] px-4">
        <div
          style={{
            transform: `translateY(${frameY}px) scale(${frameScale})`,
            transition: "transform 120ms linear, opacity 120ms linear",
          }}
        >
          <div className="relative mx-auto w-full max-w-[360px]">
            <div
              className="relative z-20 overflow-visible"
              style={{
                filter: "drop-shadow(0 24px 46px rgba(0,0,0,0.16))",
              }}
            >
              <div
                className="relative overflow-hidden"
                style={{
                  clipPath: frameShape,
                  background: frameColor,
                  padding: "4px",
                }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{
                    clipPath: frameShape,
                    background: "#f3f0f2",
                  }}
                >
                  <div
                    className="relative h-[clamp(348px,47svh,460px)] w-full"
                    style={{
                      transform: `translateY(${imageLift}px) scale(1.02)`,
                      transition: "transform 120ms linear",
                    }}
                  >
                    <Image
                      src={currentItem.image}
                      alt={currentItem.name}
                      fill
                      sizes="(max-width: 480px) 92vw, 360px"
                      className="object-cover object-center"
                      unoptimized
                      style={{
                        opacity: currentImageOpacity,
                        transition: "opacity 120ms linear",
                      }}
                    />

                    {nextIndex !== currentIndex ? (
                      <Image
                        src={nextItem.image}
                        alt={nextItem.name}
                        fill
                        sizes="(max-width: 480px) 92vw, 360px"
                        className="object-cover object-center"
                        unoptimized
                        style={{
                          opacity: nextImageOpacity,
                          transition: "opacity 120ms linear",
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="relative z-10 mx-auto w-[96%]"
              style={{
                marginTop: `${-70 + ribbonRevealProgress * 58}px`,
                opacity: ribbonOpacity,
                transform: `translateY(${ribbonTranslateY}px) scaleY(${ribbonScaleY})`,
                transformOrigin: "top center",
                transition:
                  "transform 120ms linear, opacity 120ms linear, margin-top 120ms linear",
              }}
            >
              <div className="absolute inset-x-[12%] bottom-[-18px] h-[30px] bg-black/20 blur-[18px]" />

              <div
                className="relative overflow-hidden rounded-t-[10px]"
                style={{
                  background: `linear-gradient(
                    180deg,
                    #ff2bad 0%,
                    ${ribbonColor} 32%,
                    #d10f8f 66%,
                    #b8077b 100%
                  )`,
                  boxShadow:
                    "0 20px 40px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -8px 18px rgba(0,0,0,0.12)",
                  clipPath:
                    "polygon(0 0, 100% 0, 100% 84%, 82% 84%, 68% 92%, 50% 100%, 32% 92%, 18% 84%, 0 84%)",
                }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-[4px]"
                  style={{ background: frameColor }}
                />

                <div className="absolute inset-x-[10%] top-[8px] h-[20px] rounded-full bg-white/15 blur-[8px]" />

                <div className="relative min-h-[276px] px-6 pb-[72px] pt-6 text-white">
                  <div
                    style={{
                      opacity: currentTextOpacity,
                      transition: "opacity 120ms linear",
                    }}
                  >
                    <p className="text-[13px] uppercase tracking-[0.16em] text-white/80">
                      {currentItem.role}
                    </p>

                    <h3 className="mt-2 text-[clamp(28px,8vw,40px)] font-bold leading-[1]">
                      {currentItem.name}
                    </h3>

                    <p
                      className="mt-4 text-[15px] leading-[1.45] text-white/85"
                      style={{ color: currentItem.theme.muted }}
                    >
                      {currentItem.description}
                    </p>
                  </div>

                  {nextIndex !== currentIndex ? (
                    <div
                      className="absolute inset-0 px-6 pb-[72px] pt-6"
                      style={{
                        opacity: nextTextOpacity,
                        transition: "opacity 120ms linear",
                        color: nextItem.theme.text,
                      }}
                    >
                      <p className="text-[13px] uppercase tracking-[0.16em] text-white/80">
                        {nextItem.role}
                      </p>

                      <h3 className="mt-2 text-[clamp(28px,8vw,40px)] font-bold leading-[1]">
                        {nextItem.name}
                      </h3>

                      <p
                        className="mt-4 text-[15px] leading-[1.45] text-white/85"
                        style={{ color: nextItem.theme.muted }}
                      >
                        {nextItem.description}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
