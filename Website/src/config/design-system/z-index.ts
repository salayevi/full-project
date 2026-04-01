export const zIndex = {
  base: 1,
  content: 10,
  overlay: 20,
  navbar: 50,
  intro: 60,
  finalIntro: 80,
  modal: 9999,
} as const

export type ZIndex = typeof zIndex