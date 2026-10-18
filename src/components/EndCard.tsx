import React from "react";
import {interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {QATAR_HISTORY_TOKENS} from "../design/tokens";
import type {Episode} from "../types";

type EndCardProps = {
  episode: Episode;
};

export const EndCard: React.FC<EndCardProps> = ({episode}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const cardIn = spring({
    frame,
    fps,
    config: {damping: 16, stiffness: 90},
  });

  const scale = interpolate(cardIn, [0, 1], [0.94, 1]);

  return (
    <div
      style={{
        width: 1560,
        height: 520,
        borderRadius: 28,
        backgroundColor: QATAR_HISTORY_TOKENS.palette.cream,
        border: `3px solid ${QATAR_HISTORY_TOKENS.palette.sandBorder}`,
        boxShadow: "0 16px 36px rgba(35, 51, 72, 0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "48px 72px",
        transform: `scale(${scale})`,
        opacity: cardIn,
      }}
    >
      {/* Left Summary Column */}
      <div style={{maxWidth: 880}}>
        <div
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: QATAR_HISTORY_TOKENS.palette.teal,
            marginBottom: 12,
          }}
        >
          Lesson Complete · {episode.id}
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: QATAR_HISTORY_TOKENS.palette.navy,
            lineHeight: 1.12,
            marginBottom: 20,
          }}
        >
          Ready for One School Question
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: QATAR_HISTORY_TOKENS.palette.navyMuted,
            lineHeight: 1.4,
          }}
        >
          Great listening! Next, your tutor will ask one question at a time from your school study material.
        </div>
      </div>

      {/* Right Notebook & Check Badge Illustration (No MCQ or Answer Key Shown) */}
      <svg
        viewBox="0 0 360 360"
        width="340"
        height="340"
        role="img"
        aria-label="Study notebook ready for practice"
      >
        <circle cx="180" cy="180" r="156" fill={QATAR_HISTORY_TOKENS.palette.sand} />
        <rect
          x="88"
          y="64"
          width="184"
          height="232"
          rx="20"
          fill="#FFFFFF"
          stroke={QATAR_HISTORY_TOKENS.palette.navy}
          strokeWidth="6"
        />
        <rect
          x="88"
          y="64"
          width="32"
          height="232"
          rx="10"
          fill={QATAR_HISTORY_TOKENS.palette.maroon}
        />
        <line x1="144" y1="118" x2="240" y2="118" stroke={QATAR_HISTORY_TOKENS.palette.teal} strokeWidth="8" strokeLinecap="round" />
        <line x1="144" y1="158" x2="228" y2="158" stroke={QATAR_HISTORY_TOKENS.palette.sandBorder} strokeWidth="8" strokeLinecap="round" />
        <line x1="144" y1="198" x2="216" y2="198" stroke={QATAR_HISTORY_TOKENS.palette.sandBorder} strokeWidth="8" strokeLinecap="round" />
        <circle cx="246" cy="248" r="42" fill={QATAR_HISTORY_TOKENS.palette.teal} stroke="#FFFFFF" strokeWidth="6" />
        <path
          d="M228 248 L241 261 L266 236"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
