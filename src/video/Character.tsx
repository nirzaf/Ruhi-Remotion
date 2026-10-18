import React from "react";
import {useCurrentFrame} from "remotion";

export type Friend = {
  id: string;
  name: string;
  skin: string;
  hair: string;
  shirt: string;
  accent?: string;
  pants?: string;
  shoes?: string;
  expression?: "happy" | "sad" | "surprised" | "thinking";
  wheelchair?: boolean;
  hairStyle?: "ruhi" | "buns" | "fade";
  badgeColor?: string;
};

export const friends: Record<string, Friend> = {
  ruhi: {
    id: "ruhi",
    name: "Ruhi",
    skin: "#C68864",
    hair: "#2E201B",
    shirt: "#FF6E7F",
    accent: "#FDE047",
    pants: "#2B3E50",
    shoes: "#EF4444",
    hairStyle: "ruhi",
    badgeColor: "#FF6E7F",
  },
  aima: {
    id: "aima",
    name: "Aima",
    skin: "#DFAB81",
    hair: "#231B17",
    shirt: "#34D399",
    accent: "#FBBF24",
    pants: "#7C3AED",
    shoes: "#F59E0B",
    hairStyle: "buns",
    badgeColor: "#10B981",
  },
  nuh: {
    id: "nuh",
    name: "Nuh",
    skin: "#B8754D",
    hair: "#1C1816",
    shirt: "#2563EB",
    accent: "#FB923C",
    pants: "#475569",
    shoes: "#2563EB",
    hairStyle: "fade",
    badgeColor: "#3B82F6",
  },
};

// Aliases for compatibility
friends.layla = {...friends.aima, name: "Aima"};
friends.sami = {...friends.nuh, name: "Nuh"};
friends.noor = {...friends.aima, name: "Aima"};
friends.adam = {...friends.nuh, name: "Nuh"};
friends.maya = {...friends.aima, name: "Aima"};
friends.omar = {...friends.nuh, name: "Nuh"};

type CharacterProps = {
  friend: Friend;
  width?: number;
  label?: boolean;
  pose?: "stand" | "wave" | "reach" | "thinking" | "cheer";
  frame?: number;
};

export const Character: React.FC<CharacterProps> = ({
  friend,
  width = 240,
  label = true,
  pose = "stand",
  frame: propFrame,
}) => {
  const currentFrame = useCurrentFrame();
  const frame = propFrame ?? currentFrame;

  const seed = (friend.name.charCodeAt(0) * 17 + friend.name.charCodeAt(friend.name.length - 1)) % 100;
  const breathY = Math.sin((frame + seed * 3) / 14) * 2;
  const swayAngle = Math.sin((frame + seed * 5) / 26) * 1.2;

  // Natural organic blinking cycle
  const blinkCycle = (frame + seed * 23) % 110;
  const isBlinking = blinkCycle < 5;

  // Waving animation
  const waveAngle = pose === "wave" ? Math.sin(frame / 4.2) * 18 : 0;

  // Cheering animation
  const cheerBounce = pose === "cheer" ? Math.abs(Math.sin(frame / 5)) * 6 : 0;

  const expression = friend.expression ?? "happy";

  // Eyebrow geometry
  const renderEyebrows = () => {
    switch (expression) {
      case "thinking":
        return (
          <>
            <path d="M120 130 Q135 120 150 131" fill="none" stroke="#2A1B14" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M170 133 Q185 130 198 135" fill="none" stroke="#2A1B14" strokeWidth="4.5" strokeLinecap="round" />
          </>
        );
      case "surprised":
        return (
          <>
            <path d="M120 125 Q135 116 150 125" fill="none" stroke="#2A1B14" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M170 125 Q185 116 200 125" fill="none" stroke="#2A1B14" strokeWidth="4.5" strokeLinecap="round" />
          </>
        );
      case "sad":
        return (
          <>
            <path d="M122 135 Q136 128 150 133" fill="none" stroke="#2A1B14" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M170 133 Q184 128 198 135" fill="none" stroke="#2A1B14" strokeWidth="4.5" strokeLinecap="round" />
          </>
        );
      case "happy":
      default:
        return (
          <>
            <path d="M121 129 Q135 122 149 130" fill="none" stroke="#2A1B14" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M171 130 Q185 122 199 129" fill="none" stroke="#2A1B14" strokeWidth="4.5" strokeLinecap="round" />
          </>
        );
    }
  };

  // Eye geometry with glossy cartoon reflections
  const renderEye = (cx: number, cy: number) => {
    if (isBlinking) {
      return (
        <path
          d={`M${cx - 13} ${cy + 1} Q${cx} ${cy + 9} ${cx + 13} ${cy + 1}`}
          fill="none"
          stroke="#2A1B14"
          strokeWidth="4"
          strokeLinecap="round"
        />
      );
    }

    return (
      <g>
        {/* Eyeball white */}
        <ellipse cx={cx} cy={cy} rx="14" ry="16" fill="#FFFFFF" />
        {/* Iris */}
        <circle cx={cx} cy={cy + 1} r="9.5" fill="#3E2723" />
        {/* Pupil */}
        <circle cx={cx} cy={cy + 1} r="5.5" fill="#150E0B" />
        {/* Shiny highlights for Pixar/storybook feel */}
        <circle cx={cx + 3} cy={cy - 3} r="3.5" fill="#FFFFFF" />
        <circle cx={cx - 3.5} cy={cy + 4} r="1.8" fill="#FFFFFF" opacity="0.9" />
        {/* Upper eyelid contour */}
        <path
          d={`M${cx - 14} ${cy - 4} Q${cx} ${cy - 16} ${cx + 14} ${cy - 4}`}
          fill="none"
          stroke="#2A1B14"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
    );
  };

  // Mouth expressions
  const renderMouth = () => {
    switch (expression) {
      case "surprised":
        return (
          <g>
            <ellipse cx="160" cy="180" rx="9" ry="13" fill="#6B1D2F" stroke="#4A101E" strokeWidth="2.5" />
            <ellipse cx="160" cy="184" rx="6" ry="6" fill="#F87171" />
          </g>
        );
      case "sad":
        return (
          <path
            d="M145 186 Q160 174 175 186"
            fill="none"
            stroke="#591C28"
            strokeWidth="4"
            strokeLinecap="round"
          />
        );
      case "thinking":
        return (
          <path
            d="M148 180 Q161 176 173 178"
            fill="none"
            stroke="#591C28"
            strokeWidth="4"
            strokeLinecap="round"
          />
        );
      case "happy":
      default:
        return (
          <g>
            {/* Open happy smile */}
            <path
              d="M142 173 Q160 197 178 173 Z"
              fill="#881337"
              stroke="#591C28"
              strokeWidth="2.5"
            />
            {/* Upper teeth white curve */}
            <path
              d="M145 174 Q160 182 175 174"
              fill="#FFFFFF"
            />
            {/* Soft pink tongue */}
            <path
              d="M151 190 Q160 182 169 190 Z"
              fill="#FB7185"
            />
            {/* Smile outline */}
            <path
              d="M139 171 Q160 199 181 171"
              fill="none"
              stroke="#591C28"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>
        );
    }
  };

  // Hair rendering by character
  const renderHair = () => {
    const style = friend.hairStyle ?? "ruhi";
    if (style === "buns") {
      // AIMA: Adorable twin high puff buns with cute ribbons
      return (
        <g fill={friend.hair}>
          {/* Left bun */}
          <circle cx="98" cy="62" r="34" />
          <circle cx="92" cy="56" r="30" />
          <path d="M88 88 L108 92 L96 100 Z" fill={friend.accent ?? "#FBBF24"} />
          <circle cx="100" cy="90" r="7" fill={friend.accent ?? "#FBBF24"} />

          {/* Right bun */}
          <circle cx="222" cy="62" r="34" />
          <circle cx="228" cy="56" r="30" />
          <path d="M232 88 L212 92 L224 100 Z" fill={friend.accent ?? "#FBBF24"} />
          <circle cx="220" cy="90" r="7" fill={friend.accent ?? "#FBBF24"} />

          {/* Crown and bangs */}
          <path d="M102 115 Q106 58 160 56 Q214 58 218 115 Q188 94 160 92 Q132 94 102 115 Z" />
          {/* Cute side curls */}
          <circle cx="106" cy="118" r="8" />
          <circle cx="214" cy="118" r="8" />
        </g>
      );
    }

    if (style === "fade") {
      // NUH: Textured curly taper fade with sharp stylish edge
      return (
        <g fill={friend.hair}>
          {/* Rounded textured crown */}
          <path d="M98 116 Q100 52 160 50 Q220 52 222 116 Q208 92 186 90 Q160 92 134 90 Q112 92 98 116 Z" />
          {/* Curls texture bumps */}
          <circle cx="132" cy="53" r="10" />
          <circle cx="152" cy="48" r="11" />
          <circle cx="174" cy="51" r="10" />
          <circle cx="192" cy="60" r="10" />
          <circle cx="118" cy="62" r="9" />
          {/* Side fades */}
          <path d="M98 116 L108 126 L112 110 Z" opacity="0.6" />
          <path d="M222 116 L212 126 L208 110 Z" opacity="0.6" />
        </g>
      );
    }

    // RUHI: Wavy, bouncy long hair with turquoise star/clips
    return (
      <g>
        {/* Back hair mantle */}
        <path
          d="M90 120 Q82 170 86 210 Q112 214 120 180 Q104 140 106 116 Z"
          fill={friend.hair}
        />
        <path
          d="M230 120 Q238 170 234 210 Q208 214 200 180 Q216 140 214 116 Z"
          fill={friend.hair}
        />
        {/* Main crown & wavy bangs */}
        <path
          d="M96 116 Q100 52 160 50 Q220 52 224 116 Q194 92 160 92 Q126 92 96 116 Z"
          fill={friend.hair}
        />
        {/* Soft face-framing waves */}
        <path
          d="M96 114 Q106 148 112 170 Q122 164 120 144 Q116 118 106 112 Z"
          fill={friend.hair}
        />
        <path
          d="M224 114 Q214 148 208 170 Q198 164 200 144 Q204 118 214 112 Z"
          fill={friend.hair}
        />
        {/* Cute turquoise hair clips on the right */}
        <circle cx="212" cy="98" r="6" fill="#2DD4BF" stroke="#0F766E" strokeWidth="1.5" />
        <circle cx="218" cy="110" r="5" fill="#38BDF8" stroke="#0369A1" strokeWidth="1.5" />
      </g>
    );
  };

  // Shirt graphic/detail
  const renderShirtDetail = () => {
    if (friend.hairStyle === "fade") {
      // Nuh: Sporty athletic chest stripes
      return (
        <g>
          <path d="M120 250 L200 250 L195 264 L125 264 Z" fill="#FFFFFF" opacity="0.9" />
          <path d="M123 266 L197 266 L192 276 L128 276 Z" fill="#FB923C" />
        </g>
      );
    }
    if (friend.hairStyle === "buns") {
      // Aima: Cute sunshine star graphic
      return (
        <g transform="translate(160, 260) scale(0.85)">
          <path
            d="M0 -14 L4 -4 L14 -4 L6 2 L9 12 L0 6 L-9 12 L-6 2 L-14 -4 L-4 -4 Z"
            fill="#FDE047"
            stroke="#D97706"
            strokeWidth="1.5"
          />
        </g>
      );
    }
    // Ruhi: Warm golden heart / sunshine emblem
    return (
      <g transform="translate(160, 262) scale(0.8)">
        <path
          d="M0 8 C-12 -2 -14 -12 0 -18 C14 -12 12 -2 0 8 Z"
          fill="#FEF08A"
          stroke="#F59E0B"
          strokeWidth="1.5"
        />
        <circle cx="0" cy="-6" r="3.5" fill="#F59E0B" />
      </g>
    );
  };

  return (
    <div
      style={{
        width,
        position: "relative",
        textAlign: "center",
        flexShrink: 0,
        transform: `translateY(${breathY - cheerBounce}px) rotate(${swayAngle}deg)`,
        transformOrigin: "bottom center",
      }}
    >
      <svg
        viewBox="0 0 320 440"
        width="100%"
        height="auto"
        role="img"
        aria-label={`${friend.name} cartoon character`}
        style={{overflow: "visible"}}
      >
        <defs>
          <radialGradient id={`blush-${friend.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FB7185" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FB7185" stopOpacity="0" />
          </radialGradient>
          <filter id={`shadow-${friend.id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Soft ground shadow */}
        <ellipse cx="160" cy="422" rx="92" ry="13" fill="#1E293B" opacity="0.15" />

        {/* Wheelchair support if requested */}
        {friend.wheelchair && (
          <g>
            <circle cx="92" cy="338" r="66" fill="none" stroke="#64748B" strokeWidth="8" />
            <circle cx="92" cy="338" r="54" fill="none" stroke="#38BDF8" strokeWidth="4" strokeDasharray="6 8" />
            <circle cx="92" cy="338" r="10" fill="#334155" />
            <path d="M92 272 H158 L188 344 H102 L72 300 H38" fill="none" stroke="#475569" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M150 270 V232 H184" fill="none" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
          </g>
        )}

        {/* Legs & Pants */}
        {!friend.wheelchair ? (
          <g fill={friend.pants ?? "#334155"}>
            {/* Left Leg */}
            <path d="M116 312 L105 396 Q104 408 122 408 H143 L152 332 Z" />
            {/* Right Leg */}
            <path d="M168 332 L177 408 H198 Q216 408 215 396 L204 312 Z" />
            {/* Cuffs */}
            <rect x="105" y="394" width="38" height="6" rx="3" fill="#1E293B" opacity="0.3" />
            <rect x="177" y="394" width="38" height="6" rx="3" fill="#1E293B" opacity="0.3" />

            {/* Left Shoe */}
            <g>
              <ellipse cx="122" cy="415" rx="22" ry="9" fill={friend.shoes ?? "#EF4444"} />
              <path d="M102 414 Q108 408 124 408 Q140 408 144 414 Z" fill={friend.shoes ?? "#EF4444"} />
              <ellipse cx="114" cy="414" rx="10" ry="6" fill="#FFFFFF" />
              <rect x="100" y="416" width="46" height="5" rx="2.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            </g>

            {/* Right Shoe */}
            <g>
              <ellipse cx="198" cy="415" rx="22" ry="9" fill={friend.shoes ?? "#EF4444"} />
              <path d="M178 414 Q184 408 200 408 Q216 408 220 414 Z" fill={friend.shoes ?? "#EF4444"} />
              <ellipse cx="206" cy="414" rx="10" ry="6" fill="#FFFFFF" />
              <rect x="176" y="416" width="46" height="5" rx="2.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            </g>
          </g>
        ) : (
          <g fill={friend.pants ?? "#6B46C1"}>
            <path d="M115 310 Q132 331 160 344 L185 359 L173 379 L140 367 L106 346 Z" />
            <path d="M163 312 L198 330 L225 345 L213 363 L185 352 L157 334 Z" />
          </g>
        )}

        {/* Torso & Shirt */}
        <g>
          {/* Main Shirt Body */}
          <path
            d="M112 216 Q160 196 208 216 L226 318 Q227 332 212 332 H108 Q93 332 94 318 Z"
            fill={friend.shirt}
          />
          {/* Collar Notch */}
          <path d="M144 204 Q160 218 176 204" fill="none" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
          {/* Shirt Graphic */}
          {renderShirtDetail()}
          {/* Lower hem seam */}
          <path d="M102 324 Q160 328 218 324" fill="none" stroke="#000000" strokeWidth="2" opacity="0.12" />
        </g>

        {/* Arms */}
        {/* Left Arm (Relaxed) */}
        <g>
          <path
            d="M114 232 Q86 260 76 304"
            fill="none"
            stroke={friend.skin}
            strokeWidth="20"
            strokeLinecap="round"
          />
          {/* Sleeve cap */}
          <path d="M114 220 Q96 235 90 252" fill="none" stroke={friend.shirt} strokeWidth="18" strokeLinecap="round" />
          {/* Left Hand with cute rounded thumb */}
          <circle cx="75" cy="306" r="13" fill={friend.skin} />
          <circle cx="83" cy="302" r="6" fill={friend.skin} />
        </g>

        {/* Right Arm: dynamic based on pose */}
        {pose === "wave" ? (
          <g transform={`rotate(${waveAngle} 210 226)`}>
            {/* Upper arm going up */}
            <path
              d="M206 230 Q235 200 248 162"
              fill="none"
              stroke={friend.skin}
              strokeWidth="20"
              strokeLinecap="round"
            />
            {/* Sleeve cap */}
            <path d="M206 220 Q222 214 232 230" fill="none" stroke={friend.shirt} strokeWidth="18" strokeLinecap="round" />
            {/* Waving Hand with spread fingers */}
            <circle cx="249" cy="158" r="14" fill={friend.skin} />
            <circle cx="239" cy="154" r="6" fill={friend.skin} />
            <circle cx="258" cy="150" r="5" fill={friend.skin} />
            <circle cx="254" cy="144" r="5" fill={friend.skin} />
          </g>
        ) : pose === "reach" ? (
          <g>
            {/* Reaching arm extending forward */}
            <path
              d="M206 232 Q256 244 290 220"
              fill="none"
              stroke={friend.skin}
              strokeWidth="20"
              strokeLinecap="round"
            />
            <path d="M206 222 Q224 236 230 252" fill="none" stroke={friend.shirt} strokeWidth="18" strokeLinecap="round" />
            <circle cx="292" cy="218" r="14" fill={friend.skin} />
            <circle cx="284" cy="210" r="6" fill={friend.skin} />
          </g>
        ) : pose === "thinking" ? (
          <g>
            {/* Hand touching chin thoughtfully */}
            <path
              d="M206 232 Q234 220 200 186"
              fill="none"
              stroke={friend.skin}
              strokeWidth="20"
              strokeLinecap="round"
            />
            <path d="M206 222 Q224 236 230 252" fill="none" stroke={friend.shirt} strokeWidth="18" strokeLinecap="round" />
            <circle cx="196" cy="184" r="13" fill={friend.skin} />
            <circle cx="188" cy="178" r="5" fill={friend.skin} />
          </g>
        ) : pose === "cheer" ? (
          <g>
            {/* Both arms reaching up */}
            <path
              d="M206 230 Q240 190 256 150"
              fill="none"
              stroke={friend.skin}
              strokeWidth="20"
              strokeLinecap="round"
            />
            <circle cx="258" cy="148" r="14" fill={friend.skin} />
          </g>
        ) : (
          <g>
            {/* Right Arm (Relaxed) */}
            <path
              d="M206 232 Q234 260 244 304"
              fill="none"
              stroke={friend.skin}
              strokeWidth="20"
              strokeLinecap="round"
            />
            <path d="M206 222 Q224 236 230 252" fill="none" stroke={friend.shirt} strokeWidth="18" strokeLinecap="round" />
            <circle cx="245" cy="306" r="13" fill={friend.skin} />
            <circle cx="237" cy="302" r="6" fill={friend.skin} />
          </g>
        )}

        {/* Neck */}
        <rect x="147" y="174" width="26" height="28" rx="6" fill={friend.skin} />

        {/* Head Base */}
        <circle cx="160" cy="136" r="66" fill={friend.skin} />

        {/* Ears with cute inner contour */}
        <g>
          {/* Left Ear */}
          <circle cx="94" cy="138" r="14" fill={friend.skin} />
          <circle cx="95" cy="138" r="8" fill="#B36A48" opacity="0.4" />
          {/* Right Ear */}
          <circle cx="226" cy="138" r="14" fill={friend.skin} />
          <circle cx="225" cy="138" r="8" fill="#B36A48" opacity="0.4" />
        </g>

        {/* Hair Layer */}
        {renderHair()}

        {/* Cheeks blush with soft radial gradient */}
        <ellipse cx="118" cy="158" rx="14" ry="8" fill={`url(#blush-${friend.id})`} />
        <ellipse cx="202" cy="158" rx="14" ry="8" fill={`url(#blush-${friend.id})`} />

        {/* Eyes & Eyebrows */}
        {renderEyebrows()}
        {renderEye(135, 146)}
        {renderEye(185, 146)}

        {/* Cute button nose */}
        <path
          d="M156 161 Q160 166 164 161"
          fill="none"
          stroke="#5C2E1F"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Mouth */}
        {renderMouth()}
      </svg>

      {/* Floating Name Badge */}
      {label && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginTop: 4,
            padding: "6px 16px 6px 12px",
            borderRadius: 999,
            background: "rgba(255, 255, 255, 0.96)",
            backdropFilter: "blur(8px)",
            border: `2px solid ${friend.badgeColor ?? "#FF6E7F"}33`,
            boxShadow: "0 6px 16px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.04)",
          }}
        >
          {/* Signature color indicator dot */}
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: friend.badgeColor ?? "#FF6E7F",
              boxShadow: `0 0 8px ${friend.badgeColor ?? "#FF6E7F"}88`,
            }}
          />
          <span
            style={{
              fontSize: 20,
              fontWeight: 900,
              letterSpacing: 0.8,
              color: "#1E293B",
              fontFamily: "'Avenir Next', 'Trebuchet MS', system-ui, sans-serif",
            }}
          >
            {friend.name}
          </span>
        </div>
      )}
    </div>
  );
};
