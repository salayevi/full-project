export const typography = {
  fontFamily: {
    sans: "Inter, ui-sans-serif, system-ui, sans-serif",
  },

  fontSize: {
    heroSm: "88px",
    heroMd: "132px",
    heroLg: "220px",
    heroXl: "280px",

    displayLg: "120px",
    displayMd: "80px",

    h1: "64px",
    h2: "48px",
    h3: "32px",
    h4: "24px",

    bodyLg: "20px",
    body: "16px",
    bodySm: "14px",
    caption: "12px",
  },

  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    none: 1,
    tight: 1.1,
    normal: 1.5,
    relaxed: 1.8,
  },

  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.03em",
    normal: "0",
    wide: "0.18em",
    wider: "0.28em",
    widest: "0.45em",
  },
} as const

export type Typography = typeof typography