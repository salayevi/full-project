export const mobileNavbar = {
  topIconSize: "78px",
  topIconInnerSize: "62px",
  topIconGap: "16px",

  bottomHeight: "78px",
  bottomRadius: "9999px",
  bottomBlur: "14px",

  collapsedHeight: "68px",
  collapsedRadius: "9999px",
  collapsedBlur: "12px",
  collapsedIconOuter: "54px",
  collapsedIconInner: "42px",
} as const;

export type MobileNavbar = typeof mobileNavbar;