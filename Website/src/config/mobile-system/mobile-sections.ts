export const mobileSections = {
  about: {
    minHeight: "235svh",
    stickyTop: "0px",

    frameMaxWidth: "min(84vw, 350px)",
    imageRadius: "28px",
    imageBorderWidth: "2px",
    imageHeight: "clamp(360px, 50svh, 440px)",

    imageShiftY: "-56px",

    titleTopOffset: "22svh",
    contentMaxWidth: "min(78vw, 300px)",
    infoGap: "20px",
  },

  product: {
    minHeight: "380svh",
    stickyHeight: "100svh",
    frameMaxWidth: "min(calc(100vw - 24px), 390px)",
    titleTopOffset: "0svh",
    cardMaxWidth: "min(calc(100vw - 34px), 392px)",
    cardRadius: "30px",
    cardMinHeight: "clamp(560px, 76svh, 710px)",
    contentBottomOffset: "110px",
  },

  achievements: {
    minHeight: "280svh",
    frameMaxWidth: "380px",
    titleTopOffset: "12vh",
    cardMaxWidth: "360px",
    cardRadius: "28px",
    cardMinHeight: "560px",
  },

  footer: {
    minHeight: "100svh",
    contentMaxWidth: "380px",
    bottomPadding: "120px",
  },
} as const;

export type MobileSections = typeof mobileSections;

// export const mobileSections = {
//   about: {
//     minHeight: "235svh",
//     stickyTop: "0px",

//     frameMaxWidth: "min(84vw, 350px)",
//     imageRadius: "28px",
//     imageBorderWidth: "2px",
//     imageHeight: "clamp(360px, 50svh, 440px)",

//     imageShiftY: "-56px",

//     titleTopOffset: "22svh",
//     contentMaxWidth: "min(78vw, 300px)",
//     infoGap: "20px",
//   },

//   product: {
//     minHeight: "320svh",
//     stickyHeight: "100svh",
//     frameMaxWidth: "380px",
//     titleTopOffset: "14vh",
//     cardMaxWidth: "360px",
//     cardRadius: "28px",
//     cardMinHeight: "560px",
//     contentBottomOffset: "110px",
//   },

//   achievements: {
//     minHeight: "280svh",
//     frameMaxWidth: "380px",
//     titleTopOffset: "12vh",
//     cardMaxWidth: "360px",
//     cardRadius: "28px",
//     cardMinHeight: "560px",
//   },

//   footer: {
//     minHeight: "100svh",
//     contentMaxWidth: "380px",
//     bottomPadding: "120px",
//   },
// } as const;

// export type MobileSections = typeof mobileSections;
