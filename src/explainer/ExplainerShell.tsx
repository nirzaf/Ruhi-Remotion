import React from "react";
import {interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {QATAR_HISTORY_TOKENS as T} from "../design/tokens";

export const KeywordPill: React.FC<{words: string[]}> = ({words}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 18,
      padding: "8px 32px",
      borderRadius: 18,
      backgroundColor: T.palette.maroon,
      color: T.palette.white,
      boxShadow: "0 8px 20px rgba(138, 21, 56, 0.22)",
    }}
  >
    {words.map((word, i) => (
      <React.Fragment key={word}>
        {i > 0 && (
          <span aria-hidden style={{fontSize: 40, fontWeight: 700, color: T.palette.sand}}>
            ·
          </span>
        )}
        <span style={{fontSize: T.typography.keywordSizePx, fontWeight: 800, lineHeight: 1.15}}>{word}</span>
      </React.Fragment>
    ))}
  </div>
);

export const CaptionBar: React.FC<{text: string; enterFrame: number}> = ({text, enterFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: Math.max(0, frame - enterFrame), fps, config: {damping: 16, stiffness: 110}});
  return (
    <div
      style={{
        maxWidth: 1520,
        width: "100%",
        padding: "18px 36px",
        borderRadius: 20,
        backgroundColor: T.palette.white,
        border: `3px solid ${T.palette.sandBorder}`,
        boxShadow: "0 12px 28px rgba(35, 51, 72, 0.10)",
        textAlign: "center",
        transform: `translateY(${interpolate(enter, [0, 1], [18, 0])}px)`,
        opacity: enter,
      }}
    >
      <div style={{fontSize: T.typography.captionSizePx, fontWeight: 700, lineHeight: 1.35, color: T.palette.navy}}>{text}</div>
    </div>
  );
};

export const SceneShell: React.FC<{
  heading: string;
  sceneIndex: number;
  durationInFrames: number;
  keywords: string[];
  caption: string;
  children: React.ReactNode;
}> = ({heading, sceneIndex, durationInFrames, keywords, caption, children}) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 12, Math.max(13, durationInFrames - 12), durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{position: "absolute", inset: 0, backgroundColor: T.palette.cream, fontFamily: T.typography.fontFamily, color: T.palette.navy, opacity: fade, overflow: "hidden"}}>
      <div style={{position: "absolute", top: T.layout.safeMarginY, left: T.layout.safeMarginX, right: T.layout.safeMarginX, display: "flex", justifyContent: "space-between", fontSize: T.typography.metadataSizePx, fontWeight: 800, color: T.palette.maroon, borderBottom: `2px solid ${T.palette.sandBorder}`, paddingBottom: 14}}>
        <span>
          Qatar History and Citizenship <span aria-hidden>·</span> <span style={{color: T.palette.navy}}>My Daily Routine</span>
        </span>
        <span style={{color: T.palette.navyMuted}}>Part {sceneIndex + 1} of 4</span>
      </div>
      <div style={{position: "absolute", top: T.layout.safeMarginY + 72, left: T.layout.safeMarginX, right: T.layout.safeMarginX, textAlign: "center"}}>
        <div style={{fontSize: T.typography.headingSizePx, fontWeight: 900, letterSpacing: -0.8}}>{heading}</div>
      </div>
      <div style={{position: "absolute", top: 218, left: T.layout.safeMarginX, right: T.layout.safeMarginX, height: 500, display: "flex", alignItems: "center", justifyContent: "center"}}>{children}</div>
      <div style={{position: "absolute", left: T.layout.safeMarginX, right: T.layout.safeMarginX, bottom: T.layout.safeMarginY + 18, display: "flex", flexDirection: "column", alignItems: "center", gap: 14}}>
        <KeywordPill words={keywords} />
        <CaptionBar text={caption} enterFrame={4} />
      </div>
    </div>
  );
};
