export const mobileTypography = {
  hero: {
    title: "clamp(50px, 14vw, 76px)",
    lineHeight: 0.9,
    letterSpacing: "-0.06em",
    weight: 700,
    lineGap: "4px",
  },

  nav: {
    label: "11px",
    weight: 600,
    lineHeight: 1.1,
  },
} as const;

export type MobileTypography = typeof mobileTypography;