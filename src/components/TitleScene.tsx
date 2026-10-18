import React from "react";
import {interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {QATAR_HISTORY_TOKENS} from "../design/tokens";
import type {Episode, Scene} from "../types";

type TitleSceneProps = {
  episode: Episode;
  scene: Scene;
};

export const TitleScene: React.FC<TitleSceneProps> = ({episode, scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const sunRise = spring({
    frame,
    fps,
    config: {damping: 18, stiffness: 70},
  });

  const cardIn = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: {damping: 16, stiffness: 90},
  });

  const sunY = interpolate(sunRise, [0, 1], [75, 0]);
  const cloudDrift = Math.sin(frame / 35) * 12;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <svg
        viewBox="0 0 1560 520"
        width="1560"
        height="520"
        role="img"
        aria-label={`Title illustration for ${episode.title}`}
        style={{
          borderRadius: 28,
          backgroundColor: QATAR_HISTORY_TOKENS.palette.cream,
          border: `3px solid ${QATAR_HISTORY_TOKENS.palette.sandBorder}`,
          boxShadow: "0 16px 36px rgba(35, 51, 72, 0.08)",
          overflow: "hidden",
        }}
      >
        <defs>
          <linearGradient id="qh-morning-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FCE7C8" />
            <stop offset="60%" stopColor="#FFF8ED" />
            <stop offset="100%" stopColor="#F1DFC7" />
          </linearGradient>
          <radialGradient id="qh-sun-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sky Backdrop */}
        <rect x="0" y="0" width="1560" height="520" fill="url(#qh-morning-sky)" />

        {/* Rising Sun */}
        <g transform={`translate(0, ${sunY})`}>
          <circle cx="330" cy="250" r="145" fill="url(#qh-sun-glow)" />
          <circle cx="330" cy="250" r="76" fill="#F59E0B" />
          <circle cx="330" cy="250" r="62" fill="#FDE047" />
        </g>

        {/* Soft Drifting Clouds */}
        <g transform={`translate(${cloudDrift}, 0)`} fill="#FFFFFF" opacity="0.92">
          <rect x="140" y="92" width="150" height="44" rx="22" />
          <circle cx="185" cy="90" r="28" />
          <circle cx="230" cy="84" r="34" />
          <rect x="1180" y="106" width="170" height="46" rx="23" />
          <circle cx="1230" cy="102" r="30" />
          <circle cx="1285" cy="96" r="36" />
        </g>

        {/* Warm Sand Horizon Curves */}
        <path
          d="M0 390 Q380 330 780 380 T1560 365 L1560 520 L0 520 Z"
          fill="#EBD3B4"
        />
        <path
          d="M0 430 Q520 385 1040 425 T1560 410 L1560 520 L0 520 Z"
          fill="#DEC4A2"
        />

        {/* Morning Clock Icon on Left */}
        <g transform="translate(230, 310)">
          <circle cx="60" cy="60" r="52" fill="#FFFFFF" stroke="#8A1538" strokeWidth="8" />
          <circle cx="60" cy="60" r="42" fill="none" stroke="#F1DFC7" strokeWidth="3" />
          <line x1="60" y1="60" x2="60" y2="30" stroke="#233348" strokeWidth="6" strokeLinecap="round" />
          <line x1="60" y1="60" x2="84" y2="60" stroke="#8A1538" strokeWidth="6" strokeLinecap="round" />
          <circle cx="60" cy="60" r="6" fill="#8A1538" />
        </g>
      </svg>

      {/* Center Lesson Title Card */}
      <div
        style={{
          position: "absolute",
          maxWidth: 980,
          padding: "38px 56px",
          borderRadius: 26,
          backgroundColor: "rgba(255, 255, 255, 0.96)",
          border: `3px solid ${QATAR_HISTORY_TOKENS.palette.maroon}`,
          boxShadow: "0 18px 40px rgba(35, 51, 72, 0.12)",
          textAlign: "center",
          transform: `scale(${0.92 + cardIn * 0.08})`,
          opacity: cardIn,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: QATAR_HISTORY_TOKENS.palette.teal,
            letterSpacing: 1.2,
            marginBottom: 12,
          }}
        >
          Class 1 · Qatar History and Citizenship · {episode.id}
        </div>
        <div
          style={{
            fontSize: QATAR_HISTORY_TOKENS.typography.titleHeroSizePx,
            fontWeight: 900,
            color: QATAR_HISTORY_TOKENS.palette.navy,
            lineHeight: 1.1,
            letterSpacing: -1,
            marginBottom: 16,
          }}
        >
          {scene.heading}
        </div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 600,
            color: QATAR_HISTORY_TOKENS.palette.navyMuted,
            lineHeight: 1.35,
          }}
        >
          Today we will learn: {episode.mainFocus}
        </div>
      </div>
    </div>
  );
};
