import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {QATAR_HISTORY_TOKENS} from "../design/tokens";
import type {Episode, Scene} from "../types";
import {CaptionLine} from "./CaptionLine";

type SceneLayoutProps = {
  episode: Episode;
  scene: Scene;
  sceneIndex: number;
  totalScenes: number;
  episodeProgress: number;
  children: React.ReactNode;
};

export const SceneLayout: React.FC<SceneLayoutProps> = ({
  episode,
  scene,
  sceneIndex,
  totalScenes,
  episodeProgress,
  children,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const tFrames = QATAR_HISTORY_TOKENS.layout.transitionFrames;
  const fade = interpolate(
    frame,
    [0, tFrames, Math.max(tFrames + 1, scene.durationFrames - tFrames), scene.durationFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const headingEnter = spring({
    frame: Math.max(0, frame - 2),
    fps,
    config: {damping: 16, stiffness: 100},
  });

  const waveLabel =
    episode.wave === "P0"
      ? "First Midterm Core · Lesson 1 & 2"
      : episode.wave === "P1"
        ? "Lesson 3 · Greetings"
        : "Optional Enrichment · Grades 1–3 Quiz";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: QATAR_HISTORY_TOKENS.palette.cream,
        fontFamily: QATAR_HISTORY_TOKENS.typography.fontFamily,
        color: QATAR_HISTORY_TOKENS.palette.navy,
        opacity: fade,
        overflow: "hidden",
      }}
    >
      {/* Top Safe-Area Header Strip (≥5% outer margin = 96px left/right, 54px top) */}
      <div
        style={{
          position: "absolute",
          top: QATAR_HISTORY_TOKENS.layout.safeMarginY,
          left: QATAR_HISTORY_TOKENS.layout.safeMarginX,
          right: QATAR_HISTORY_TOKENS.layout.safeMarginX,
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `2px solid ${QATAR_HISTORY_TOKENS.palette.sandBorder}`,
          paddingBottom: 14,
          zIndex: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: QATAR_HISTORY_TOKENS.typography.metadataSizePx,
            fontWeight: 800,
            color: QATAR_HISTORY_TOKENS.palette.maroon,
          }}
        >
          <span>Qatar History and Citizenship</span>
          <span aria-hidden="true">·</span>
          <span style={{color: QATAR_HISTORY_TOKENS.palette.navy}}>{episode.id}: {episode.title}</span>
          <span aria-hidden="true">·</span>
          <span style={{color: QATAR_HISTORY_TOKENS.palette.teal}}>{waveLabel}</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: QATAR_HISTORY_TOKENS.typography.metadataSizePx,
            fontWeight: 700,
            color: QATAR_HISTORY_TOKENS.palette.navyMuted,
          }}
        >
          {episode.reviewStatus !== "approved" && (
            <span
              style={{
                color: QATAR_HISTORY_TOKENS.palette.maroon,
                fontWeight: 900,
              }}
            >
              DRAFT PREVIEW — NOT FINAL
            </span>
          )}
          <span>
            Scene {sceneIndex + 1} of {totalScenes}
          </span>
        </div>
      </div>

      {/* Scene Heading (68px per Section 5 target 65–90px) */}
      {scene.kind !== "title" && (
        <div
          style={{
            position: "absolute",
            top: QATAR_HISTORY_TOKENS.layout.safeMarginY + 72,
            left: QATAR_HISTORY_TOKENS.layout.safeMarginX,
            right: QATAR_HISTORY_TOKENS.layout.safeMarginX,
            textAlign: "center",
            transform: `translateY(${(1 - headingEnter) * 14}px)`,
            opacity: headingEnter,
            zIndex: 20,
          }}
        >
          <div
            style={{
              fontSize: QATAR_HISTORY_TOKENS.typography.headingSizePx,
              fontWeight: 900,
              color: QATAR_HISTORY_TOKENS.palette.navy,
              lineHeight: 1.12,
              letterSpacing: -0.8,
            }}
          >
            {scene.heading}
          </div>
        </div>
      )}

      {/* Main Visual Stage */}
      <div
        style={{
          position: "absolute",
          top: scene.kind === "title" ? 130 : 215,
          left: QATAR_HISTORY_TOKENS.layout.safeMarginX,
          right: QATAR_HISTORY_TOKENS.layout.safeMarginX,
          height: scene.kind === "title" ? 590 : 515,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 15,
        }}
      >
        {children}
      </div>

      {/* Synchronized Burned-in Captions & On-Screen Keywords */}
      <CaptionLine
        narrationText={scene.narrationText}
        onScreenText={scene.onScreenText}
        durationFrames={scene.durationFrames}
      />

      {/* Subtle Bottom Progress Strip inside Safe Area */}
      <div
        style={{
          position: "absolute",
          left: QATAR_HISTORY_TOKENS.layout.safeMarginX,
          right: QATAR_HISTORY_TOKENS.layout.safeMarginX,
          bottom: QATAR_HISTORY_TOKENS.layout.safeMarginY - 12,
          height: 8,
          borderRadius: 99,
          backgroundColor: QATAR_HISTORY_TOKENS.palette.sand,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.max(2, Math.min(100, episodeProgress * 100))}%`,
            height: "100%",
            backgroundColor: QATAR_HISTORY_TOKENS.palette.maroon,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
