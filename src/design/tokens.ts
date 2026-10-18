export const QATAR_HISTORY_TOKENS = {
  palette: {
    maroon: "#8A1538",
    maroonDark: "#630E27",
    maroonSoft: "#F9EEF2",
    cream: "#FFF8ED",
    sand: "#F1DFC7",
    sandBorder: "#DEC4A2",
    teal: "#267D80",
    tealDark: "#195658",
    tealSoft: "#E6F4F4",
    navy: "#233348",
    navyMuted: "#475A72",
    white: "#FFFFFF",
    goldAccent: "#D99B26",
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', 'Avenir Next', 'Nunito', 'Trebuchet MS', system-ui, sans-serif",
    headingSizePx: 68,
    titleHeroSizePx: 82,
    keywordSizePx: 48,
    captionSizePx: 38,
    metadataSizePx: 20,
  },
  layout: {
    width: 1920,
    height: 1080,
    safeMarginX: 96, // 5% of 1920
    safeMarginY: 54, // 5% of 1080
    transitionFrames: 12, // 400ms @ 30fps (within 200-500ms requirement)
  },
} as const;
