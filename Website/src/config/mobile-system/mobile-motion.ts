export const mobileMotion = {
  about: {
    titleY: 26,
    imageY: 54,
    textY: 18,
    imageScaleFrom: 0.94,
    imageScaleTo: 1,
    scrub: 0.32,
  },

  hero: {
    introDuration: 0.68,
    introEase: "power2.out",

    titleIntroY: 12,
    topbarIntroY: 10,
    navIntroY: 10,

    scrollDistance: 560,
    backgroundScaleTo: 1.08,

    titleSplitX: 120,
    titleFadeTo: 0,
    titleLiftTo: -8,

    scrub: 0.12,
  },

 product: {
    titleOnlyStart: 0,
    titleOnlyEnd: 0.2,

    titleFadeStart: 0.16,
    titleFadeEnd: 0.3,

    cardsRevealStart: 0.24,
    cardsRevealEnd: 0.4,

    cardsStart: 0.34,
    cardsEnd: 0.96,

    stackOffsetY: 28,
    stackScaleStep: 0.055,
    inactiveOpacity: 0.38,
    exitLift: 156,

    introOffsetY: 72,
    introScaleFrom: 0.94,
  },

  achievements: {
  introOffsetY: 60,
  introScaleFrom: 0.92,

  imageLift: 80,
  imageScale: 0.92,

  contentOffsetY: 60,

  stackOffsetY: 90,
  stackScaleStep: 0.06,

  inactiveOpacity: 0.35,
}
  
} as const;

export type MobileMotion = typeof mobileMotion;


// export const mobileMotion = {
//   about: {
//     titleY: 26,
//     imageY: 54,
//     textY: 18,
//     imageScaleFrom: 0.94,
//     imageScaleTo: 1,
//     scrub: 0.32,
//   },

// hero: {
//     introDuration: 0.68,
//     introEase: "power2.out",

//     titleIntroY: 12,
//     topbarIntroY: 10,
//     navIntroY: 10,

//     scrollDistance: 560,
//     backgroundScaleTo: 1.08,

//     titleSplitX: 120,
//     titleFadeTo: 0,
//     titleLiftTo: -8,

//     scrub: 0.12,
//   },
// } as const;

// export type MobileMotion = typeof mobileMotion;
