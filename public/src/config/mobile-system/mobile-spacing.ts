export const mobileSpacing = {
  pageX: "20px",

  topbarTop: "26px",
  topbarLeft: "20px",
  topbarGap: "18px",

  heroBottomSafeSpace: "148px",

  bottomNavX: "16px",
  bottomNavY: "20px",
  bottomNavInnerX: "18px",

  heroTitleOffsetY: "0svh",
} as const;

export type MobileSpacing = typeof mobileSpacing;