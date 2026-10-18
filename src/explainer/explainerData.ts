export type ExplainerScene = {
  id: string;
  heading: string;
  narration: string;
  caption: string;
  keywords: string[];
  durationInFrames: number;
};

export const EXPLAINER_FPS = 30;
export const EXPLAINER_WIDTH = 1920;
export const EXPLAINER_HEIGHT = 1080;

/**
 * Storyboard: "My Daily Routine" 30-second cutdown of approved QH-L1-01,
 * sped up 1.3x → ~23.2s. Audio plays at normal speed (full narration).
 * Opening (0-5.8s) → Explanation (5.8-18.2s) → Conclusion (18.2-23.2s).
 * Total: 697 frames @ 30fps = ~23.23s (900 / 697 ≈ 1.29x).
 *
 * Scene lengths are audio-aware: each scene fits its pilot MP3
 * (5.29s / 6.29s / 5.05s / 4.50s) plus ~0.5s breathing room.
 */
export const DAILY_ROUTINE_EXPLAINER_ID = "explainer-daily-routine";

export const EXPLAINER_SPEEDUP = 1.3;

export const DAILY_ROUTINE_SCENES: ExplainerScene[] = [
  {
    id: "opening",
    heading: "My Daily Routine",
    narration: "Welcome to Class 1! Today we will learn about our daily routine in order.",
    caption: "Welcome to Class 1! Today we will learn about our daily routine in order.",
    keywords: ["Every day", "In order"],
    durationInFrames: 175, // 0-5.83s (fits 5.74s audio)
  },
  {
    id: "morning",
    heading: "Morning",
    narration: "First, in the morning, we wake up early feeling rested, wash, and brush our teeth.",
    caption: "First, in the morning, we wake up early feeling rested, wash, and brush our teeth.",
    keywords: ["Wake up", "Brush teeth"],
    durationInFrames: 205, // 5.83-12.67s (fits ~6.0s audio)
  },
  {
    id: "daytime",
    heading: "Daytime",
    narration: "Next, during the daytime, we eat breakfast, get dressed, and go to school.",
    caption: "Next, during the daytime, we eat breakfast, get dressed, and go to school.",
    keywords: ["Breakfast", "School"],
    durationInFrames: 167, // 12.67-18.23s (fits ~5.0s audio)
  },
  {
    id: "conclusion",
    heading: "Evening and Bedtime",
    narration: "At night we sleep on time. That is our daily routine!",
    caption: "At night we sleep on time. That is our daily routine!",
    keywords: ["Bedtime", "Healthy habit"],
    durationInFrames: 150, // 18.23-23.23s (fits 4.46s audio)
  },
];

export const DAILY_ROUTINE_TOTAL_FRAMES = DAILY_ROUTINE_SCENES.reduce(
  (sum, scene) => sum + scene.durationInFrames,
  0,
); // 697 frames ≈ 23.23s @ 30fps (1.29x speedup vs 30s)
