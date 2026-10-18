import React from "react";
import {spring, useCurrentFrame, useVideoConfig} from "remotion";
import {QATAR_HISTORY_TOKENS as T} from "../design/tokens";

const DAY_CARDS = [
  {step: "Morning", title: "Wake & Clean", accent: T.palette.maroon, icon: "sun" as const},
  {step: "Daytime", title: "School & Learn", accent: T.palette.teal, icon: "school" as const},
  {step: "Evening", title: "Rest & Bedtime", accent: T.palette.navy, icon: "moon" as const},
];

export const DayCardsVisual: React.FC<{activeIndex: number}> = ({activeIndex}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{width: 1560, height: 470, display: "flex", gap: 32}}>
      {DAY_CARDS.map((card, idx) => {
        const pop = spring({frame: Math.max(0, frame - idx * 12), fps, config: {damping: 15, stiffness: 95}});
        const active = idx === activeIndex;
        return (
          <div
            key={card.step}
            style={{
              flex: 1,
              borderRadius: 26,
              backgroundColor: "#FFFDF9",
              border: `4px solid ${active ? card.accent : T.palette.sandBorder}`,
              boxShadow: active ? "0 18px 40px rgba(35,51,72,0.16)" : "0 14px 32px rgba(35,51,72,0.08)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              transform: `scale(${0.9 + pop * 0.1})`,
              opacity: pop,
            }}
          >
            <svg viewBox="0 0 120 120" width="110" height="110">
              {card.icon === "sun" && (
                <g>
                  <circle cx={60} cy={60} r={34} fill="#FDE047" stroke="#F59E0B" strokeWidth={6} />
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                    <line
                      key={a}
                      x1={60 + Math.cos((a * Math.PI) / 180) * 44}
                      y1={60 + Math.sin((a * Math.PI) / 180) * 44}
                      x2={60 + Math.cos((a * Math.PI) / 180) * 54}
                      y2={60 + Math.sin((a * Math.PI) / 180) * 54}
                      stroke="#F59E0B"
                      strokeWidth={7}
                      strokeLinecap="round"
                    />
                  ))}
                </g>
              )}
              {card.icon === "school" && (
                <g>
                  <rect x={14} y={52} width={92} height={52} rx={8} fill={T.palette.teal} />
                  <path d="M8 54 L60 22 L112 54 Z" fill={T.palette.navy} />
                  <rect x={28} y={68} width={20} height={20} rx={3} fill="#FFF" opacity={0.95} />
                  <rect x={52} y={68} width={20} height={20} rx={3} fill="#FFF" opacity={0.95} />
                  <rect x={76} y={68} width={16} height={20} rx={3} fill="#FFF" opacity={0.95} />
                  <rect x={50} y={78} width={20} height={26} rx={4} fill={T.palette.navy} />
                  <line x1={60} y1={22} x2={60} y2={10} stroke={T.palette.navy} strokeWidth={5} strokeLinecap="round" />
                  <rect x={60} y={6} width={26} height={16} rx={3} fill={T.palette.maroon} />
                </g>
              )}
              {card.icon === "moon" && (
                <g>
                  <circle cx={60} cy={60} r={36} fill="#FDE68A" stroke="#D99B26" strokeWidth={6} />
                  <circle cx={76} cy={48} r={28} fill="#F1DFC7" />
                </g>
              )}
            </svg>
            <div style={{fontSize: 24, fontWeight: 800, color: card.accent}}>{card.step}</div>
            <div style={{fontSize: 44, fontWeight: 900, color: T.palette.navy}}>{card.title}</div>
          </div>
        );
      })}
    </div>
  );
};
