export const shadows = {
  soft: "0 10px 30px rgba(0,0,0,0.06)",
  card: "0 20px 60px rgba(0,0,0,0.08)",
  floating: "0 28px 80px rgba(0,0,0,0.06)",
  modal: "0 30px 80px rgba(0,0,0,0.35)",
  achievement: "0 20px 80px rgba(63,45,37,0.12)",
  glass: "0 10px 40px rgba(63,45,37,0.08)",
} as const

export type Shadows = typeof shadows