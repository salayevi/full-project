export const sizes = {
  layout: {
    desktopContainer: "1200px",
    desktopWide: "1360px",
    desktopTextMeasure: "68ch",
    gutter: "clamp(24px, 3vw, 56px)",
    sectionGap: "clamp(72px, 10vh, 140px)",
  },

  hero: {
    titleMobile: "140px",
    containerMax: "1280px",
    titleDesktop: "clamp(140px, 16vw, 220px)",
    sectionHeight: "100svh",
  },

  about: {
    imageWidth: "clamp(420px, 28vw, 520px)",
    imageHeight: "clamp(520px, 38vw, 640px)",
    textWidth: "clamp(340px, 26vw, 460px)",
  },

  achievements: {
    desktopImageHeight: "clamp(480px, 60vh, 720px)",
  },

  product: {
    sceneExtraSlides: 1.45,
    cardMaxWidth: "1180px",
    cardHeight: "min(74vh, 820px)",
    cardMinHeight: "600px",
    introTitleDesktop: "7rem",
    mediaMax: "78%",
    infoMaxWidth: "32rem",
    mediaPanelPaddingX: "2.5rem",
    mediaPanelPaddingY: "2rem",
    contentPanelPaddingX: "3rem",
    contentPanelPaddingY: "2.25rem",
    actionMinHeight: "56px",
  },

  auth: {
    modalMaxWidth: "28rem",
  },
} as const;

export type Sizes = typeof sizes;
