import React from "react";
import {spring, useCurrentFrame, useVideoConfig} from "remotion";
import {QATAR_HISTORY_TOKENS as T} from "../design/tokens";

export const OpeningVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cardIn = spring({frame: Math.max(0, frame - 8), fps, config: {damping: 16, stiffness: 90}});
  const bob = Math.sin(frame / 30) * 6;
  return (
    <div style={{width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative"}}>
      <svg viewBox="0 0 1560 500" width="1560" height="500" style={{borderRadius: 28, backgroundColor: "#FCE7C8", border: `3px solid ${T.palette.sandBorder}`, overflow: "hidden"}}>
        <rect x={0} y={0} width={1560} height={500} fill="#FCE7C8" />
        <g transform={`translate(330, ${220 + bob})`}>
          <circle cx={0} cy={0} r={112} fill="#FBBF24" opacity={0.25} />
          <circle cx={0} cy={0} r={70} fill="#FDE047" stroke="#F59E0B" strokeWidth={6} />
        </g>
        <g fill="#FFFFFF" opacity={0.92}>
          <rect x={140} y={90} width={150} height={44} rx={22} />
          <rect x={1180} y={104} width={170} height={46} rx={23} />
        </g>
        <path d="M0 380 Q380 330 780 375 T1560 360 L1560 500 L0 500 Z" fill="#EBD3B4" />
        <path d="M0 420 Q520 380 1040 418 T1560 405 L1560 500 L0 500 Z" fill="#DEC4A2" />
      </svg>
      <div
        style={{
          position: "absolute",
          padding: "36px 56px",
          borderRadius: 26,
          backgroundColor: "rgba(255,255,255,0.96)",
          border: `3px solid ${T.palette.maroon}`,
          textAlign: "center",
          transform: `scale(${0.92 + cardIn * 0.08})`,
          opacity: cardIn,
        }}
      >
        <div style={{fontSize: 24, fontWeight: 800, color: T.palette.teal, marginBottom: 10}}>Class 1 · Qatar History and Citizenship</div>
        <div style={{fontSize: T.typography.titleHeroSizePx, fontWeight: 900, color: T.palette.navy, lineHeight: 1.1}}>My Daily Routine</div>
      </div>
    </div>
  );
};

export const ConclusionVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cardIn = spring({frame, fps, config: {damping: 16, stiffness: 90}});
  const twinkle = 0.6 + Math.abs(Math.sin(frame / 18)) * 0.4;
  return (
    <div style={{width: 1560, height: 470, borderRadius: 28, backgroundColor: T.palette.navy, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.94 + cardIn * 0.06})`, opacity: cardIn}}>
      {[200, 500, 800, 1100, 1350].map((x, i) => (
        <circle key={x} cx={x} cy={90 + (i % 3) * 60} r={6} fill="#FFF" opacity={twinkle} />
      ))}
      <svg viewBox="0 0 200 200" width="220" height="220" style={{position: "absolute", left: 220}}>
        <circle cx={100} cy={100} r={80} fill="#FDE68A" stroke="#D99B26" strokeWidth={8} />
        <circle cx={136} cy={76} r={62} fill={T.palette.navy} opacity={0.16} />
      </svg>
      <div style={{position: "absolute", right: 140, textAlign: "center", color: "#FFF"}}>
        <div style={{fontSize: 64, fontWeight: 900, lineHeight: 1.15}}>Sleep on time.</div>
        <div style={{fontSize: 40, fontWeight: 600, color: T.palette.sand, marginTop: 12}}>A healthy habit!</div>
      </div>
    </div>
  );
};
