export type CastId = "ruhi" | "aima" | "nuh" | "fathima";

export type ContentKind = "SOURCE_ADAPTATION" | "ORIGINAL";

export type VisualKind =
  // Episode 1: Justice & Injustice
  | "playground"
  | "sweets-start"
  | "share-equally"
  | "unfair-share"
  | "choose-better"
  | "slide-turns"
  | "help-include"
  | "recap-justice"
  // Episode 2: Wealth & Poverty
  | "market"
  | "different-coins"
  | "equal-worth"
  | "kind-example"
  | "respect"
  | "kind-or-unkind"
  | "recap-wealth"
  // Episode 3: Equality of Opportunity
  | "garden"
  | "four-favorites"
  | "choices-accepted"
  | "game-options"
  | "chance-to-join"
  | "participation"
  | "recap-opportunity"
  // Episode 4: Challenging Injustice
  | "art-time"
  | "accident"
  | "feelings"
  | "admit"
  | "say-sorry"
  | "help-repair"
  | "tell-the-truth"
  | "respect-things"
  | "recap-injustice"
  // Shared reflection prompt
  | "quiz"
  // Legacy VisualKind aliases for compatibility
  | "fair-share"
  | "invite"
  | "remember"
  | "share-game"
  | "friendship"
  | "choices"
  | "choose"
  | "make-space"
  | "opportunity"
  | "oops"
  | "truth"
  | "listen"
  | "repair"
  | "brave";

export type Scene = {
  id: string;
  heading: string;
  visual: VisualKind;
  narration: string;
  sourceIds?: string[];
  contentKind?: ContentKind;
  speakerId?: CastId | "narrator";
  withholdAnswer?: boolean;
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
