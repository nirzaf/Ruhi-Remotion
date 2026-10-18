import React from "react";
import {interpolate, spring} from "remotion";
import {Character, friends, type Friend} from "./Character";
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
  // Animated drifting clouds
  const cloud1X = ((frame * 0.75) % 1520) - 160;
  const cloud2X = (((frame * 0.45) + 520) % 1520) - 160;
  const cloud3X = (((frame * 0.25) + 1040) % 1520) - 160;

  // Sun gentle rotation and breathing
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
          {/* Wood grain subtle lines */}
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
        {/* Soft Sun Glow */}
        <div
          style={{
            position: "absolute",
            inset: -24,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(254, 240, 138, 0.45) 0%, rgba(254, 240, 138, 0) 70%)",
          }}
        />
        {/* Rotating Sunrays */}
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
        {/* Sun Core */}
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
      <svg
        style={{position: "absolute", left: cloud1X, top: 40, opacity: 0.88}}
        width="140"
        height="60"
        viewBox="0 0 140 60"
      >
        <path
          d="M20 45 Q5 45 5 32 Q5 20 22 20 Q30 5 50 6 Q68 6 75 18 Q85 10 100 12 Q115 14 118 28 Q135 28 135 42 Q135 55 120 55 H20 Z"
          fill="#FFFFFF"
        />
      </svg>
      <svg
        style={{position: "absolute", left: cloud2X, top: 75, opacity: 0.72}}
        width="110"
        height="50"
        viewBox="0 0 140 60"
      >
        <path
          d="M20 45 Q5 45 5 32 Q5 20 22 20 Q30 5 50 6 Q68 6 75 18 Q85 10 100 12 Q115 14 118 28 Q135 28 135 42 Q135 55 120 55 H20 Z"
          fill="#FFFFFF"
        />
      </svg>
      <svg
        style={{position: "absolute", left: cloud3X, top: 25, opacity: 0.65}}
        width="160"
        height="70"
        viewBox="0 0 140 60"
      >
        <path
          d="M20 45 Q5 45 5 32 Q5 20 22 20 Q30 5 50 6 Q68 6 75 18 Q85 10 100 12 Q115 14 118 28 Q135 28 135 42 Q135 55 120 55 H20 Z"
          fill="#FFFFFF"
        />
      </svg>

      {/* Background Soft Rolling Hill */}
      <div
        style={{
          position: "absolute",
          left: -40,
          right: -40,
          bottom: 40,
          height: 140,
          borderRadius: "50% 50% 0 0",
          background: "linear-gradient(180deg, #A7E3B6 0%, #8FD3A2 100%)",
          opacity: 0.6,
        }}
      />

      {/* Foreground Meadow Hill with highlight curve */}
      <div
        style={{
          position: "absolute",
          left: 10,
          right: 10,
          bottom: 0,
          height: 115,
          borderRadius: "45% 45% 24px 24px",
          background: "linear-gradient(180deg, #86EFAC 0%, #4ADE80 50%, #22C55E 100%)",
          boxShadow: "inset 0 4px 12px rgba(255,255,255,0.6)",
          border: "4px solid rgba(255,255,255,0.7)",
        }}
      >
        {/* Swaying Wildflowers on the grass */}
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
                {/* Stem */}
                <path d="M12 28 Q11 16 12 10" stroke="#166534" strokeWidth="2.5" fill="none" />
                {/* Leaves */}
                <path d="M12 18 Q6 16 7 20" stroke="#15803D" strokeWidth="2" fill="none" />
                {/* Petals */}
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
          {/* Trunk */}
          <path d="M52 180 L52 110 Q52 95 62 85 L62 180 Z" fill="#854D0E" />
          {/* Canopy Layers */}
          <circle cx="60" cy="80" r="48" fill="#15803D" />
          <circle cx="45" cy="65" r="34" fill="#22C55E" />
          <circle cx="75" cy="65" r="32" fill="#4ADE80" />
          <circle cx="60" cy="50" r="30" fill="#86EFAC" />
          {/* Little red apples */}
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
  pose?: "stand" | "wave" | "reach" | "thinking" | "cheer";
}> = ({friend, left, frame, width = 230, pose}) => {
  const entrance = spring({
    frame: Math.max(0, frame - Math.max(0, left - 150) / 24),
    fps: 30,
    config: {damping: 14, stiffness: 100},
  });
  const bob = Math.sin((frame + left) / 16) * 4;

  return (
    <div
      style={{
        position: "absolute",
        left,
        bottom: 12,
        transform: `translateY(${(1 - entrance) * 50 + bob}px) scale(${0.92 + entrance * 0.08})`,
        transformOrigin: "bottom center",
        zIndex: 5,
      }}
    >
      <Character friend={friend} width={width} pose={pose} frame={frame} />
    </div>
  );
};

// --- Rich Interactive Props & Illustrations ---

// 1. Playground Slide
const PlaygroundSlide: React.FC<{frame: number}> = ({frame}) => {
  const flagWave = Math.sin(frame / 5) * 6;
  return (
    <svg
      style={{position: "absolute", right: 28, top: 32, filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.12))"}}
      width="390"
      height="370"
      viewBox="0 0 390 370"
    >
      {/* Wooden support posts */}
      <rect x="78" y="90" width="14" height="230" rx="4" fill="#B45309" />
      <rect x="156" y="90" width="14" height="230" rx="4" fill="#92400E" />

      {/* Ladder steps */}
      {[130, 168, 206, 244, 282].map((y) => (
        <rect key={y} x="82" y={y} width="84" height="8" rx="4" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
      ))}

      {/* Top platform with safe railings */}
      <rect x="70" y="80" width="105" height="16" rx="5" fill="#EF4444" />
      <path d="M72 80 V50 Q120 40 172 50 V80" fill="none" stroke="#F87171" strokeWidth="6" strokeLinecap="round" />

      {/* Cute Flag at the top */}
      <line x1="72" y1="50" x2="72" y2="18" stroke="#475569" strokeWidth="4" />
      <path
        d={`M72 20 L108 ${28 + flagWave} L72 38 Z`}
        fill="#3B82F6"
        stroke="#1D4ED8"
        strokeWidth="1.5"
      />

      {/* Curved slide chute */}
      {/* Outer red rail */}
      <path
        d="M170 92 Q230 140 290 230 Q330 290 380 300"
        fill="none"
        stroke="#DC2626"
        strokeWidth="32"
        strokeLinecap="round"
      />
      {/* Inner yellow slide surface */}
      <path
        d="M170 92 Q230 140 290 230 Q330 290 380 300"
        fill="none"
        stroke="#FDE047"
        strokeWidth="20"
        strokeLinecap="round"
      />
      {/* End curve ground stopper */}
      <path d="M360 305 L385 305" stroke="#475569" strokeWidth="10" strokeLinecap="round" />
    </svg>
  );
};

// 2. Shiny Candy Sweets
const Candy: React.FC<{left: number; top: number; color: string; rotation?: number; scale?: number}> = ({
  left,
  top,
  color,
  rotation = 0,
  scale = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width: 54,
      height: 34,
      borderRadius: 18,
      background: `linear-gradient(135deg, ${color} 0%, #FFFFFF 140%)`,
      border: "3.5px solid #FFFFFF",
      boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
      transform: `rotate(${rotation}deg) scale(${scale})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {/* Left twist wrapper */}
    <div
      style={{
        position: "absolute",
        width: 12,
        height: 22,
        left: -11,
        borderRadius: 5,
        background: color,
        border: "2px solid #FFFFFF",
        transform: "rotate(-32deg)",
      }}
    />
    {/* Right twist wrapper */}
    <div
      style={{
        position: "absolute",
        width: 12,
        height: 22,
        right: -11,
        borderRadius: 5,
        background: color,
        border: "2px solid #FFFFFF",
        transform: "rotate(32deg)",
      }}
    />
    {/* Center white shimmer line */}
    <div style={{width: 6, height: 18, borderRadius: 3, background: "rgba(255,255,255,0.85)"}} />
  </div>
);

// 3. Golden Star Coins with Sparkle
const StarCoin: React.FC<{left: number; top: number; size?: number; frame?: number; delay?: number}> = ({
  left,
  top,
  size = 62,
  frame = 0,
  delay = 0,
}) => {
  const drift = interpolate(frame - delay, [0, 36], [40, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const shimmer = Math.sin((frame - delay) / 8) * 0.15;

  return (
    <svg
      style={{
        position: "absolute",
        left,
        top: top + drift,
        filter: "drop-shadow(0 8px 14px rgba(180, 83, 9, 0.35))",
        transform: `scale(${1 + shimmer})`,
      }}
      width={size}
      height={size}
      viewBox="0 0 60 60"
    >
      <circle cx="30" cy="30" r="27" fill="#F59E0B" stroke="#B45309" strokeWidth="3" />
      <circle cx="30" cy="30" r="23" fill="#FBBF24" />
      <circle cx="30" cy="30" r="18" fill="none" stroke="#FDE68A" strokeWidth="2.5" />
      {/* Embossed Star */}
      <path
        d="M30 16 L34 24 L42 25 L36 31 L38 39 L30 35 L22 39 L24 31 L18 25 L26 24 Z"
        fill="#D97706"
      />
      {/* Catchlight glint */}
      <circle cx="21" cy="21" r="3.5" fill="#FFFFFF" opacity="0.8" />
    </svg>
  );
};

// 4. Floating Beating Heart
const Heart: React.FC<{left: number; top: number; size?: number; color?: string; frame?: number}> = ({
  left,
  top,
  size = 90,
  color = "#FB7185",
  frame = 0,
}) => {
  const pulse = 1 + Math.sin(frame / 8) * 0.08;
  const floatY = Math.sin(frame / 12) * 5;

  return (
    <svg
      style={{
        position: "absolute",
        left,
        top: top + floatY,
        transform: `scale(${pulse})`,
        filter: "drop-shadow(0 10px 16px rgba(225, 29, 72, 0.22))",
        zIndex: 10,
      }}
      width={size}
      height={size * 0.9}
      viewBox="0 0 100 90"
    >
      <path
        d="M50 82 L14 46 C-10 22 20 -8 46 14 L50 18 L54 14 C80 -8 110 22 86 46 Z"
        fill={color}
        stroke="#FFFFFF"
        strokeWidth="3.5"
      />
    </svg>
  );
};

// 5. Speech Bubble
const SpeechBubble: React.FC<{
  left: number;
  top: number;
  text: string;
  speaker?: string;
  badgeColor?: string;
}> = ({left, top, text, speaker, badgeColor = "#FF6E7F"}) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      maxWidth: 340,
      padding: "16px 24px",
      borderRadius: 24,
      background: "#FFFFFF",
      border: `3px solid ${badgeColor}`,
      boxShadow: "0 12px 28px rgba(30, 41, 59, 0.12)",
      zIndex: 12,
      display: "flex",
      flexDirection: "column",
      gap: 4,
    }}
  >
    {speaker && (
      <span style={{fontSize: 14, fontWeight: 900, color: badgeColor, textTransform: "uppercase", letterSpacing: 1}}>
        {speaker} says:
      </span>
    )}
    <span style={{fontSize: 24, fontWeight: 800, color: "#1E293B", lineHeight: 1.25}}>
      "{text}"
    </span>
    {/* Tail pointer */}
    <div
      style={{
        position: "absolute",
        bottom: -12,
        left: 42,
        width: 20,
        height: 20,
        transform: "rotate(45deg)",
        background: "#FFFFFF",
        borderRight: `3px solid ${badgeColor}`,
        borderBottom: `3px solid ${badgeColor}`,
      }}
    />
  </div>
);

// 6. Educational Alphabet / Wooden Blocks
const Block: React.FC<{
  left: number;
  top: number;
  color: string;
  letter: string;
  frame?: number;
  delay?: number;
  homeTop?: number;
  fallen?: boolean;
}> = ({left, top, color, letter, frame = 0, delay = 0, homeTop, fallen = false}) => {
  const progress = interpolate(frame - delay, [0, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const currentY = homeTop !== undefined ? top + (homeTop - top) * progress : top;
  const rot = fallen ? interpolate(progress, [0, 1], [0, 48]) : 0;

  return (
    <div
      style={{
        position: "absolute",
        left,
        top: currentY,
        width: 82,
        height: 82,
        background: color,
        borderRadius: 14,
        border: "4px solid rgba(255,255,255,0.92)",
        boxShadow: "0 10px 20px rgba(0,0,0,0.14)",
        display: "grid",
        placeItems: "center",
        transform: `rotate(${rot}deg)`,
        zIndex: 6,
      }}
    >
      <span style={{fontSize: 34, fontWeight: 900, color: "#FFFFFF", textShadow: "0 2px 4px rgba(0,0,0,0.25)"}}>
        {letter}
      </span>
    </div>
  );
};

// --- Main Illustration Dispatcher ---

export const Illustration: React.FC<ArtProps> = ({scene, frame, durationInFrames}) => {
  const appear = spring({frame, fps: 30, config: {damping: 15, stiffness: 85}});
  const questionScale = spring({
    frame: Math.max(0, frame - 12),
    fps: 30,
    config: {damping: 12, stiffness: 100},
  });

  // Three character centered layouts
  const pos3 = [110, 535, 960];
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
          scene.visual.startsWith("art") || scene.visual === "oops" || scene.visual === "truth" || scene.visual === "listen" || scene.visual === "repair"
            ? "art"
            : scene.visual === "garden" || scene.visual === "choices"
            ? "garden"
            : scene.visual === "market" || scene.visual === "different-coins" || scene.visual === "share-game"
            ? "market"
            : "outdoor"
        }
      />

      {/* ========================================================================= */}
      {/* EPISODE 1: JUSTICE & FAIRNESS AT PLAYGROUND                              */}
      {/* ========================================================================= */}

      {/* 1.1 Welcome Playground */}
      {scene.visual === "playground" && (
        <>
          <PlaygroundSlide frame={frame} />
          <Person friend={friends.ruhi} left={pos3[0]} frame={frame} pose="wave" />
          <Person friend={friends.aima} left={pos3[1]} frame={frame} pose="wave" />
          <Person friend={friends.nuh} left={pos3[2]} frame={frame} pose="wave" />
          <Heart left={590} top={50} size={88} frame={frame} />
        </>
      )}

      {/* 1.2 Unfair Share */}
      {scene.visual === "unfair-share" && (
        <>
          {/* Picnic ground blanket */}
          <div
            style={{
              position: "absolute",
              left: 60,
              right: 60,
              bottom: 16,
              height: 48,
              borderRadius: 24,
              background: "repeating-linear-gradient(90deg, #FDE68A 0 25px, #FEF3C7 25px 50px)",
              border: "3px dashed #F59E0B",
              opacity: 0.8,
              zIndex: 2,
            }}
          />

          {/* Characters */}
          <Person friend={friends.nuh} left={pos3[0]} frame={frame} />
          <Person friend={{...friends.ruhi, expression: "surprised"}} left={pos3[1]} frame={frame} />
          <Person friend={{...friends.aima, expression: "sad"}} left={pos3[2]} frame={frame} />

          {/* Nuh's full tray with all 6 candies */}
          <div
            style={{
              position: "absolute",
              left: 320,
              bottom: 75,
              width: 175,
              padding: "10px 14px",
              borderRadius: 24,
              background: "#FFFFFF",
              border: "4px solid #F59E0B",
              boxShadow: "0 10px 24px rgba(245, 158, 11, 0.22)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 8,
            }}
          >
            <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6, width: 140, height: 65, position: "relative"}}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Candy
                  key={i}
                  left={(i % 3) * 44 + 4}
                  top={Math.floor(i / 3) * 32}
                  color={["#EF4444", "#F59E0B", "#3B82F6", "#10B981"][i % 4]}
                  rotation={(i - 2.5) * 10}
                  scale={0.85}
                />
              ))}
            </div>
            <span style={{fontSize: 14, fontWeight: 900, color: "#D97706", marginTop: 4}}>
              All 6 Treats!
            </span>
          </div>

          {/* Ruhi's Empty Plate */}
          <div
            style={{
              position: "absolute",
              left: 745,
              bottom: 75,
              width: 140,
              padding: "14px",
              borderRadius: 20,
              background: "#FFFFFF",
              border: "3px solid #CBD5E1",
              boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
              textAlign: "center",
              zIndex: 8,
            }}
          >
            <div style={{fontSize: 28}}>🍽️</div>
            <div style={{fontSize: 14, fontWeight: 800, color: "#94A3B8"}}>0 Treats</div>
          </div>

          {/* Aima's Empty Plate */}
          <div
            style={{
              position: "absolute",
              left: 1170,
              bottom: 75,
              width: 140,
              padding: "14px",
              borderRadius: 20,
              background: "#FFFFFF",
              border: "3px solid #CBD5E1",
              boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
              textAlign: "center",
              zIndex: 8,
            }}
          >
            <div style={{fontSize: 28}}>🍽️</div>
            <div style={{fontSize: 14, fontWeight: 800, color: "#94A3B8"}}>0 Treats</div>
          </div>

          {/* Question Callout Banner */}
          <div
            style={{
              position: "absolute",
              left: 480,
              top: 45,
              padding: "12px 28px",
              borderRadius: 20,
              background: "#FFFFFF",
              border: "3px solid #EF4444",
              boxShadow: "0 10px 24px rgba(239, 68, 68, 0.15)",
              color: "#DC2626",
              fontSize: 26,
              fontWeight: 900,
              zIndex: 10,
            }}
          >
            ⚠️ Is taking all six treats fair?
          </div>
        </>
      )}

      {/* 1.3 Fair Share */}
      {scene.visual === "fair-share" && (
        <>
          {/* Picnic ground blanket */}
          <div
            style={{
              position: "absolute",
              left: 60,
              right: 60,
              bottom: 16,
              height: 48,
              borderRadius: 24,
              background: "repeating-linear-gradient(90deg, #A7F3D0 0 25px, #D1FAE5 25px 50px)",
              border: "3px dashed #10B981",
              opacity: 0.8,
              zIndex: 2,
            }}
          />

          <Person friend={friends.ruhi} left={pos3[0]} frame={frame} pose="cheer" />
          <Person friend={friends.aima} left={pos3[1]} frame={frame} pose="cheer" />
          <Person friend={friends.nuh} left={pos3[2]} frame={frame} pose="cheer" />

          {/* Three equal plates with 2 candies each */}
          {[
            {label: "Ruhi's Share", x: 320},
            {label: "Aima's Share", x: 745},
            {label: "Nuh's Share", x: 1170},
          ].map((plate, pIdx) => (
            <div
              key={pIdx}
              style={{
                position: "absolute",
                left: plate.x,
                bottom: 75,
                width: 145,
                padding: "8px 10px",
                borderRadius: 20,
                background: "#FFFFFF",
                border: "3.5px solid #10B981",
                boxShadow: "0 8px 18px rgba(16, 185, 129, 0.18)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 8,
              }}
            >
              <div style={{display: "flex", gap: 10, height: 42, alignItems: "center"}}>
                <Candy left={0} top={0} color="#EF4444" rotation={-10} scale={0.8} />
                <Candy left={0} top={0} color="#3B82F6" rotation={10} scale={0.8} />
              </div>
              <span style={{fontSize: 13, fontWeight: 900, color: "#059669", marginTop: 4}}>
                2 Treats Each!
              </span>
            </div>
          ))}

          <Heart left={580} top={45} size={92} frame={frame} />
          <div
            style={{
              position: "absolute",
              left: 470,
              top: 145,
              padding: "10px 26px",
              borderRadius: 999,
              background: "#FFFFFF",
              border: "3px solid #10B981",
              color: "#059669",
              fontSize: 24,
              fontWeight: 900,
              boxShadow: "0 8px 20px rgba(16, 185, 129, 0.15)",
              zIndex: 10,
            }}
          >
            ✨ Two treats for each friend!
          </div>
        </>
      )}

      {/* 1.4 Slide Turns */}
      {scene.visual === "slide-turns" && (
        <>
          <PlaygroundSlide frame={frame} />
          {/* Waiting line order */}
          <Person friend={friends.ruhi} left={140} frame={frame} />
          <Person friend={friends.aima} left={480} frame={frame} />
          <Person friend={friends.nuh} left={820} frame={frame} />

          {/* Turn sequence badges */}
          {[
            {label: "1st Turn", x: 200, color: "#EF4444"},
            {label: "2nd Turn", x: 540, color: "#F59E0B"},
            {label: "3rd Turn", x: 880, color: "#10B981"},
          ].map((turn, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: turn.x,
                top: 70,
                padding: "8px 18px",
                borderRadius: 999,
                background: "#FFFFFF",
                border: `3px solid ${turn.color}`,
                color: turn.color,
                fontWeight: 900,
                fontSize: 20,
                boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
              }}
            >
              {turn.label}
            </div>
          ))}

          <div
            style={{
              position: "absolute",
              left: 450,
              top: 135,
              padding: "10px 24px",
              borderRadius: 20,
              background: "#FFFFFF",
              color: "#334155",
              fontSize: 22,
              fontWeight: 900,
              boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
            }}
          >
            ⏳ Wait patiently &amp; play happily!
          </div>
        </>
      )}

      {/* 1.5 Invite a Friend */}
      {scene.visual === "invite" && (
        <>
          {/* Park Bench for Aima */}
          <div
            style={{
              position: "absolute",
              left: 880,
              bottom: 40,
              width: 280,
              height: 140,
              zIndex: 3,
            }}
          >
            {/* Wooden slats */}
            <div style={{width: 280, height: 16, background: "#B45309", borderRadius: 6, marginBottom: 8}} />
            <div style={{width: 280, height: 16, background: "#92400E", borderRadius: 6, marginBottom: 8}} />
            <div style={{width: 280, height: 20, background: "#78350F", borderRadius: 6}} />
            {/* Cast iron legs */}
            <div style={{position: "absolute", left: 30, bottom: -20, width: 14, height: 60, background: "#334155"}} />
            <div style={{position: "absolute", right: 30, bottom: -20, width: 14, height: 60, background: "#334155"}} />
          </div>

          <Person friend={friends.ruhi} left={180} frame={frame} pose="reach" />
          <Person friend={friends.nuh} left={480} frame={frame} pose="wave" />
          <Person friend={{...friends.aima, expression: "happy"}} left={920} frame={frame} />

          <SpeechBubble
            left={540}
            top={60}
            text="Would you like to play with us, Aima?"
            speaker="Ruhi &amp; Nuh"
            badgeColor="#FF6E7F"
          />
          <Heart left={780} top={180} size={76} frame={frame} />
        </>
      )}

      {/* 1.6 Remember & Belong */}
      {scene.visual === "remember" && (
        <>
          <Person friend={friends.ruhi} left={pos3[0]} frame={frame} pose="wave" />
          <Person friend={friends.aima} left={pos3[1]} frame={frame} pose="cheer" />
          <Person friend={friends.nuh} left={pos3[2]} frame={frame} pose="wave" />

          <Heart left={585} top={40} size={95} frame={frame} />
          {/* Key Message Ribbons */}
          <div
            style={{
              position: "absolute",
              left: 280,
              right: 280,
              top: 155,
              display: "flex",
              justifyContent: "center",
              gap: 16,
              zIndex: 10,
            }}
          >
            {[
              {icon: "🤝", text: "Share", color: "#FF6E7F"},
              {icon: "⏳", text: "Take Turns", color: "#F59E0B"},
              {icon: "💛", text: "Include Everyone", color: "#10B981"},
            ].map((badge, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 22px",
                  borderRadius: 999,
                  background: "#FFFFFF",
                  border: `3px solid ${badge.color}`,
                  color: "#1E293B",
                  fontSize: 22,
                  fontWeight: 900,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                }}
              >
                <span>{badge.icon}</span>
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* EPISODE 2: WEALTH & POVERTY (MORE THAN MONEY)                             */}
      {/* ========================================================================= */}

      {/* 2.1 Market Welcome */}
      {scene.visual === "market" && (
        <>
          {/* Market Booth Stall */}
          <div
            style={{
              position: "absolute",
              left: 310,
              top: 25,
              width: 700,
              height: 220,
              background: "#FFFFFF",
              border: "6px solid #E2E8F0",
              borderRadius: "24px 24px 12px 12px",
              boxShadow: "0 14px 28px rgba(0,0,0,0.1)",
              zIndex: 2,
              overflow: "hidden",
            }}
          >
            {/* Striped Awning */}
            <div
              style={{
                height: 48,
                background: "repeating-linear-gradient(90deg, #EF4444 0 45px, #FFFFFF 45px 90px)",
                borderBottom: "4px solid #DC2626",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 120,
                gap: 20,
              }}
            >
              <span style={{fontSize: 32, fontWeight: 900, color: "#1E293B"}}>🏪 SCHOOL PLAY MARKET</span>
            </div>
            {/* Counter bar */}
            <div style={{height: 24, background: "#D97706"}} />
          </div>

          <Person friend={friends.nuh} left={pos2[0]} frame={frame} pose="wave" />
          <Person friend={friends.aima} left={pos2[1]} frame={frame} pose="wave" />
        </>
      )}

      {/* 2.2 Different Coin Amounts */}
      {scene.visual === "different-coins" && (
        <>
          <Person friend={friends.nuh} left={pos2[0]} frame={frame} />
          <Person friend={friends.aima} left={pos2[1]} frame={frame} />

          {/* Nuh's 5 Tokens */}
          <div style={{position: "absolute", left: 470, top: 120, textAlign: "center"}}>
            <div style={{fontSize: 20, fontWeight: 900, color: "#2563EB", background: "#FFFFFF", padding: "6px 14px", borderRadius: 999, border: "2px solid #93C5FD"}}>
              Nuh: 5 Tokens
            </div>
            {[0, 1, 2, 3, 4].map((i) => (
              <StarCoin key={`n${i}`} left={(i % 3) * 44 - 40} top={40 + Math.floor(i / 3) * 42} frame={frame} delay={i * 4} />
            ))}
          </div>

          {/* Aima's 2 Tokens */}
          <div style={{position: "absolute", left: 730, top: 120, textAlign: "center"}}>
            <div style={{fontSize: 20, fontWeight: 900, color: "#059669", background: "#FFFFFF", padding: "6px 14px", borderRadius: 999, border: "2px solid #A7F3D0"}}>
              Aima: 2 Tokens
            </div>
            {[0, 1].map((i) => (
              <StarCoin key={`a${i}`} left={i * 48 - 20} top={40} frame={frame} delay={i * 8 + 12} />
            ))}
          </div>

          {/* Balanced Educational Note */}
          <div
            style={{
              position: "absolute",
              left: 430,
              top: 25,
              padding: "10px 24px",
              borderRadius: 20,
              background: "#FFFFFF",
              border: "3px solid #CBD5E1",
              fontSize: 22,
              fontWeight: 900,
              color: "#475569",
              boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
            }}
          >
            Different families have different amounts of money
          </div>
        </>
      )}

      {/* 2.3 Equal Worth */}
      {scene.visual === "equal-worth" && (
        <>
          <Person friend={friends.nuh} left={pos2[0]} frame={frame} pose="cheer" />
          <Person friend={friends.aima} left={pos2[1]} frame={frame} pose="cheer" />

          {/* Golden Balance Scale of Equal Importance */}
          <div
            style={{
              position: "absolute",
              left: 520,
              top: 50,
              width: 280,
              textAlign: "center",
              zIndex: 10,
            }}
          >
            <Heart left={90} top={0} size={100} color="#FB7185" frame={frame} />
            <div
              style={{
                marginTop: 100,
                padding: "12px 24px",
                borderRadius: 20,
                background: "#FFFFFF",
                border: "3px solid #F59E0B",
                color: "#1E293B",
                fontSize: 24,
                fontWeight: 900,
                boxShadow: "0 10px 24px rgba(245, 158, 11, 0.2)",
              }}
            >
              ⭐ Equal Worth &amp; Importance
            </div>
          </div>
        </>
      )}

      {/* 2.4 Share Game (Sidewalk Chalk Hopscotch) */}
      {scene.visual === "share-game" && (
        <>
          <Person friend={friends.nuh} left={pos2[0]} frame={frame} pose="reach" />
          <Person friend={friends.aima} left={pos2[1]} frame={frame} pose="cheer" />

          {/* Colorful Hopscotch drawn in chalk on the ground */}
          <div
            style={{
              position: "absolute",
              left: 500,
              bottom: 40,
              width: 320,
              height: 220,
              zIndex: 3,
            }}
          >
            <svg width="320" height="220" viewBox="0 0 320 220">
              {/* Hopscotch squares */}
              <rect x="120" y="160" width="80" height="50" fill="none" stroke="#60A5FA" strokeWidth="6" rx="6" />
              <text x="160" y="195" textAnchor="middle" fill="#2563EB" fontSize="28" fontWeight="900">1</text>
              <rect x="120" y="105" width="80" height="50" fill="none" stroke="#F472B6" strokeWidth="6" rx="6" />
              <text x="160" y="140" textAnchor="middle" fill="#DB2777" fontSize="28" fontWeight="900">2</text>
              <rect x="70" y="50" width="80" height="50" fill="none" stroke="#FBBF24" strokeWidth="6" rx="6" />
              <text x="110" y="85" textAnchor="middle" fill="#D97706" fontSize="28" fontWeight="900">3</text>
              <rect x="170" y="50" width="80" height="50" fill="none" stroke="#34D399" strokeWidth="6" rx="6" />
              <text x="210" y="85" textAnchor="middle" fill="#059669" fontSize="28" fontWeight="900">4</text>
            </svg>
          </div>

          <div
            style={{
              position: "absolute",
              left: 510,
              top: 50,
              padding: "10px 24px",
              borderRadius: 20,
              background: "#FFFFFF",
              border: "3px solid #3B82F6",
              color: "#1E293B",
              fontSize: 22,
              fontWeight: 900,
              boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
            }}
          >
            🖍️ Sharing chalk &amp; drawing hopscotch!
          </div>
        </>
      )}

      {/* 2.5 Friendship More Than Coins */}
      {scene.visual === "friendship" && (
        <>
          <Person friend={friends.ruhi} left={pos3[0]} frame={frame} pose="cheer" />
          <Person friend={friends.aima} left={pos3[1]} frame={frame} pose="cheer" />
          <Person friend={friends.nuh} left={pos3[2]} frame={frame} pose="cheer" />

          <Heart left={580} top={40} size={110} color="#FB7185" frame={frame} />
          <div
            style={{
              position: "absolute",
              left: 440,
              top: 165,
              padding: "12px 28px",
              borderRadius: 999,
              background: "#FFFFFF",
              border: "3px solid #FB7185",
              color: "#BE123C",
              fontSize: 26,
              fontWeight: 900,
              boxShadow: "0 10px 24px rgba(225, 29, 72, 0.15)",
            }}
          >
            💖 True Friendship is Priceless!
          </div>
        </>
      )}

      {/* 2.6 Respect & No Teasing */}
      {scene.visual === "respect" && (
        <>
          <Person friend={friends.nuh} left={pos2[0]} frame={frame} pose="wave" />
          <Person friend={friends.aima} left={pos2[1]} frame={frame} pose="wave" />

          <SpeechBubble
            left={510}
            top={70}
            text="Kind words always. We never tease about money!"
            speaker="Rule of Respect"
            badgeColor="#10B981"
          />
        </>
      )}

      {/* ========================================================================= */}
      {/* EPISODE 3: EQUALITY OF OPPORTUNITY (EVERYONE GETS A CHANCE)                */}
      {/* ========================================================================= */}

      {/* 3.1 Garden Welcome */}
      {scene.visual === "garden" && (
        <>
          {/* Raised Garden Planter with Fresh Veggies */}
          <div
            style={{
              position: "absolute",
              left: 450,
              bottom: 30,
              width: 420,
              height: 140,
              zIndex: 3,
            }}
          >
            {/* Wooden planter box */}
            <div style={{position: "absolute", bottom: 0, width: "100%", height: 75, background: "#92400E", borderRadius: 12, border: "4px solid #78350F"}} />
            {/* Cucumber vine on left */}
            <svg style={{position: "absolute", left: 50, bottom: 45}} width="80" height="90" viewBox="0 0 80 90">
              <ellipse cx="40" cy="50" rx="18" ry="38" fill="#22C55E" transform="rotate(-15 40 50)" />
              <circle cx="32" cy="40" r="3" fill="#15803D" />
              <circle cx="48" cy="58" r="3" fill="#15803D" />
              <path d="M40 12 Q32 2 46 2" stroke="#15803D" strokeWidth="4" fill="none" />
            </svg>
            {/* Sunflower in center */}
            <svg style={{position: "absolute", left: 170, bottom: 40}} width="80" height="110" viewBox="0 0 80 110">
              <line x1="40" y1="110" x2="40" y2="40" stroke="#15803D" strokeWidth="6" />
              <circle cx="40" cy="40" r="26" fill="#FBBF24" />
              <circle cx="40" cy="40" r="14" fill="#78350F" />
            </svg>
            {/* Sweet Golden Mangoes on right */}
            <svg style={{position: "absolute", right: 50, bottom: 45}} width="80" height="90" viewBox="0 0 80 90">
              <ellipse cx="40" cy="50" rx="26" ry="36" fill="#F59E0B" transform="rotate(20 40 50)" />
              <ellipse cx="36" cy="45" rx="18" ry="26" fill="#FBBF24" transform="rotate(20 40 50)" />
              <path d="M44 16 Q38 6 50 4" stroke="#15803D" strokeWidth="4" fill="none" />
            </svg>
          </div>

          <Person friend={friends.ruhi} left={120} frame={frame} pose="wave" />
          <Person friend={friends.aima} left={900} frame={frame} pose="wave" />
          <Person friend={friends.nuh} left={1090} frame={frame} pose="wave" />
        </>
      )}

      {/* 3.2 Different Choices */}
      {scene.visual === "choices" && (
        <>
          <Person friend={friends.ruhi} left={pos2[0]} frame={frame} />
          <Person friend={friends.aima} left={pos2[1]} frame={frame} />

          {/* Choice Cards for Cucumbers & Mangoes */}
          <div
            style={{
              position: "absolute",
              left: 450,
              top: 80,
              display: "flex",
              gap: 24,
              zIndex: 10,
            }}
          >
            <div
              style={{
                width: 190,
                padding: "16px",
                borderRadius: 20,
                background: "#FFFFFF",
                border: "4px solid #22C55E",
                textAlign: "center",
                boxShadow: "0 8px 20px rgba(34, 197, 94, 0.15)",
              }}
            >
              <div style={{fontSize: 42}}>🥒</div>
              <div style={{fontSize: 18, fontWeight: 900, color: "#15803D", marginTop: 4}}>Ruhi's Pick</div>
              <div style={{fontSize: 14, fontWeight: 700, color: "#475569"}}>Crisp Cucumber</div>
            </div>

            <div
              style={{
                width: 190,
                padding: "16px",
                borderRadius: 20,
                background: "#FFFFFF",
                border: "4px solid #F59E0B",
                textAlign: "center",
                boxShadow: "0 8px 20px rgba(245, 158, 11, 0.15)",
              }}
            >
              <div style={{fontSize: 42}}>🥭</div>
              <div style={{fontSize: 18, fontWeight: 900, color: "#D97706", marginTop: 4}}>Aima's Pick</div>
              <div style={{fontSize: 14, fontWeight: 700, color: "#475569"}}>Sweet Mango</div>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 480,
              top: 250,
              padding: "10px 24px",
              borderRadius: 20,
              background: "#FFFFFF",
              border: "3px solid #CBD5E1",
              fontSize: 22,
              fontWeight: 900,
              color: "#334155",
            }}
          >
            ✅ Both are wonderful choices!
          </div>
        </>
      )}

      {/* 3.3 Activity Options (Ball, Hoop, Cards) */}
      {(scene.visual === "choose" || scene.visual === "game-options") && (
        <>
          <Person friend={friends.ruhi} left={pos3[0]} frame={frame} pose="cheer" />
          <Person friend={friends.aima} left={pos3[1]} frame={frame} pose="cheer" />
          <Person friend={friends.nuh} left={pos3[2]} frame={frame} pose="cheer" />

          {/* Three Activity Options */}
          <div
            style={{
              position: "absolute",
              left: 380,
              top: 50,
              display: "flex",
              gap: 20,
              zIndex: 10,
            }}
          >
            {[
              {emoji: "⚽", title: "Soft Ball", color: "#3B82F6"},
              {emoji: "⭕", title: "Fun Hoop", color: "#EC4899"},
              {emoji: "🃏", title: "Picture Cards", color: "#F59E0B"},
            ].map((act, i) => (
              <div
                key={i}
                style={{
                  width: 160,
                  padding: "16px 10px",
                  borderRadius: 22,
                  background: "#FFFFFF",
                  border: `4px solid ${act.color}`,
                  textAlign: "center",
                  boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
                  transform: `translateY(${Math.sin((frame + i * 20) / 12) * 6}px)`,
                }}
              >
                <div style={{fontSize: 44}}>{act.emoji}</div>
                <div style={{fontSize: 18, fontWeight: 900, color: "#1E293B", marginTop: 4}}>{act.title}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 3.4 Make Space for a Friend */}
      {scene.visual === "make-space" && (
        <>
          <Person friend={friends.ruhi} left={160} frame={frame} pose="reach" />
          <Person friend={friends.nuh} left={480} frame={frame} pose="wave" />
          <Person friend={friends.aima} left={920} frame={frame} pose="cheer" />

          <Heart left={740} top={70} size={88} frame={frame} />
          <SpeechBubble
            left={500}
            top={75}
            text="Come on in, Aima! Your turn is right now!"
            speaker="Ruhi &amp; Nuh"
            badgeColor="#10B981"
          />
        </>
      )}

      {/* 3.5 Opportunity for Everyone */}
      {scene.visual === "opportunity" && (
        <>
          <Person friend={friends.ruhi} left={pos3[0]} frame={frame} pose="cheer" />
          <Person friend={friends.aima} left={pos3[1]} frame={frame} pose="cheer" />
          <Person friend={friends.nuh} left={pos3[2]} frame={frame} pose="cheer" />

          {/* Three golden pillars of Opportunity: Join, Choose, Try */}
          <div
            style={{
              position: "absolute",
              left: 360,
              top: 55,
              display: "flex",
              gap: 18,
              zIndex: 10,
            }}
          >
            {[
              {action: "🌟 JOIN", desc: "Everyone Included", color: "#FF6E7F"},
              {action: "🎯 CHOOSE", desc: "Favorite Activities", color: "#F59E0B"},
              {action: "🚀 TRY", desc: "Give Your Best", color: "#10B981"},
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: "14px 22px",
                  borderRadius: 20,
                  background: "#FFFFFF",
                  border: `3px solid ${item.color}`,
                  textAlign: "center",
                  boxShadow: "0 10px 22px rgba(0,0,0,0.08)",
                }}
              >
                <div style={{fontSize: 22, fontWeight: 900, color: item.color}}>{item.action}</div>
                <div style={{fontSize: 14, fontWeight: 700, color: "#475569"}}>{item.desc}</div>
              </div>
            ))}
          </div>
          <Heart left={580} top={175} size={70} color="#34D399" frame={frame} />
        </>
      )}

      {/* ========================================================================= */}
      {/* EPISODE 4: CHALLENGING INJUSTICE (MAKING THINGS RIGHT)                     */}
      {/* ========================================================================= */}

      {/* 4.1 Art Time Building */}
      {scene.visual === "art-time" && (
        <>
          <Person friend={friends.nuh} left={pos2[0]} frame={frame} />
          <Person friend={friends.ruhi} left={pos2[1]} frame={frame} />

          {/* Tall magnificent block tower */}
          <div style={{position: "absolute", left: 610, top: 80, zIndex: 6}}>
            <Block left={0} top={150} color="#EF4444" letter="A" />
            <Block left={84} top={150} color="#3B82F6" letter="B" />
            <Block left={42} top={72} color="#F59E0B" letter="C" />
            <Block left={42} top={-6} color="#10B981" letter="⭐" />
          </div>
        </>
      )}

      {/* 4.2 Oops! Tower Tumbles */}
      {scene.visual === "oops" && (
        <>
          <Person friend={{...friends.nuh, expression: "surprised"}} left={pos2[0]} frame={frame} />
          <Person friend={{...friends.ruhi, expression: "surprised"}} left={pos2[1]} frame={frame} />

          {/* Tumbling blocks scattered on table */}
          <div style={{position: "absolute", left: 560, top: 120, zIndex: 6}}>
            <Block left={0} top={150} color="#EF4444" letter="A" fallen frame={frame} delay={0} />
            <Block left={130} top={160} color="#3B82F6" letter="B" fallen frame={frame} delay={5} />
            <Block left={60} top={180} color="#F59E0B" letter="C" fallen frame={frame} delay={10} />
            <Block left={200} top={170} color="#10B981" letter="⭐" fallen frame={frame} delay={15} />
          </div>

          <div
            style={{
              position: "absolute",
              left: 510,
              top: 50,
              padding: "12px 28px",
              borderRadius: 20,
              background: "#FFFFFF",
              border: "3px solid #EF4444",
              color: "#DC2626",
              fontSize: 26,
              fontWeight: 900,
              boxShadow: "0 8px 24px rgba(239, 68, 68, 0.15)",
            }}
          >
            💥 Oops! Accidents can happen!
          </div>
        </>
      )}

      {/* 4.3 Tell Truth & Apologize */}
      {scene.visual === "truth" && (
        <>
          <Person friend={{...friends.nuh, expression: "thinking"}} left={pos3[0]} frame={frame} pose="thinking" />
          <Person friend={friends.ruhi} left={pos3[1]} frame={frame} />
          <Person friend={friends.aima} left={pos3[2]} frame={frame} />

          <SpeechBubble
            left={340}
            top={60}
            text="I knocked it over by mistake. I am really sorry!"
            speaker="Brave Nuh"
            badgeColor="#3B82F6"
          />

          <div
            style={{
              position: "absolute",
              left: 520,
              top: 180,
              padding: "8px 20px",
              borderRadius: 999,
              background: "#FFFFFF",
              border: "3px solid #F59E0B",
              color: "#D97706",
              fontSize: 20,
              fontWeight: 900,
            }}
          >
            ⭐ Telling the truth takes courage!
          </div>
        </>
      )}

      {/* 4.4 Listen & Work Together */}
      {scene.visual === "listen" && (
        <>
          <Person friend={friends.nuh} left={pos3[0]} frame={frame} />
          <Person friend={friends.ruhi} left={pos3[1]} frame={frame} pose="reach" />
          <Person friend={friends.aima} left={pos3[2]} frame={frame} pose="wave" />

          <SpeechBubble
            left={510}
            top={50}
            text="Thank you for being honest! Let us rebuild it together!"
            speaker="Ruhi &amp; Aima"
            badgeColor="#FF6E7F"
          />
          <Heart left={880} top={140} size={75} color="#F59E0B" frame={frame} />
        </>
      )}

      {/* 4.5 Repair & Rebuild */}
      {scene.visual === "repair" && (
        <>
          <Person friend={friends.nuh} left={pos3[0]} frame={frame} pose="reach" />
          <Person friend={friends.ruhi} left={pos3[1]} frame={frame} pose="reach" />
          <Person friend={friends.aima} left={pos3[2]} frame={frame} pose="cheer" />

          {/* Blocks hopping back into a tall tower */}
          <div style={{position: "absolute", left: 605, top: 80, zIndex: 6}}>
            <Block left={0} top={150} homeTop={150} color="#EF4444" letter="A" frame={frame} delay={0} />
            <Block left={84} top={150} homeTop={150} color="#3B82F6" letter="B" frame={frame} delay={8} />
            <Block left={42} top={180} homeTop={72} color="#F59E0B" letter="C" frame={frame} delay={16} />
            <Block left={42} top={180} homeTop={-6} color="#10B981" letter="⭐" frame={frame} delay={24} />
          </div>

          <Heart left={590} top={35} size={70} frame={frame} />
        </>
      )}

      {/* 4.6 Brave & Make it Right */}
      {scene.visual === "brave" && (
        <>
          <Person friend={friends.ruhi} left={pos3[0]} frame={frame} pose="cheer" />
          <Person friend={friends.nuh} left={pos3[1]} frame={frame} pose="cheer" />
          <Person friend={friends.aima} left={pos3[2]} frame={frame} pose="cheer" />

          <div
            style={{
              position: "absolute",
              left: 360,
              top: 55,
              padding: "14px 28px",
              borderRadius: 24,
              background: "#FFFFFF",
              border: "4px solid #10B981",
              color: "#059669",
              fontSize: 26,
              fontWeight: 900,
              boxShadow: "0 10px 28px rgba(16, 185, 129, 0.15)",
              textAlign: "center",
            }}
          >
            🛡️ Tell the Truth · Apologize · Repair Together!
          </div>
          <Heart left={580} top={145} size={80} color="#F59E0B" frame={frame} />
        </>
      )}

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE THINKING / QUIZ SCENE                                       */}
      {/* ========================================================================= */}
      {scene.visual === "quiz" && (
        <>
          <Person friend={{...friends.ruhi, expression: "thinking"}} left={pos3[0]} frame={frame} pose="thinking" />
          <Person friend={{...friends.aima, expression: "thinking"}} left={pos3[1]} frame={frame} pose="thinking" />
          <Person friend={{...friends.nuh, expression: "thinking"}} left={pos3[2]} frame={frame} pose="thinking" />

          {/* Sleek Golden Question Banner across the top */}
          <div
            style={{
              position: "absolute",
              left: 360,
              top: 15,
              width: 600,
              height: 90,
              borderRadius: 24,
              background: "linear-gradient(135deg, #FFFFFF 0%, #FEF9C3 100%)",
              border: "4px solid #F59E0B",
              boxShadow: "0 12px 28px rgba(245, 158, 11, 0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              transform: `scale(${questionScale})`,
              zIndex: 10,
            }}
          >
            {/* Glowing Question Mark Badge */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                display: "grid",
                placeItems: "center",
                color: "#FFFFFF",
                fontSize: 38,
                fontWeight: 900,
                boxShadow: "0 4px 10px rgba(217, 119, 6, 0.35)",
              }}
            >
              ?
            </div>
            <div>
              <div style={{fontSize: 26, fontWeight: 900, color: "#92400E", letterSpacing: 0.5}}>
                WHAT WOULD YOU DO?
              </div>
              <div style={{fontSize: 14, fontWeight: 800, color: "#B45309", letterSpacing: 1}}>
                YOUR TURN TO THINK OF A FAIR ANSWER
              </div>
            </div>
          </div>

          {/* Pause & Think Action Callout in the last 120 frames */}
          {frame > durationInFrames - 120 && (
            <div
              style={{
                position: "absolute",
                left: 440,
                top: 120,
                padding: "10px 28px",
                borderRadius: 999,
                background: "#FEF08A",
                border: "3.5px solid #EAB308",
                boxShadow: "0 10px 24px rgba(234, 179, 8, 0.25)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                zIndex: 12,
              }}
            >
              <span style={{fontSize: 24}}>⏸️</span>
              <span style={{fontSize: 22, fontWeight: 900, color: "#854D0E", letterSpacing: 1}}>
                PAUSE THE VIDEO &amp; THINK!
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};
