import React from "react";
import {interpolate, spring} from "remotion";
import {Character, friends, type Friend, type PoseKind, FourCharacterStaging} from "./Character";
import type {Scene} from "./types";

type ArtProps = {
  scene: Scene;
  frame: number;
  durationInFrames: number;
};

// --- Shared Scenery Components ---

export const SceneryBackground: React.FC<{frame: number; variant?: "outdoor" | "garden" | "market" | "art"}> = ({
  frame,
  variant = "outdoor",
}) => {
  const cloud1X = ((frame * 0.75) % 1520) - 160;
  const cloud2X = (((frame * 0.45) + 520) % 1520) - 160;
  const cloud3X = (((frame * 0.25) + 1040) % 1520) - 160;

  const sunRotate = frame * 0.35;
  const sunPulse = 1 + Math.sin(frame / 18) * 0.03;

  if (variant === "art") {
    // Indoor Classroom Art Setting
    return (
      <div style={{position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none"}}>
        {/* Soft pastel wall */}
        <div style={{position: "absolute", inset: 0, background: "linear-gradient(180deg, #FFF6E8 0%, #FFF0D6 60%, #EAD8BD 100%)"}} />
        {/* Colorful triangle pennant bunting across top */}
        <svg style={{position: "absolute", top: 0, left: 0, width: "100%", height: 60}} viewBox="0 0 1320 60" preserveAspectRatio="none">
          <path d="M0 8 Q660 30 1320 8" fill="none" stroke="#D1B898" strokeWidth="2.5" />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((i) => {
            const x = i * 90 + 30;
            const y = 8 + Math.sin((i / 14) * Math.PI) * 14;
            const colors = ["#FF6E7F", "#FBBF24", "#34D399", "#60A5FA", "#A78BFA", "#F472B6"];
            return (
              <polygon
                key={i}
                points={`${x},${y} ${x + 40},${y} ${x + 20},${y + 40}`}
                fill={colors[i % colors.length]}
                opacity="0.9"
              />
            );
          })}
        </svg>

        {/* Classroom pictures hanging on the wall */}
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 50,
            width: 110,
            height: 85,
            background: "#FFFFFF",
            border: "4px solid #DFCCA9",
            borderRadius: 8,
            boxShadow: "0 6px 12px rgba(100,80,50,0.08)",
            padding: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{fontSize: 28}}>🎨</div>
          <div style={{fontSize: 11, fontWeight: 900, color: "#927150", marginTop: 2}}>ART CORNER</div>
        </div>

        <div
          style={{
            position: "absolute",
            right: 80,
            top: 50,
            width: 110,
            height: 85,
            background: "#FFFFFF",
            border: "4px solid #DFCCA9",
            borderRadius: 8,
            boxShadow: "0 6px 12px rgba(100,80,50,0.08)",
            padding: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{fontSize: 28}}>⭐</div>
          <div style={{fontSize: 11, fontWeight: 900, color: "#927150", marginTop: 2}}>GOOD EFFORT</div>
        </div>

        {/* Art table surface */}
        <div
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            bottom: 0,
            height: 120,
            background: "linear-gradient(180deg, #D4A373 0%, #BC8A5F 100%)",
            borderRadius: "18px 18px 0 0",
            boxShadow: "0 -8px 24px rgba(139, 90, 43, 0.15)",
            borderTop: "6px solid #E6BA8E",
          }}
        >
          <div style={{position: "absolute", top: 22, left: 40, right: 40, height: 2, background: "rgba(255,255,255,0.25)"}} />
          <div style={{position: "absolute", top: 58, left: 80, right: 60, height: 2, background: "rgba(0,0,0,0.06)"}} />
        </div>
      </div>
    );
  }

  // Outdoor / Garden / Market Environment
  return (
    <div style={{position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none"}}>
      {/* Dynamic Animated Sun */}
      <div
        style={{
          position: "absolute",
          left: 95,
          top: 35,
          width: 90,
          height: 90,
          transform: `scale(${sunPulse})`,
          transformOrigin: "center center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -24,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(254, 240, 138, 0.45) 0%, rgba(254, 240, 138, 0) 70%)",
          }}
        />
        <svg
          style={{position: "absolute", inset: 0, transform: `rotate(${sunRotate}deg)`}}
          viewBox="0 0 90 90"
        >
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              x1="45"
              y1="5"
              x2="45"
              y2="15"
              stroke="#FDE047"
              strokeWidth="4"
              strokeLinecap="round"
              transform={`rotate(${angle} 45 45)`}
            />
          ))}
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 16,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #FDE047 0%, #F59E0B 100%)",
            boxShadow: "0 0 20px rgba(245, 158, 11, 0.4)",
          }}
        />
      </div>

      {/* Floating Fluffy Clouds */}
      <svg style={{position: "absolute", left: cloud1X, top: 40, opacity: 0.88}} width="140" height="60" viewBox="0 0 140 60">
        <path d="M20 45 Q5 45 5 32 Q5 20 22 20 Q30 5 50 6 Q68 6 75 18 Q85 10 100 12 Q115 14 118 28 Q135 28 135 42 Q135 55 120 55 H20 Z" fill="#FFFFFF" />
      </svg>
      <svg style={{position: "absolute", left: cloud2X, top: 75, opacity: 0.72}} width="110" height="50" viewBox="0 0 140 60">
        <path d="M20 45 Q5 45 5 32 Q5 20 22 20 Q30 5 50 6 Q68 6 75 18 Q85 10 100 12 Q115 14 118 28 Q135 28 135 42 Q135 55 120 55 H20 Z" fill="#FFFFFF" />
      </svg>
      <svg style={{position: "absolute", left: cloud3X, top: 25, opacity: 0.65}} width="160" height="70" viewBox="0 0 140 60">
        <path d="M20 45 Q5 45 5 32 Q5 20 22 20 Q30 5 50 6 Q68 6 75 18 Q85 10 100 12 Q115 14 118 28 Q135 28 135 42 Q135 55 120 55 H20 Z" fill="#FFFFFF" />
      </svg>

      {/* Background Hill */}
      <div
        style={{
          position: "absolute",
          left: -40,
          right: -40,
          bottom: 40,
          height: 140,
          borderRadius: "50% 50% 0 0",
          background: variant === "market"
            ? "linear-gradient(180deg, #FDE68A 0%, #FCD34D 100%)"
            : "linear-gradient(180deg, #A7E3B6 0%, #8FD3A2 100%)",
          opacity: 0.6,
        }}
      />

      {/* Foreground Meadow Hill */}
      <div
        style={{
          position: "absolute",
          left: 10,
          right: 10,
          bottom: 0,
          height: 115,
          borderRadius: "45% 45% 24px 24px",
          background: variant === "market"
            ? "linear-gradient(180deg, #FCD34D 0%, #F59E0B 100%)"
            : "linear-gradient(180deg, #86EFAC 0%, #4ADE80 50%, #22C55E 100%)",
          boxShadow: "inset 0 4px 12px rgba(255,255,255,0.6)",
          border: "4px solid rgba(255,255,255,0.7)",
        }}
      >
        {/* Swaying Wildflowers */}
        {[80, 220, 390, 650, 820, 1020, 1180, 1260].map((posX, i) => {
          const sway = Math.sin((frame + i * 22) / 14) * 6;
          const flowerColors = ["#F43F5E", "#FBBF24", "#A855F7", "#38BDF8", "#FB7185"];
          const col = flowerColors[i % flowerColors.length];
          return (
            <div
              key={posX}
              style={{
                position: "absolute",
                left: posX,
                top: 18 + (i % 3) * 6,
                transform: `rotate(${sway}deg)`,
                transformOrigin: "bottom center",
              }}
            >
              <svg width="24" height="28" viewBox="0 0 24 28">
                <path d="M12 28 Q11 16 12 10" stroke="#166534" strokeWidth="2.5" fill="none" />
                <path d="M12 18 Q6 16 7 20" stroke="#15803D" strokeWidth="2" fill="none" />
                <circle cx="12" cy="8" r="6" fill={col} />
                <circle cx="12" cy="8" r="2.5" fill="#FEF08A" />
              </svg>
            </div>
          );
        })}
      </div>

      {/* Decorative Tree on the Left */}
      <div style={{position: "absolute", left: 18, bottom: 65}}>
        <svg width="120" height="180" viewBox="0 0 120 180">
          <path d="M52 180 L52 110 Q52 95 62 85 L62 180 Z" fill="#854D0E" />
          <circle cx="60" cy="80" r="48" fill="#15803D" />
          <circle cx="45" cy="65" r="34" fill="#22C55E" />
          <circle cx="75" cy="65" r="32" fill="#4ADE80" />
          <circle cx="60" cy="50" r="30" fill="#86EFAC" />
          <circle cx="45" cy="72" r="5" fill="#EF4444" />
          <circle cx="72" cy="82" r="5" fill="#EF4444" />
          <circle cx="58" cy="54" r="4.5" fill="#EF4444" />
        </svg>
      </div>
    </div>
  );
};

// --- Character Positioning Helper ---
const Person: React.FC<{
  friend: Friend;
  left: number;
  frame: number;
  width?: number;
  pose?: PoseKind;
  zIndex?: number;
  scale?: number;
  bottom?: number;
  label?: boolean;
}> = ({friend, left, frame, width = 230, pose, zIndex = 5, scale = 1, bottom = 12, label = true}) => {
  const delay = Math.min(8, Math.max(0, Math.floor(left / 180)));
  const entrance = spring({
    frame: Math.max(0, frame - delay),
    fps: 30,
    config: {damping: 14, stiffness: 100},
  });
  const bob = Math.sin((frame + left) / 16) * 3;

  return (
    <div
      style={{
        position: "absolute",
        left,
        bottom,
        transform: `translateY(${(1 - entrance) * 50 + bob}px) scale(${(0.92 + entrance * 0.08) * scale})`,
        transformOrigin: "bottom center",
        zIndex,
      }}
    >
      <Character friend={friend} width={width} pose={pose} frame={frame} label={label} />
    </div>
  );
};

// --- Props & Decorative Illustrations ---

// Playground Slide
const PlaygroundSlide: React.FC<{frame: number}> = ({frame}) => {
  const flagWave = Math.sin(frame / 5) * 6;
  return (
    <svg
      style={{position: "absolute", right: 28, top: 32, filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.12))", zIndex: 4}}
      width="390"
      height="370"
      viewBox="0 0 390 370"
    >
      <rect x="78" y="90" width="14" height="230" rx="4" fill="#B45309" />
      <rect x="156" y="90" width="14" height="230" rx="4" fill="#92400E" />

      {[130, 168, 206, 244, 282].map((y) => (
        <rect key={y} x="82" y={y} width="84" height="8" rx="4" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
      ))}

      <rect x="70" y="80" width="105" height="16" rx="5" fill="#EF4444" />
      <path d="M72 80 V50 Q120 40 172 50 V80" fill="none" stroke="#F87171" strokeWidth="6" strokeLinecap="round" />

      <line x1="72" y1="50" x2="72" y2="18" stroke="#475569" strokeWidth="4" />
      <path
        d={`M72 20 L108 ${28 + flagWave} L72 38 Z`}
        fill="#3B82F6"
        stroke="#1D4ED8"
        strokeWidth="1.5"
      />

      <path
        d="M172 90 Q225 100 248 180 Q270 255 350 310"
        fill="none"
        stroke="#1E40AF"
        strokeWidth="48"
        strokeLinecap="round"
      />
      <path
        d="M172 86 Q225 96 248 176 Q270 251 350 306"
        fill="none"
        stroke="#3B82F6"
        strokeWidth="38"
        strokeLinecap="round"
      />
      <path
        d="M172 82 Q225 92 248 172 Q270 247 348 302"
        fill="none"
        stroke="#93C5FD"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M172 108 Q225 118 248 198 Q270 273 350 328"
        fill="none"
        stroke="#1D4ED8"
        strokeWidth="12"
        strokeLinecap="round"
      />
    </svg>
  );
};

// Delicious Cartoon Sweets / Wrapped Candy
export const Candy: React.FC<{left: number; top: number; color: string; rotation?: number; scale?: number}> = ({
  left,
  top,
  color,
  rotation = 0,
  scale = 1,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        transform: `rotate(${rotation}deg) scale(${scale})`,
        transformOrigin: "center center",
        filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.15))",
        zIndex: 10,
      }}
    >
      <svg width="44" height="26" viewBox="0 0 44 26">
        <path d="M4 13 L0 3 Q6 10 10 13 Q6 16 0 23 Z" fill={color} opacity="0.85" />
        <path d="M40 13 L44 3 Q38 10 34 13 Q38 16 44 23 Z" fill={color} opacity="0.85" />
        <ellipse cx="22" cy="13" rx="15" ry="11" fill={color} stroke="#FFFFFF" strokeWidth="2" />
        <ellipse cx="22" cy="13" rx="9" ry="6" fill="#FFFFFF" opacity="0.35" />
        <line x1="16" y1="5" x2="28" y2="21" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
      </svg>
    </div>
  );
};

// Golden Star Token
export const StarCoin: React.FC<{left: number; top: number; size?: number; frame?: number; delay?: number}> = ({
  left,
  top,
  size = 46,
  frame = 0,
  delay = 0,
}) => {
  const shimmer = Math.sin((frame - delay) / 8) * 0.15;
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #FDE047 0%, #F59E0B 70%, #D97706 100%)",
        border: "3px solid #FEF08A",
        boxShadow: "0 6px 14px rgba(217, 119, 6, 0.35)",
        display: "grid",
        placeItems: "center",
        transform: `scale(${1 + shimmer})`,
        zIndex: 10,
      }}
    >
      <span style={{fontSize: size * 0.55, color: "#78350F"}}>★</span>
    </div>
  );
};

// Pulsing Heart Symbol
export const Heart: React.FC<{left: number; top: number; size?: number; color?: string; frame?: number}> = ({
  left,
  top,
  size = 56,
  color = "#F43F5E",
  frame = 0,
}) => {
  const pulse = 1 + Math.sin(frame / 8) * 0.08;
  const floatY = Math.sin(frame / 12) * 5;

  return (
    <div
      style={{
        position: "absolute",
        left,
        top: top + floatY,
        transform: `scale(${pulse})`,
        filter: "drop-shadow(0 6px 12px rgba(244, 63, 94, 0.3))",
        zIndex: 15,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 64 64">
        <path
          d="M32 54 C20 44 4 32 4 18 C4 8 12 2 22 2 C28 2 32 6 32 6 C32 6 36 2 42 2 C52 2 60 8 60 18 C60 32 44 44 32 54 Z"
          fill={color}
          stroke="#FFFFFF"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
};

// Speech Bubble
export const SpeechBubble: React.FC<{
  left: number;
  top: number;
  text: string;
  arrowDir?: "bottom" | "left" | "right";
  width?: number;
}> = ({left, top, text, width = 240}) => {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        padding: "10px 16px",
        borderRadius: 20,
        background: "rgba(255, 255, 255, 0.98)",
        border: "3px solid #3B82F6",
        boxShadow: "0 8px 20px rgba(15, 23, 42, 0.12)",
        textAlign: "center",
        fontSize: 18,
        fontWeight: 800,
        color: "#1E293B",
        zIndex: 20,
      }}
    >
      {text}
      <div
        style={{
          position: "absolute",
          bottom: -10,
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderTop: "10px solid #3B82F6",
        }}
      />
    </div>
  );
};

// Wooden Building Block
export const Block: React.FC<{
  x: number;
  y: number;
  color: string;
  letter?: string;
  size?: number;
  rotation?: number;
}> = ({x, y, color, letter = "★", size = 46, rotation = 0}) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: 8,
        background: color,
        border: "3px solid rgba(255,255,255,0.7)",
        boxShadow: "0 6px 12px rgba(0,0,0,0.18)",
        display: "grid",
        placeItems: "center",
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "center center",
        zIndex: 8,
      }}
    >
      <span style={{fontSize: size * 0.45, fontWeight: 900, color: "#FFFFFF", textShadow: "0 1px 2px rgba(0,0,0,0.3)"}}>
        {letter}
      </span>
    </div>
  );
};

// Food Choice Card
const FoodCard: React.FC<{
  left: number;
  top: number;
  childName: string;
  foodName: string;
  emoji: string;
  color: string;
  badgeColor: string;
  frame: number;
  delay: number;
}> = ({left, top, childName, foodName, emoji, color, badgeColor, frame, delay}) => {
  const enter = spring({frame: Math.max(0, frame - delay), fps: 30, config: {damping: 14, stiffness: 90}});
  const bob = Math.sin((frame + delay * 5) / 14) * 3;

  return (
    <div
      style={{
        position: "absolute",
        left,
        top: top + bob,
        width: 170,
        padding: "14px 10px",
        borderRadius: 20,
        background: "rgba(255, 255, 255, 0.98)",
        border: `3px solid ${badgeColor}`,
        boxShadow: "0 10px 24px rgba(15, 23, 42, 0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        transform: `translateY(${(1 - enter) * 40}px) scale(${enter})`,
        zIndex: 12,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: `${color}25`,
          border: `2px solid ${color}44`,
          display: "grid",
          placeItems: "center",
          fontSize: 34,
          marginBottom: 6,
        }}
      >
        {emoji}
      </div>
      <div style={{fontSize: 16, fontWeight: 900, color: "#0F172A", lineHeight: 1.1}}>{foodName}</div>
      <div
        style={{
          marginTop: 6,
          padding: "3px 10px",
          borderRadius: 999,
          background: `${badgeColor}22`,
          color: badgeColor,
          fontSize: 13,
          fontWeight: 800,
        }}
      >
        {childName}
      </div>
    </div>
  );
};

// --- Main Illustration Component ---

export const Illustration: React.FC<ArtProps> = ({scene, frame}) => {
  const appear = spring({frame, fps: 30, config: {damping: 15, stiffness: 85}});

  // Four-character horizontal layout coordinates across 1320 stage
  const pos4 = [100, 370, 640, 910];
  const pos3 = [140, 545, 950];
  const pos2 = [290, 780];

  return (
    <div
      style={{
        position: "relative",
        width: 1320,
        height: 560,
        margin: "0 auto",
        transform: `scale(${0.96 + appear * 0.04})`,
        transformOrigin: "center bottom",
      }}
    >
      {/* Dynamic Background by visual type */}
      <SceneryBackground
        frame={frame}
        variant={
          scene.visual.startsWith("art") ||
          scene.visual === "accident" ||
          scene.visual === "feelings" ||
          scene.visual === "admit" ||
          scene.visual === "say-sorry" ||
          scene.visual === "help-repair" ||
          scene.visual === "tell-the-truth" ||
          scene.visual === "respect-things" ||
          scene.visual === "recap-injustice"
            ? "art"
            : scene.visual === "garden" ||
              scene.visual === "four-favorites" ||
              scene.visual === "choices-accepted" ||
              scene.visual === "game-options" ||
              scene.visual === "chance-to-join" ||
              scene.visual === "participation" ||
              scene.visual === "recap-opportunity"
            ? "garden"
            : scene.visual === "market" ||
              scene.visual === "different-coins" ||
              scene.visual === "equal-worth" ||
              scene.visual === "kind-example" ||
              scene.visual === "respect" ||
              scene.visual === "kind-or-unkind" ||
              scene.visual === "recap-wealth"
            ? "market"
            : "outdoor"
        }
      />

      {/* ========================================================================= */}
      {/* EPISODE 1: JUSTICE & INJUSTICE                                            */}
      {/* ========================================================================= */}

      {/* 1.1 Welcome Playground */}
      {scene.visual === "playground" && (
        <>
          <PlaygroundSlide frame={frame} />
          {/* Fairness Explorers Banner */}
          <div
            style={{
              position: "absolute",
              left: 400,
              top: 25,
              padding: "8px 24px",
              borderRadius: 999,
              background: "rgba(255, 255, 255, 0.95)",
              border: "3px solid #FF6E7F",
              boxShadow: "0 6px 16px rgba(255, 110, 127, 0.25)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              zIndex: 10,
            }}
          >
            <span style={{fontSize: 22}}>🌟</span>
            <span style={{fontSize: 20, fontWeight: 900, color: "#1E293B", letterSpacing: 1}}>
              FAIRNESS EXPLORERS
            </span>
            <span style={{fontSize: 22}}>🌟</span>
          </div>

          <Person friend={friends.ruhi} left={pos4[0]} frame={frame} pose={frame < 45 ? "wave" : "stand"} />
          <Person friend={friends.aima} left={pos4[1]} frame={frame} pose={frame >= 20 && frame < 65 ? "wave" : "stand"} />
          <Person friend={friends.nuh} left={pos4[2]} frame={frame} pose={frame >= 40 && frame < 85 ? "cheer" : "stand"} />
          <Person friend={friends.fathima} left={pos4[3]} frame={frame} pose={frame >= 60 ? "wave" : "stand"} />
        </>
      )}

      {/* 1.2 Sweets Start: 8 Countable Sweets on Mat */}
      {scene.visual === "sweets-start" && (
        <>
          {/* Picnic Blanket */}
          <div
            style={{
              position: "absolute",
              left: 60,
              right: 60,
              bottom: 8,
              height: 68,
              borderRadius: 24,
              background: "repeating-linear-gradient(90deg, #FDE68A 0 25px, #FEF3C7 25px 50px)",
              border: "3px dashed #F59E0B",
              opacity: 0.9,
              zIndex: 2,
            }}
          />

          <Person friend={{...friends.ruhi, expression: "thinking"}} left={pos4[0]} frame={frame} pose="stand" bottom={68} label={false} />
          <Person friend={{...friends.aima, expression: "thinking"}} left={pos4[1]} frame={frame} pose="stand" bottom={68} label={false} />
          <Person friend={{...friends.nuh, expression: "thinking"}} left={pos4[2]} frame={frame} pose="stand" bottom={68} label={false} />
          <Person friend={{...friends.fathima, expression: "thinking"}} left={pos4[3]} frame={frame} pose="stand" bottom={68} label={false} />

          {/* Central Sharing Platter with exactly 8 visible sweets */}
          <div
            style={{
              position: "absolute",
              left: 470,
              bottom: 18,
              width: 380,
              height: 82,
              borderRadius: 41,
              background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
              border: "4px solid #F59E0B",
              boxShadow: "0 10px 24px rgba(245, 158, 11, 0.25)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 8,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -14,
                padding: "2px 14px",
                borderRadius: 999,
                background: "#F59E0B",
                color: "#FFFFFF",
                fontSize: 14,
                fontWeight: 900,
                letterSpacing: 0.5,
              }}
            >
              8 SWEETS TO SHARE
            </div>

            {/* 8 sweets placed neatly on platter */}
            <div style={{position: "relative", width: 340, height: 36}}>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                const colors = ["#EF4444", "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EC4899", "#14B8A6", "#6366F1"];
                const sweetX = i * 42 + 8;
                return <Candy key={i} left={sweetX} top={5} color={colors[i]} rotation={(i % 2 === 0 ? 1 : -1) * 8} />;
              })}
            </div>
          </div>

        </>
      )}

      {/* 1.3 Share Equally: Sweets Travel Exactly 2 per Child (8 total conserved) */}
      {scene.visual === "share-equally" && (
        <>
          <div
            style={{
              position: "absolute",
              left: 60,
              right: 60,
              bottom: 8,
              height: 68,
              borderRadius: 24,
              background: "repeating-linear-gradient(90deg, #FDE68A 0 25px, #FEF3C7 25px 50px)",
              border: "3px dashed #F59E0B",
              opacity: 0.9,
              zIndex: 2,
            }}
          />

          <Person friend={{...friends.ruhi, expression: "happy"}} left={pos4[0]} frame={frame} pose={frame > 40 ? "cheer" : "reach"} bottom={68} label={false} />
          <Person friend={{...friends.aima, expression: "happy"}} left={pos4[1]} frame={frame} pose={frame > 40 ? "cheer" : "reach"} bottom={68} label={false} />
          <Person friend={{...friends.nuh, expression: "happy"}} left={pos4[2]} frame={frame} pose={frame > 40 ? "cheer" : "reach"} bottom={68} label={false} />
          <Person friend={{...friends.fathima, expression: "happy"}} left={pos4[3]} frame={frame} pose={frame > 40 ? "cheer" : "reach"} bottom={68} label={false} />

          {/* 4 Child Sharing Plates with Continuous Moving Sweets */}
          {[
            {name: "Ruhi", x: pos4[0] + 35, colors: ["#EF4444", "#3B82F6"], border: "#FF6E7F"},
            {name: "Aima", x: pos4[1] + 35, colors: ["#10B981", "#8B5CF6"], border: "#10B981"},
            {name: "Nuh", x: pos4[2] + 35, colors: ["#F59E0B", "#EC4899"], border: "#3B82F6"},
            {name: "Fathima", x: pos4[3] + 35, colors: ["#14B8A6", "#6366F1"], border: "#8B5CF6"},
          ].map((plate, pIdx) => {
            const animProgress = interpolate(frame, [10 + pIdx * 6, 35 + pIdx * 6], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const startX = 630;
            const startY = 320;
            const targetX = plate.x + 25;
            const targetY = 485;
            const curX = startX + (targetX - startX) * animProgress;
            const arcHeight = Math.sin(animProgress * Math.PI) * 75;
            const curY = startY + (targetY - startY) * animProgress - arcHeight;

            return (
              <div key={plate.name}>
                {/* Plate on the blanket */}
                <div
                  style={{
                    position: "absolute",
                    left: plate.x,
                    bottom: 14,
                    width: 160,
                    height: 52,
                    borderRadius: 26,
                    background: "#FFFFFF",
                    border: `3px solid ${plate.border}`,
                    boxShadow: "0 6px 14px rgba(0, 0, 0, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 6,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      bottom: -11,
                      padding: "1px 10px",
                      borderRadius: 999,
                      background: "#FFFFFF",
                      border: `2px solid ${plate.border}`,
                      fontSize: 12,
                      fontWeight: 900,
                      color: "#1E293B",
                    }}
                  >
                    {plate.name}
                  </div>

                  {frame > 35 && (
                    <div
                      style={{
                        position: "absolute",
                        top: -12,
                        padding: "2px 10px",
                        borderRadius: 999,
                        background: "#10B981",
                        color: "#FFFFFF",
                        fontSize: 12,
                        fontWeight: 900,
                      }}
                    >
                      2 Sweets · Fair!
                    </div>
                  )}
                </div>

                {/* Exactly 2 sweets per plate */}
                <Candy
                  left={curX - 18}
                  top={curY - 10}
                  color={plate.colors[0]}
                  rotation={-10}
                />
                <Candy
                  left={curX + 22}
                  top={curY - 6}
                  color={plate.colors[1]}
                  rotation={12}
                />
              </div>
            );
          })}
        </>
      )}

      {/* 1.4 Unfair Share: One person takes all demo tokens */}
      {scene.visual === "unfair-share" && (
        <>
          <div
            style={{
              position: "absolute",
              left: 60,
              right: 60,
              bottom: 8,
              height: 68,
              borderRadius: 24,
              background: "repeating-linear-gradient(90deg, #FDE68A 0 25px, #FEF3C7 25px 50px)",
              border: "3px dashed #F59E0B",
              opacity: 0.9,
              zIndex: 2,
            }}
          />

          <Person friend={{...friends.nuh, expression: "thinking"}} left={pos4[0]} frame={frame} pose="reach" bottom={68} label={false} />
          <Person friend={{...friends.ruhi, expression: "surprised"}} left={pos4[1]} frame={frame} pose="stand" bottom={68} label={false} />
          <Person friend={{...friends.aima, expression: "sad"}} left={pos4[2]} frame={frame} pose="stand" bottom={68} label={false} />
          <Person friend={{...friends.fathima, expression: "worried"}} left={pos4[3]} frame={frame} pose="stand" bottom={68} label={false} />

          {/* Unfair Banner */}
          <div
            style={{
              position: "absolute",
              left: 360,
              top: 30,
              padding: "8px 24px",
              borderRadius: 999,
              background: "#FEE2E2",
              border: "3px solid #EF4444",
              color: "#991B1B",
              fontWeight: 900,
              fontSize: 18,
              boxShadow: "0 6px 14px rgba(239, 68, 68, 0.2)",
              zIndex: 10,
            }}
          >
            ⚠️ UNFAIR: One person kept all 4 tokens!
          </div>

          {/* Nuh's tray with all 4 tokens */}
          <div
            style={{
              position: "absolute",
              left: pos4[0] + 15,
              bottom: 14,
              width: 200,
              height: 52,
              borderRadius: 26,
              background: "#FFFFFF",
              border: "3px solid #EF4444",
              boxShadow: "0 8px 16px rgba(239, 68, 68, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              zIndex: 8,
            }}
          >
            <div style={{position: "absolute", top: -12, padding: "1px 8px", background: "#EF4444", color: "#FFF", borderRadius: 999, fontSize: 12, fontWeight: 900}}>
              Nuh: 4 Tokens (All)
            </div>
            {[0, 1, 2, 3].map((i) => (
              <StarCoin key={i} left={i * 38 + 18} top={6} size={36} frame={frame} />
            ))}
          </div>

          {/* Empty plates for friends */}
          {[
            {name: "Ruhi", x: pos4[1]},
            {name: "Aima", x: pos4[2]},
            {name: "Fathima", x: pos4[3]},
          ].map((child) => (
            <div
              key={child.name}
              style={{
                position: "absolute",
                left: child.x + 35,
                bottom: 14,
                width: 160,
                height: 52,
                borderRadius: 26,
                background: "#FFFFFF",
                border: "2px dashed #94A3B8",
                display: "grid",
                placeItems: "center",
                color: "#94A3B8",
                fontSize: 13,
                fontWeight: 800,
                zIndex: 6,
              }}
            >
              <div style={{position: "absolute", bottom: -11, padding: "1px 8px", borderRadius: 999, background: "#FFF", border: "1px solid #CBD5E1", fontSize: 11, fontWeight: 900, color: "#64748B"}}>
                {child.name}
              </div>
              0 Tokens (None left)
            </div>
          ))}
        </>
      )}

      {/* 1.5 Choose Better: Nuh apologizes and shares tokens */}
      {scene.visual === "choose-better" && (
        <>
          <div
            style={{
              position: "absolute",
              left: 60,
              right: 60,
              bottom: 8,
              height: 68,
              borderRadius: 24,
              background: "repeating-linear-gradient(90deg, #FDE68A 0 25px, #FEF3C7 25px 50px)",
              border: "3px dashed #F59E0B",
              opacity: 0.9,
              zIndex: 2,
            }}
          />

          <Person friend={{...friends.nuh, expression: "apologetic"}} left={pos4[0]} frame={frame} pose="offer" bottom={68} label={false} />
          <Person friend={{...friends.ruhi, expression: "happy"}} left={pos4[1]} frame={frame} pose="receive" bottom={68} label={false} />
          <Person friend={{...friends.aima, expression: "happy"}} left={pos4[2]} frame={frame} pose="receive" bottom={68} label={false} />
          <Person friend={{...friends.fathima, expression: "happy"}} left={pos4[3]} frame={frame} pose="receive" bottom={68} label={false} />

          {/* Speech bubble from Nuh */}
          <SpeechBubble left={pos4[0] - 20} top={70} text="I am sorry! Let's share fairly." width={260} />

          {/* 1 token each on all 4 plates */}
          {[
            {name: "Nuh", x: pos4[0]},
            {name: "Ruhi", x: pos4[1]},
            {name: "Aima", x: pos4[2]},
            {name: "Fathima", x: pos4[3]},
          ].map((child) => (
            <div
              key={child.name}
              style={{
                position: "absolute",
                left: child.x + 35,
                bottom: 14,
                width: 160,
                height: 52,
                borderRadius: 26,
                background: "#FFFFFF",
                border: "3px solid #10B981",
                boxShadow: "0 6px 14px rgba(16, 185, 129, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 8,
              }}
            >
              <div style={{position: "absolute", bottom: -11, padding: "1px 8px", borderRadius: 999, background: "#FFF", border: "2px solid #10B981", fontSize: 12, fontWeight: 900, color: "#1E293B"}}>
                {child.name}
              </div>
              <div style={{position: "absolute", top: -12, padding: "1px 8px", background: "#10B981", color: "#FFF", borderRadius: 999, fontSize: 12, fontWeight: 900}}>
                1 Token · Fair!
              </div>
              <StarCoin left={58} top={6} size={38} frame={frame} />
            </div>
          ))}
        </>
      )}

      {/* 1.6 Slide Turns: Four distinct exclusive turns */}
      {scene.visual === "slide-turns" && (
        <>
          <PlaygroundSlide frame={frame} />

          {/* Turn order indicator banner */}
          <div
            style={{
              position: "absolute",
              left: 80,
              top: 25,
              display: "flex",
              alignItems: "center",
              gap: 12,
              zIndex: 15,
            }}
          >
            {[
              {name: "1. Ruhi", turn: 0, color: "#FF6E7F"},
              {name: "2. Aima", turn: 1, color: "#10B981"},
              {name: "3. Nuh", turn: 2, color: "#3B82F6"},
              {name: "4. Fathima", turn: 3, color: "#8B5CF6"},
            ].map((step) => {
              const active = Math.floor(frame / 55) === step.turn;
              return (
                <div
                  key={step.name}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 999,
                    background: active ? step.color : "rgba(255,255,255,0.9)",
                    color: active ? "#FFFFFF" : "#475569",
                    fontWeight: 900,
                    fontSize: 16,
                    border: `2px solid ${step.color}`,
                    transform: active ? "scale(1.08)" : "scale(1)",
                    boxShadow: active ? `0 6px 16px ${step.color}44` : "none",
                  }}
                >
                  {step.name}
                </div>
              );
            })}
          </div>

          {/* Animated Slider & Queue according to turn beat */}
          {(() => {
            const currentTurn = Math.min(3, Math.floor(frame / 55));
            const subFrame = frame % 55;
            // Slide coordinates from top platform (1040, 110) to bottom (1240, 360)
            const slideProg = interpolate(subFrame, [10, 45], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const slideX = 1040 + slideProg * 200;
            const slideY = 110 + slideProg * 250;

            const turnCast = [friends.ruhi, friends.aima, friends.nuh, friends.fathima];
            const activeChild = turnCast[currentTurn];
            const waitingChildren = turnCast.filter((_, i) => i !== currentTurn);

            return (
              <>
                {/* Active Child Riding Slide */}
                <div
                  style={{
                    position: "absolute",
                    left: slideX,
                    top: slideY,
                    transform: "translate(-50%, -50%)",
                    zIndex: 12,
                  }}
                >
                  <Character friend={activeChild} width={180} pose={slideProg > 0.8 ? "cheer" : "reach"} frame={frame} />
                </div>

                {/* Waiting Children standing patiently in queue */}
                {waitingChildren.map((f, qIdx) => (
                  <Person
                    key={f.name}
                    friend={f}
                    left={140 + qIdx * 250}
                    frame={frame}
                    pose="stand"
                  />
                ))}
              </>
            );
          })()}
        </>
      )}

      {/* 1.7 Help & Include: Fathima helps Aima, Ruhi/Nuh invite */}
      {scene.visual === "help-include" && (
        <>
          <Person friend={{...friends.fathima, expression: "happy"}} left={pos4[0]} frame={frame} pose="kneel" />
          <Person friend={{...friends.aima, expression: "happy"}} left={pos4[1]} frame={frame} pose="reach" />
          <Person friend={{...friends.ruhi, expression: "happy"}} left={pos4[2]} frame={frame} pose="wave" />
          <Person friend={{...friends.nuh, expression: "happy"}} left={pos4[3]} frame={frame} pose="cheer" />

          {/* Fallen blocks being collected */}
          <Block x={pos4[0] + 160} y={480} color="#F59E0B" letter="A" size={38} rotation={15} />
          <Block x={pos4[0] + 205} y={490} color="#3B82F6" letter="B" size={38} rotation={-8} />
          <Block x={pos4[0] + 180} y={445} color="#EF4444" letter="C" size={38} />

          {/* Four Action Badges */}
          <div
            style={{
              position: "absolute",
              left: 280,
              top: 30,
              display: "flex",
              gap: 16,
              zIndex: 12,
            }}
          >
            {[
              {icon: "🤝", label: "Help"},
              {icon: "🍰", label: "Share"},
              {icon: "🔄", label: "Take Turns"},
              {icon: "❤️", label: "Show Respect"},
            ].map((badge) => (
              <div
                key={badge.label}
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  background: "#FFFFFF",
                  border: "2px solid #FF6E7F",
                  boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 900,
                  fontSize: 16,
                  color: "#1E293B",
                }}
              >
                <span>{badge.icon}</span>
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 1.8 Recap: All four characters celebrate fairness */}
      {scene.visual === "recap-justice" && (
        <>
          <FourCharacterStaging
            frame={frame}
            poses={{ruhi: "cheer", aima: "wave", nuh: "cheer", fathima: "wave"}}
            expressions={{ruhi: "happy", aima: "happy", nuh: "happy", fathima: "happy"}}
          />
          <Heart left={620} top={35} size={70} frame={frame} />
        </>
      )}

      {/* ========================================================================= */}
      {/* EPISODE 2: WEALTH & POVERTY                                               */}
      {/* ========================================================================= */}

      {/* 2.1 Welcome School Fair */}
      {scene.visual === "market" && (
        <>
          {/* Fairground Bunting */}
          <div
            style={{
              position: "absolute",
              left: 360,
              top: 25,
              padding: "8px 24px",
              borderRadius: 999,
              background: "rgba(255, 255, 255, 0.95)",
              border: "3px solid #F59E0B",
              boxShadow: "0 6px 16px rgba(245, 158, 11, 0.25)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              zIndex: 10,
            }}
          >
            <span style={{fontSize: 22}}>🎪</span>
            <span style={{fontSize: 20, fontWeight: 900, color: "#1E293B", letterSpacing: 1}}>
              THE SCHOOL FAIR
            </span>
            <span style={{fontSize: 22}}>🎪</span>
          </div>

          <FourCharacterStaging
            frame={frame}
            poses={{ruhi: "wave", aima: "stand", nuh: "wave", fathima: "stand"}}
          />
        </>
      )}

      {/* 2.2 Different Amounts of Pretend Tokens */}
      {scene.visual === "different-coins" && (
        <>
          <Person friend={{...friends.nuh, expression: "happy"}} left={pos2[0]} frame={frame} pose="offer" bottom={68} label={false} />
          <Person friend={{...friends.aima, expression: "happy"}} left={pos2[1]} frame={frame} pose="stand" bottom={68} label={false} />

          {/* Pretend Game Tokens Label */}
          <div
            style={{
              position: "absolute",
              left: 420,
              top: 30,
              padding: "8px 20px",
              borderRadius: 999,
              background: "#FEF3C7",
              border: "3px solid #F59E0B",
              color: "#92400E",
              fontWeight: 900,
              fontSize: 17,
              zIndex: 10,
            }}
          >
            ⭐ Pretend Game Tokens (Different Amounts) ⭐
          </div>

          {/* Nuh's Tokens Counter */}
          <div
            style={{
              position: "absolute",
              left: pos2[0] + 15,
              bottom: 14,
              width: 200,
              height: 52,
              borderRadius: 26,
              background: "#FFFFFF",
              border: "3px solid #3B82F6",
              boxShadow: "0 6px 14px rgba(59, 130, 246, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              zIndex: 8,
            }}
          >
            <div style={{position: "absolute", bottom: -11, padding: "1px 10px", background: "#FFF", border: "2px solid #3B82F6", borderRadius: 999, fontSize: 12, fontWeight: 900, color: "#1E293B"}}>
              Nuh
            </div>
            <div style={{position: "absolute", top: -12, padding: "1px 8px", background: "#3B82F6", color: "#FFF", borderRadius: 999, fontSize: 12, fontWeight: 900}}>
              5 Tokens
            </div>
            {[0, 1, 2, 3, 4].map((i) => (
              <StarCoin key={i} left={i * 36 + 12} top={6} size={34} frame={frame} />
            ))}
          </div>

          {/* Aima's Tokens Counter */}
          <div
            style={{
              position: "absolute",
              left: pos2[1] + 15,
              bottom: 14,
              width: 200,
              height: 52,
              borderRadius: 26,
              background: "#FFFFFF",
              border: "3px solid #10B981",
              boxShadow: "0 6px 14px rgba(16, 185, 129, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              zIndex: 8,
            }}
          >
            <div style={{position: "absolute", bottom: -11, padding: "1px 10px", background: "#FFF", border: "2px solid #10B981", borderRadius: 999, fontSize: 12, fontWeight: 900, color: "#1E293B"}}>
              Aima
            </div>
            <div style={{position: "absolute", top: -12, padding: "1px 8px", background: "#10B981", color: "#FFF", borderRadius: 999, fontSize: 12, fontWeight: 900}}>
              2 Tokens
            </div>
            {[0, 1].map((i) => (
              <StarCoin key={i} left={i * 40 + 60} top={6} size={34} frame={frame} />
            ))}
          </div>
        </>
      )}

      {/* 2.3 Equal Importance: Everyone Matters */}
      {scene.visual === "equal-worth" && (
        <>
          <Person friend={{...friends.nuh, expression: "happy"}} left={pos2[0]} frame={frame} pose="cheer" />
          <Person friend={{...friends.aima, expression: "happy"}} left={pos2[1]} frame={frame} pose="cheer" />

          {/* Two Equally Glowing Hearts above Nuh & Aima */}
          <Heart left={pos2[0] + 80} top={60} size={70} color="#F59E0B" frame={frame} />
          <Heart left={pos2[1] + 80} top={60} size={70} color="#F59E0B" frame={frame} />

          <div
            style={{
              position: "absolute",
              left: 320,
              bottom: 45,
              padding: "12px 30px",
              borderRadius: 999,
              background: "#FFFFFF",
              border: "3px solid #F59E0B",
              boxShadow: "0 10px 24px rgba(245, 158, 11, 0.2)",
              textAlign: "center",
              zIndex: 10,
            }}
          >
            <span style={{fontSize: 20, fontWeight: 900, color: "#1E293B"}}>
              ✨ Everyone matters equally! More money does not make a better person. ✨
            </span>
          </div>
        </>
      )}

      {/* 2.4 Kind Example: Fathima helps Ruhi pick up dropped pencils */}
      {scene.visual === "kind-example" && (
        <>
          <Person friend={{...friends.fathima, expression: "happy"}} left={pos2[0]} frame={frame} pose="kneel" />
          <Person friend={{...friends.ruhi, expression: "relieved"}} left={pos2[1]} frame={frame} pose="reach" />

          {/* Dropped Colored Pencils */}
          <div style={{position: "absolute", left: pos2[0] + 180, bottom: 40, zIndex: 6}}>
            {["#EF4444", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"].map((c, i) => (
              <div
                key={c}
                style={{
                  position: "absolute",
                  left: i * 22,
                  top: (i % 2) * 10,
                  width: 32,
                  height: 6,
                  borderRadius: 3,
                  background: c,
                  transform: `rotate(${(i - 2) * 18}deg)`,
                }}
              />
            ))}
          </div>

          <div
            style={{
              position: "absolute",
              left: 360,
              top: 35,
              padding: "10px 24px",
              borderRadius: 999,
              background: "#ECFDF5",
              border: "3px solid #10B981",
              color: "#065F46",
              fontWeight: 900,
              fontSize: 18,
              zIndex: 10,
            }}
          >
            💖 Kindness in Action: Helping a friend!
          </div>
        </>
      )}

      {/* 2.5 Respect: Fathima invites Aima to free game */}
      {scene.visual === "respect" && (
        <>
          <Person friend={{...friends.fathima, expression: "happy"}} left={pos4[0]} frame={frame} pose="offer" />
          <Person friend={{...friends.aima, expression: "happy"}} left={pos4[1]} frame={frame} pose="receive" />
          <Person friend={{...friends.ruhi, expression: "happy"}} left={pos4[2]} frame={frame} pose="wave" />
          <Person friend={{...friends.nuh, expression: "happy"}} left={pos4[3]} frame={frame} pose="cheer" />

          <SpeechBubble left={pos4[0] - 10} top={70} text="Come play this free game with us! You go first!" width={280} />

          <div
            style={{
              position: "absolute",
              left: 460,
              top: 25,
              padding: "10px 24px",
              borderRadius: 999,
              background: "#FFFFFF",
              border: "3px solid #10B981",
              boxShadow: "0 6px 18px rgba(16, 185, 129, 0.18)",
              fontWeight: 900,
              fontSize: 17,
              color: "#1E293B",
              zIndex: 10,
            }}
          >
            🤝 Equal Care & Respect for Everyone
          </div>
        </>
      )}

      {/* 2.6 Kind or Unkind: Clear Contrasting Vignettes */}
      {scene.visual === "kind-or-unkind" && (
        <>
          {/* Left: Unkind Vignette */}
          <div
            style={{
              position: "absolute",
              left: 140,
              top: 60,
              width: 480,
              height: 380,
              borderRadius: 24,
              background: "#FEF2F2",
              border: "4px solid #EF4444",
              boxShadow: "0 10px 24px rgba(239, 68, 68, 0.15)",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 8,
            }}
          >
            <div style={{padding: "6px 16px", borderRadius: 999, background: "#EF4444", color: "#FFF", fontWeight: 900, fontSize: 16}}>
              🚫 UNKIND BEHAVIOR
            </div>
            <div style={{fontSize: 70, margin: "24px 0"}}>😤 🛑</div>
            <div style={{fontSize: 22, fontWeight: 900, color: "#991B1B", textAlign: "center", lineHeight: 1.3}}>
              Teasing or leaving someone out is unkind.
            </div>
          </div>

          {/* Right: Kind Vignette */}
          <div
            style={{
              position: "absolute",
              right: 140,
              top: 60,
              width: 480,
              height: 380,
              borderRadius: 24,
              background: "#ECFDF5",
              border: "4px solid #10B981",
              boxShadow: "0 10px 24px rgba(16, 185, 129, 0.15)",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 8,
            }}
          >
            <div style={{padding: "6px 16px", borderRadius: 999, background: "#10B981", color: "#FFF", fontWeight: 900, fontSize: 16}}>
              ✅ KIND BEHAVIOR
            </div>
            <div style={{fontSize: 70, margin: "24px 0"}}>🤗 🌟</div>
            <div style={{fontSize: 22, fontWeight: 900, color: "#065F46", textAlign: "center", lineHeight: 1.3}}>
              Welcoming friends and sharing is kind!
            </div>
          </div>
        </>
      )}

      {/* 2.7 Recap: You don't have to be rich to be good */}
      {scene.visual === "recap-wealth" && (
        <>
          <FourCharacterStaging
            frame={frame}
            poses={{ruhi: "cheer", aima: "cheer", nuh: "cheer", fathima: "cheer"}}
          />
          <Heart left={620} top={30} size={80} color="#F59E0B" frame={frame} />
        </>
      )}

      {/* ========================================================================= */}
      {/* EPISODE 3: EQUALITY OF OPPORTUNITY                                        */}
      {/* ========================================================================= */}

      {/* 3.1 Welcome Garden Picnic */}
      {scene.visual === "garden" && (
        <>
          <div
            style={{
              position: "absolute",
              left: 420,
              top: 25,
              padding: "8px 24px",
              borderRadius: 999,
              background: "rgba(255, 255, 255, 0.95)",
              border: "3px solid #10B981",
              boxShadow: "0 6px 16px rgba(16, 185, 129, 0.2)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              zIndex: 10,
            }}
          >
            <span style={{fontSize: 22}}>🌻</span>
            <span style={{fontSize: 20, fontWeight: 900, color: "#1E293B", letterSpacing: 1}}>
              SUNNY GARDEN PICNIC
            </span>
            <span style={{fontSize: 22}}>🌻</span>
          </div>

          <FourCharacterStaging
            frame={frame}
            poses={{ruhi: "wave", aima: "wave", nuh: "stand", fathima: "wave"}}
          />
        </>
      )}

      {/* 3.2 Four Distinct Favorite Foods Visible Together */}
      {scene.visual === "four-favorites" && (
        <>
          <Person friend={{...friends.ruhi, expression: "happy"}} left={pos4[0]} frame={frame} pose="offer" />
          <Person friend={{...friends.aima, expression: "happy"}} left={pos4[1]} frame={frame} pose="offer" />
          <Person friend={{...friends.nuh, expression: "happy"}} left={pos4[2]} frame={frame} pose="offer" />
          <Person friend={{...friends.fathima, expression: "happy"}} left={pos4[3]} frame={frame} pose="offer" />

          {/* 4 distinct cards for 4 friends */}
          <FoodCard left={pos4[0] + 15} top={70} childName="Ruhi" foodName="Cucumbers" emoji="🥒" color="#10B981" badgeColor="#FF6E7F" frame={frame} delay={0} />
          <FoodCard left={pos4[1] + 15} top={70} childName="Aima" foodName="Mangoes" emoji="🥭" color="#F59E0B" badgeColor="#10B981" frame={frame} delay={8} />
          <FoodCard left={pos4[2] + 15} top={70} childName="Nuh" foodName="Apples" emoji="🍎" color="#EF4444" badgeColor="#3B82F6" frame={frame} delay={16} />
          <FoodCard left={pos4[3] + 15} top={70} childName="Fathima" foodName="Bananas" emoji="🍌" color="#FBBF24" badgeColor="#8B5CF6" frame={frame} delay={24} />
        </>
      )}

      {/* 3.3 Choices Accepted: Friends can like different things */}
      {scene.visual === "choices-accepted" && (
        <>
          <Person friend={{...friends.ruhi, expression: "happy"}} left={pos2[0]} frame={frame} pose="wave" />
          <Person friend={{...friends.aima, expression: "happy"}} left={pos2[1]} frame={frame} pose="wave" />

          {/* Cucumber & Mango Cards */}
          <FoodCard left={pos2[0] - 120} top={120} childName="Ruhi" foodName="Cucumbers" emoji="🥒" color="#10B981" badgeColor="#FF6E7F" frame={frame} delay={0} />
          <FoodCard left={pos2[1] + 180} top={120} childName="Aima" foodName="Mangoes" emoji="🥭" color="#F59E0B" badgeColor="#10B981" frame={frame} delay={0} />

          <div
            style={{
              position: "absolute",
              left: 360,
              bottom: 45,
              padding: "12px 28px",
              borderRadius: 999,
              background: "#FFFFFF",
              border: "3px solid #10B981",
              boxShadow: "0 10px 24px rgba(16, 185, 129, 0.15)",
              textAlign: "center",
              zIndex: 10,
            }}
          >
            <span style={{fontSize: 20, fontWeight: 900, color: "#1E293B"}}>
              ✨ Different favorites are okay! We are still great friends! ✨
            </span>
          </div>
        </>
      )}

      {/* 3.4 Games: Multiple game options */}
      {scene.visual === "game-options" && (
        <>
          <Person friend={{...friends.nuh, expression: "happy"}} left={pos4[0]} frame={frame} pose="cheer" />
          <Person friend={{...friends.fathima, expression: "happy"}} left={pos4[1]} frame={frame} pose="wave" />
          <Person friend={{...friends.aima, expression: "happy"}} left={pos4[2]} frame={frame} pose="stand" />
          <Person friend={{...friends.ruhi, expression: "happy"}} left={pos4[3]} frame={frame} pose="wave" />

          {/* Three Game Choice Badges */}
          <div
            style={{
              position: "absolute",
              left: 280,
              top: 35,
              display: "flex",
              gap: 20,
              zIndex: 12,
            }}
          >
            {[
              {icon: "⚽", label: "Ball Games"},
              {icon: "⭕", label: "Hoop Games"},
              {icon: "🎨", label: "Drawing & Art"},
            ].map((g) => (
              <div
                key={g.label}
                style={{
                  padding: "10px 20px",
                  borderRadius: 999,
                  background: "#FFFFFF",
                  border: "3px solid #3B82F6",
                  boxShadow: "0 6px 14px rgba(59, 130, 246, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 900,
                  fontSize: 17,
                  color: "#1E293B",
                }}
              >
                <span>{g.icon}</span>
                <span>{g.label}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 3.5 Chance to Join: Fathima notices waiting friend and passes ball */}
      {scene.visual === "chance-to-join" && (
        <>
          <Person friend={{...friends.ruhi, expression: "happy"}} left={pos4[0]} frame={frame} pose="stand" />
          <Person friend={{...friends.nuh, expression: "happy"}} left={pos4[1]} frame={frame} pose="cheer" />
          <Person friend={{...friends.fathima, expression: "happy"}} left={pos4[2]} frame={frame} pose="offer" />
          <Person friend={{...friends.aima, expression: frame > 30 ? "happy" : "thinking"}} left={pos4[3]} frame={frame} pose={frame > 30 ? "receive" : "stand"} />

          {/* Animated ball rolling towards Aima */}
          {(() => {
            const ballProgress = interpolate(frame, [15, 45], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
            const startX = pos4[2] + 160;
            const endX = pos4[3] + 40;
            const curX = startX + (endX - startX) * ballProgress;
            const curY = 440 - Math.sin(ballProgress * Math.PI) * 50;

            return (
              <div
                style={{
                  position: "absolute",
                  left: curX,
                  top: curY,
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 35%, #FFFFFF 0%, #3B82F6 60%, #1D4ED8 100%)",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
                  zIndex: 10,
                }}
              />
            );
          })()}

          <SpeechBubble left={pos4[2] - 40} top={70} text="Aima, here is your turn! Join us!" width={250} />
        </>
      )}

      {/* 3.6 Participation: Group cooperative play */}
      {scene.visual === "participation" && (
        <>
          <FourCharacterStaging
            frame={frame}
            poses={{ruhi: "cheer", aima: "cheer", nuh: "cheer", fathima: "cheer"}}
          />
          <div
            style={{
              position: "absolute",
              left: 420,
              bottom: 35,
              padding: "10px 24px",
              borderRadius: 999,
              background: "#FFFFFF",
              border: "3px solid #10B981",
              fontWeight: 900,
              fontSize: 18,
              color: "#1E293B",
              zIndex: 10,
            }}
          >
            ⭐ Everyone gets a fair chance to take part! ⭐
          </div>
        </>
      )}

      {/* 3.7 Recap: Equal opportunity */}
      {scene.visual === "recap-opportunity" && (
        <>
          <FourCharacterStaging
            frame={frame}
            poses={{ruhi: "wave", aima: "cheer", nuh: "wave", fathima: "cheer"}}
          />
          <Heart left={620} top={35} size={70} color="#10B981" frame={frame} />
        </>
      )}

      {/* ========================================================================= */}
      {/* EPISODE 4: CHALLENGING INJUSTICE                                          */}
      {/* ========================================================================= */}

      {/* 4.1 Welcome Art Time */}
      {scene.visual === "art-time" && (
        <>
          <FourCharacterStaging
            frame={frame}
            poses={{ruhi: "stand", aima: "stand", nuh: "reach", fathima: "stand"}}
          />
          {/* Wooden Block Tower on Art Table */}
          <div style={{position: "absolute", left: 600, bottom: 90, zIndex: 6}}>
            <Block x={0} y={-45} color="#8B5CF6" letter="1" />
            <Block x={0} y={-95} color="#F59E0B" letter="2" />
            <Block x={0} y={-145} color="#10B981" letter="3" />
            <Block x={0} y={-195} color="#3B82F6" letter="4" />
          </div>
        </>
      )}

      {/* 4.2 Accident: Bump triggers tumbling blocks */}
      {scene.visual === "accident" && (
        <>
          <Person friend={{...friends.nuh, expression: frame > 25 ? "sad" : "happy"}} left={pos2[0]} frame={frame} pose={frame > 25 ? "stand" : "cheer"} />
          <Person friend={{...friends.fathima, expression: frame > 25 ? "worried" : "thinking"}} left={pos2[1]} frame={frame} pose={frame > 25 ? "stand" : "reach"} />

          {/* Falling blocks sequence */}
          {(() => {
            const fallProgress = interpolate(frame, [20, 50], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
            const tumbleY = fallProgress * 140;
            const bounceY = Math.sin(fallProgress * Math.PI) * 20;

            return (
              <div style={{position: "absolute", left: 580, bottom: 90, zIndex: 6}}>
                {/* Base Block stays */}
                <Block x={0} y={-45} color="#8B5CF6" letter="1" />
                {/* Upper blocks tumble down */}
                <Block x={fallProgress * -60} y={-95 + tumbleY - bounceY} color="#F59E0B" letter="2" rotation={fallProgress * -45} />
                <Block x={fallProgress * 70} y={-145 + tumbleY - bounceY} color="#10B981" letter="3" rotation={fallProgress * 60} />
                <Block x={fallProgress * 120} y={-195 + tumbleY} color="#3B82F6" letter="4" rotation={fallProgress * 85} />
              </div>
            );
          })()}

          {frame > 25 && (
            <div
              style={{
                position: "absolute",
                left: 480,
                top: 40,
                padding: "8px 24px",
                borderRadius: 999,
                background: "#FEF2F2",
                border: "3px solid #EF4444",
                color: "#991B1B",
                fontWeight: 900,
                fontSize: 18,
                zIndex: 10,
              }}
            >
              ⚠️ An accidental bump!
            </div>
          )}
        </>
      )}

      {/* 4.3 Feelings: Worried and Sad */}
      {scene.visual === "feelings" && (
        <>
          <Person friend={{...friends.fathima, expression: "worried"}} left={pos2[0]} frame={frame} pose="stand" />
          <Person friend={{...friends.nuh, expression: "sad"}} left={pos2[1]} frame={frame} pose="stand" />

          <div
            style={{
              position: "absolute",
              left: 360,
              top: 50,
              padding: "12px 28px",
              borderRadius: 999,
              background: "#FFFFFF",
              border: "3px solid #64748B",
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              textAlign: "center",
              zIndex: 10,
            }}
          >
            <span style={{fontSize: 20, fontWeight: 900, color: "#1E293B"}}>
              Mistakes can hurt people&apos;s feelings. It is okay to feel sad or worried.
            </span>
          </div>
        </>
      )}

      {/* 4.4 Admit: Telling the truth honestly */}
      {scene.visual === "admit" && (
        <>
          <Person friend={{...friends.fathima, expression: "apologetic"}} left={pos2[0]} frame={frame} pose="stand" />
          <Person friend={{...friends.nuh, expression: "listening"}} left={pos2[1]} frame={frame} pose="listen" />

          <SpeechBubble left={pos2[0] - 20} top={80} text="I bumped your blocks by mistake." width={270} />

          <div
            style={{
              position: "absolute",
              left: 450,
              bottom: 35,
              padding: "8px 24px",
              borderRadius: 999,
              background: "#EFF6FF",
              border: "3px solid #3B82F6",
              color: "#1E40AF",
              fontWeight: 900,
              fontSize: 17,
              zIndex: 10,
            }}
          >
            🗣️ Step 1: Tell the Truth Honestly
          </div>
        </>
      )}

      {/* 4.5 Say Sorry: Sincere apology */}
      {scene.visual === "say-sorry" && (
        <>
          <Person friend={{...friends.fathima, expression: "apologetic"}} left={pos2[0]} frame={frame} pose="apologize" />
          <Person friend={{...friends.nuh, expression: "relieved"}} left={pos2[1]} frame={frame} pose="stand" />

          <SpeechBubble left={pos2[0] - 20} top={80} text="I am really sorry, Nuh." width={260} />

          <div
            style={{
              position: "absolute",
              left: 470,
              bottom: 35,
              padding: "8px 24px",
              borderRadius: 999,
              background: "#FEF2F2",
              border: "3px solid #F43F5E",
              color: "#9F1239",
              fontWeight: 900,
              fontSize: 17,
              zIndex: 10,
            }}
          >
            💬 Step 2: Sincere Apology
          </div>
        </>
      )}

      {/* 4.6 Help Repair: Rebuilding the tower together */}
      {scene.visual === "help-repair" && (
        <>
          <Person friend={{...friends.fathima, expression: "happy"}} left={pos4[0]} frame={frame} pose="kneel" />
          <Person friend={{...friends.nuh, expression: "happy"}} left={pos4[1]} frame={frame} pose="reach" />
          <Person friend={{...friends.ruhi, expression: "happy"}} left={pos4[2]} frame={frame} pose="reach" />
          <Person friend={{...friends.aima, expression: "happy"}} left={pos4[3]} frame={frame} pose="cheer" />

          {/* Rebuilding blocks traveling back into tower */}
          {(() => {
            const rebuildP = interpolate(frame, [10, 50], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

            return (
              <div style={{position: "absolute", left: 620, bottom: 90, zIndex: 6}}>
                <Block x={0} y={-45} color="#8B5CF6" letter="1" />
                <Block x={0} y={-95} color="#F59E0B" letter="2" />
                <Block x={rebuildP >= 0.5 ? 0 : 70} y={rebuildP >= 0.5 ? -145 : -40} color="#10B981" letter="3" />
                <Block x={rebuildP >= 0.8 ? 0 : 130} y={rebuildP >= 0.8 ? -195 : -40} color="#3B82F6" letter="4" />
              </div>
            );
          })()}

          <div
            style={{
              position: "absolute",
              left: 440,
              top: 30,
              padding: "10px 24px",
              borderRadius: 999,
              background: "#ECFDF5",
              border: "3px solid #10B981",
              color: "#065F46",
              fontWeight: 900,
              fontSize: 18,
              zIndex: 10,
            }}
          >
            🛠️ Step 3: Help Repair and Rebuild!
          </div>
        </>
      )}

      {/* 4.7 Tell the Truth: Asking a teacher for help */}
      {scene.visual === "tell-the-truth" && (
        <>
          <Person friend={{...friends.aima, expression: "listening"}} left={pos2[0]} frame={frame} pose="stand" />
          {/* Friendly teacher representation */}
          <div
            style={{
              position: "absolute",
              left: pos2[1],
              bottom: 12,
              width: 240,
              textAlign: "center",
              zIndex: 5,
            }}
          >
            <div style={{fontSize: 90}}>👩‍🏫</div>
            <div
              style={{
                display: "inline-block",
                padding: "4px 14px",
                borderRadius: 999,
                background: "#FFFFFF",
                border: "2px solid #3B82F6",
                fontWeight: 900,
                fontSize: 16,
                color: "#1E293B",
              }}
            >
              Teacher
            </div>
          </div>

          <SpeechBubble left={pos2[0] - 20} top={80} text="Teacher, can you help us make things right?" width={280} />
        </>
      )}

      {/* 4.8 Respect Things: Ask politely vs grabbing */}
      {scene.visual === "respect-things" && (
        <>
          <Person friend={{...friends.ruhi, expression: "happy"}} left={pos2[0]} frame={frame} pose="reach" />
          <Person friend={{...friends.nuh, expression: "happy"}} left={pos2[1]} frame={frame} pose="offer" />

          {/* Storybook being handed over politely */}
          <div
            style={{
              position: "absolute",
              left: 580,
              bottom: 110,
              width: 75,
              height: 55,
              borderRadius: 8,
              background: "#3B82F6",
              border: "3px solid #FFFFFF",
              boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
              display: "grid",
              placeItems: "center",
              color: "#FFFFFF",
              fontSize: 26,
              zIndex: 10,
            }}
          >
            📖
          </div>

          <div
            style={{
              position: "absolute",
              left: 360,
              top: 35,
              padding: "10px 24px",
              borderRadius: 999,
              background: "#FFFFFF",
              border: "3px solid #10B981",
              fontWeight: 900,
              fontSize: 18,
              color: "#1E293B",
              zIndex: 10,
            }}
          >
            ✨ We ask politely and wait our turn. We never grab! ✨
          </div>
        </>
      )}

      {/* 4.9 Recap: 4 Steps of Making Things Right */}
      {scene.visual === "recap-injustice" && (
        <>
          <FourCharacterStaging
            frame={frame}
            poses={{ruhi: "cheer", aima: "cheer", nuh: "cheer", fathima: "cheer"}}
          />

          {/* 4 Steps Banner */}
          <div
            style={{
              position: "absolute",
              left: 140,
              top: 25,
              display: "flex",
              gap: 16,
              zIndex: 12,
            }}
          >
            {[
              {num: "1", label: "🛑 Notice", color: "#EF4444"},
              {num: "2", label: "🗣️ Admit Truth", color: "#3B82F6"},
              {num: "3", label: "💬 Say Sorry", color: "#F59E0B"},
              {num: "4", label: "🛠️ Help Repair", color: "#10B981"},
            ].map((step) => (
              <div
                key={step.num}
                style={{
                  padding: "8px 18px",
                  borderRadius: 999,
                  background: "#FFFFFF",
                  border: `3px solid ${step.color}`,
                  color: "#1E293B",
                  fontWeight: 900,
                  fontSize: 16,
                  boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
                }}
              >
                {step.label}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* REFLECTION PROMPT (UNANSWERED QUIZ MOMENT)                                */}
      {/* ========================================================================= */}
      {scene.visual === "quiz" && (
        <>
          {/* Situation Vignette depending on Episode */}
          {scene.narration.includes("waiting to play") && (
            // Ep 1: Playground waiting scenario
            <>
              <PlaygroundSlide frame={frame} />
              <Person friend={{...friends.fathima, expression: "thinking"}} left={pos3[0]} frame={frame} pose="thinking" />
              <Person friend={{...friends.nuh, expression: "happy"}} left={pos3[1]} frame={frame} pose="stand" />
              <Person friend={{...friends.aima, expression: "thinking"}} left={pos3[2]} frame={frame} pose="stand" />
            </>
          )}

          {scene.narration.includes("sitting alone") && (
            // Ep 2: Market bench child alone
            <>
              <Person friend={{...friends.fathima, expression: "thinking"}} left={pos2[0]} frame={frame} pose="thinking" />
              <Person friend={{...friends.aima, expression: "sad"}} left={pos2[1]} frame={frame} pose="stand" />
            </>
          )}

          {scene.narration.includes("Fathima gets a chance to join") && (
            // Ep 3: Garden drawing table
            <>
              <Person friend={{...friends.fathima, expression: "thinking"}} left={pos2[0]} frame={frame} pose="reach" />
              <Person friend={{...friends.nuh, expression: "thinking"}} left={pos2[1]} frame={frame} pose="thinking" />
            </>
          )}

          {scene.narration.includes("pencils") && (
            // Ep 4: Classroom knocked pencils
            <>
              <Person friend={{...friends.aima, expression: "worried"}} left={pos2[0]} frame={frame} pose="stand" />
              <Person friend={{...friends.ruhi, expression: "thinking"}} left={pos2[1]} frame={frame} pose="thinking" />
              {/* Dropped pencils on floor */}
              <div style={{position: "absolute", left: 560, bottom: 40, zIndex: 6}}>
                {["#EF4444", "#3B82F6", "#10B981", "#F59E0B"].map((c, i) => (
                  <div
                    key={c}
                    style={{
                      position: "absolute",
                      left: i * 20,
                      top: (i % 2) * 8,
                      width: 28,
                      height: 5,
                      borderRadius: 2.5,
                      background: c,
                      transform: `rotate(${(i - 1.5) * 22}deg)`,
                    }}
                  />
                ))}
              </div>
            </>
          )}

          {/* Central Question Prompt Card (Unanswered) */}
          <div
            style={{
              position: "absolute",
              left: 200,
              right: 200,
              top: 50,
              padding: "18px 32px",
              borderRadius: 24,
              background: "rgba(255, 255, 255, 0.98)",
              border: "3px solid #F59E0B",
              boxShadow: "0 12px 32px rgba(245, 158, 11, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              zIndex: 20,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "#FEF3C7",
                color: "#D97706",
                display: "grid",
                placeItems: "center",
                fontSize: 26,
                fontWeight: 900,
                flexShrink: 0,
              }}
            >
              ?
            </div>
            <div style={{fontSize: 22, fontWeight: 900, color: "#1E293B", lineHeight: 1.3, textAlign: "left"}}>
              {scene.narration}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
