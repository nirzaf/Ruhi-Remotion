import React from "react";
import {interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {QATAR_HISTORY_TOKENS} from "../design/tokens";

type CaptionLineProps = {
  narrationText: string;
  onScreenText: string[];
  durationFrames?: number;
};

export function splitIntoCaptionSegments(text: string): string[] {
  const rawSentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (rawSentences.length <= 1) {
    return [text];
  }
  const merged: string[] = [];
  for (const sentence of rawSentences) {
    if (merged.length > 0 && merged[merged.length - 1].length + 1 + sentence.length <= 115) {
      merged[merged.length - 1] = `${merged[merged.length - 1]} ${sentence}`;
    } else {
      merged.push(sentence);
    }
  }
  return merged;
}

export const CaptionLine: React.FC<CaptionLineProps> = ({
  narrationText,
  onScreenText,
  durationFrames = 300,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: {damping: 16, stiffness: 110},
  });

  const translateY = interpolate(enter, [0, 1], [18, 0]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  const segments = splitIntoCaptionSegments(narrationText);
  const totalChars = Math.max(1, segments.reduce((sum, s) => sum + s.length, 0));
  const speechWindowFrames = Math.max(1, durationFrames * 0.92);
  const progress = Math.max(0, Math.min(0.999, frame / speechWindowFrames));

  let cumulative = 0;
  let activeSegment = segments[segments.length - 1];
  for (const seg of segments) {
    cumulative += seg.length / totalChars;
    if (progress <= cumulative) {
      activeSegment = seg;
      break;
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        left: QATAR_HISTORY_TOKENS.layout.safeMarginX,
        right: QATAR_HISTORY_TOKENS.layout.safeMarginX,
        bottom: QATAR_HISTORY_TOKENS.layout.safeMarginY + 18,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        transform: `translateY(${translateY}px)`,
        opacity,
        zIndex: 30,
      }}
    >
      {/* Large Class-1 On-Screen Keywords (44–64px target per Section 5) */}
      {onScreenText.length > 0 && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 18,
            padding: "8px 28px",
            borderRadius: 16,
            backgroundColor: QATAR_HISTORY_TOKENS.palette.maroon,
            color: QATAR_HISTORY_TOKENS.palette.white,
            boxShadow: "0 8px 20px rgba(138, 21, 56, 0.22)",
          }}
        >
          {onScreenText.map((word, index) => (
            <React.Fragment key={word}>
              {index > 0 && (
                <span
                  aria-hidden="true"
                  style={{
                    fontSize: 40,
                    fontWeight: 700,
                    color: QATAR_HISTORY_TOKENS.palette.sand,
                  }}
                >
                  ·
                </span>
              )}
              <span
                style={{
                  fontSize: QATAR_HISTORY_TOKENS.typography.keywordSizePx,
                  fontWeight: 800,
                  letterSpacing: 0.3,
                  lineHeight: 1.15,
                }}
              >
                {word}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Burned-in Synchronized English Caption Box (1–2 lines, high contrast) */}
      <div
        style={{
          maxWidth: 1520,
          width: "100%",
          padding: "18px 36px",
          borderRadius: 20,
          backgroundColor: QATAR_HISTORY_TOKENS.palette.white,
          border: `3px solid ${QATAR_HISTORY_TOKENS.palette.sandBorder}`,
          boxShadow: "0 12px 28px rgba(35, 51, 72, 0.10)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: QATAR_HISTORY_TOKENS.typography.captionSizePx,
            fontWeight: 700,
            lineHeight: 1.35,
            color: QATAR_HISTORY_TOKENS.palette.navy,
            letterSpacing: 0.2,
          }}
        >
          {activeSegment}
        </div>
      </div>
    </div>
  );
};
