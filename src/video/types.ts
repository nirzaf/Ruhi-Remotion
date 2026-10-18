export type VisualKind =
  | "playground"
  | "unfair-share"
  | "fair-share"
  | "slide-turns"
  | "invite"
  | "remember"
  | "market"
  | "different-coins"
  | "equal-worth"
  | "share-game"
  | "friendship"
  | "respect"
  | "garden"
  | "choices"
  | "choose"
  | "game-options"
  | "make-space"
  | "opportunity"
  | "art-time"
  | "oops"
  | "truth"
  | "listen"
  | "repair"
  | "brave"
  | "quiz";

export type Scene = {
  id: string;
  heading: string;
  visual: VisualKind;
  narration: string;
};

export type Episode = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  pages: string;
  keyMessage: string;
  scenes: Scene[];
};

export type AudioDurations = Record<
  string,
  Record<string, { seconds: number; frames: number }>
>;
