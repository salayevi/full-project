export const colors = {
  brand: {
    primary: "var(--site-brand-primary)",
    primaryStrong: "var(--site-brand-primary-strong)",
    secondary: "var(--site-brand-secondary)",
    soft: "var(--site-brand-soft)",
  },

  background: {
    page: "var(--site-bg-page)",
    soft: "var(--site-bg-soft)",
    about: "var(--site-bg-about)",
    achievements: "var(--site-bg-achievements)",
    dark: "var(--site-bg-dark)",
    lightPanel: "var(--site-bg-light-panel)",
  },

  text: {
    primary: "var(--site-text-primary)",
    secondary: "var(--site-text-secondary)",
    muted: "var(--site-text-muted)",
    white: "var(--site-text-white)",
    whiteSoft: "var(--site-text-soft)",
  },

  border: {
    soft: "var(--site-border-soft)",
    whiteSoft: "var(--site-border-white-soft)",
    brand: "var(--site-brand-primary)",
  },

  overlay: {
    hero: "var(--site-overlay-hero)",
    navbar: "var(--site-overlay-navbar)",
    modal: "var(--site-overlay-modal)",
  },

  surface: {
    white: "var(--site-surface-white)",
    glass: "var(--site-surface-glass)",
    modal: "var(--site-surface-modal)",
  },
} as const

export type Colors = typeof colors
