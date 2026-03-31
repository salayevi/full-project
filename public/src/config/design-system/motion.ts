export const motion = {
  duration: {
    fast: 0.2,
    normal: 0.35,
    slow: 0.6,
    slower: 1,
    cinematic: 1.2,
  },

  ease: {
    default: "power2.out",
    smooth: "power3.out",
    inOut: "power2.inOut",
    dramatic: "power4.out",
    none: "none",
  },

  scale: {
    hover: 1.03,
    cardStart: 0.965,
    mediaStart: 0.985,
    backgroundZoom: 1.15,
  },

  hero: {
    titleX: "70vw",
    scrollDistance: 700,
    titleGapMobile: "24px",
    titleGapDesktop: "40px",
    mouseOffsetMobile: "56px",
    mouseOffsetDesktop: "84px",
  },
} as const

export type Motion = typeof motion