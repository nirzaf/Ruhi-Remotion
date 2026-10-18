export type SourceRef = {
  file: string;
  page: number;
  section?: string;
  item?: string;
};

export type SceneKind = "title" | "explain" | "demonstrate" | "recap" | "handoff";

export type Scene = {
  id: string;
  kind: SceneKind;
  heading: string;
  durationFrames: number;
  narrationText: string;
  narrationAsset: string; // public/-relative path, validated before render
  captionAsset: string; // public/-relative path to episode SRT file
  visualAssetIds: string[];
  onScreenText: string[];
  sources: SourceRef[];
};

export type DeliveryWave = "P0" | "P1" | "P2";

export type EpisodeReviewStatus = "draft" | "approved" | "blocked";

export type Episode = {
  id: string;
  title: string;
  wave: DeliveryWave;
  firstMidterm: boolean;
  mainFocus: string;
  fps: 30;
  width: 1920;
  height: 1080;
  scenes: Scene[];
  reviewStatus: EpisodeReviewStatus;
};
