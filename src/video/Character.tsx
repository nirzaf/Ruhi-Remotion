import React from "react";

export type Friend = {
  name: string;
  skin: string;
  hair: string;
  shirt: string;
  pants?: string;
  expression?: "happy" | "sad" | "surprised" | "thinking";
  wheelchair?: boolean;
};

export const friends: Record<string, Friend> = {
  ruhi: {name: "Ruhi", skin: "#B96F4E", hair: "#2F2425", shirt: "#FF866D", pants: "#334D72"},
  layla: {name: "Layla", skin: "#E4B38E", hair: "#4A2E26", shirt: "#8CC7AA", pants: "#6754A4", wheelchair: true},
  sami: {name: "Sami", skin: "#C88660", hair: "#312B2A", shirt: "#68A7E8", pants: "#45647A"},
  noor: {name: "Noor", skin: "#E8BC91", hair: "#3B2926", shirt: "#F4C95D", pants: "#5B61A5"},
  adam: {name: "Adam", skin: "#A7644C", hair: "#22252D", shirt: "#B88CE6", pants: "#3D6178"},
  maya: {name: "Maya", skin: "#D99D75", hair: "#542F29", shirt: "#6CC6C1", pants: "#D78455"},
  omar: {name: "Omar", skin: "#E3B688", hair: "#322B28", shirt: "#F28DAD", pants: "#546F9A"},
};

type CharacterProps = {
  friend: Friend;
  width?: number;
  label?: boolean;
  pose?: "stand" | "wave" | "reach";
};

export const Character: React.FC<CharacterProps> = ({friend, width = 230, label = true, pose = "stand"}) => {
  const mouth = {
    happy: "M136 153 Q160 174 184 153",
    sad: "M138 166 Q160 146 182 166",
    surprised: "M151 154 Q160 171 169 154 Q160 147 151 154",
    thinking: "M145 158 Q160 166 177 156",
  }[friend.expression ?? "happy"];
  const armEnd = pose === "wave" ? "M224 238 Q260 195 247 156" : pose === "reach" ? "M224 238 Q282 250 310 220" : "M224 238 Q271 280 275 314";

  return (
    <div style={{width, position: "relative", textAlign: "center", flexShrink: 0}}>
      <svg viewBox="0 0 320 440" width="100%" height="auto" role="img" aria-label={`Cartoon ${friend.name}`}>
        <ellipse cx="160" cy="419" rx="100" ry="14" fill="#38435B" opacity="0.12" />
        {friend.wheelchair && <g fill="none" stroke="#42546B" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"><circle cx="91" cy="342" r="69" /><path d="M91 273h68l29 75h-87l-31-45h-33" /><path d="M152 272v-39h38" /></g>}
        {friend.wheelchair ? (
          <g fill={friend.pants ?? "#45647A"}>
            <path d="M115 310 Q132 331 160 344 L185 359 L173 379 L140 367 L106 346Z" />
            <path d="M163 312 L198 330 L225 345 L213 363 L185 352 L157 334Z" />
          </g>
        ) : (
          <path d="M113 315 L101 402 Q99 419 118 419 H142 L159 337 L173 419 H204 Q222 419 219 400 L202 314Z" fill={friend.pants ?? "#45647A"} />
        )}
        <path d="M114 217 Q160 192 207 217 L224 324 Q226 341 208 341 H113 Q95 341 97 323Z" fill={friend.shirt} />
        <path d={`M113 236 Q83 258 74 309 M207 237 Q239 257 245 304 ${armEnd.slice(armEnd.indexOf(" Q"))}`} fill="none" stroke={friend.skin} strokeWidth="22" strokeLinecap="round" />
        <circle cx="72" cy="310" r="14" fill={friend.skin} />
        <circle cx={pose === "wave" ? 247 : pose === "reach" ? 310 : 275} cy={pose === "wave" ? 156 : pose === "reach" ? 220 : 314} r="14" fill={friend.skin} />
        <path d="M103 118 Q101 55 160 53 Q222 55 218 122 L214 145 Q202 112 184 98 Q144 125 105 112Z" fill={friend.hair} />
        <circle cx="160" cy="126" r="67" fill={friend.skin} />
        <path d="M100 116 Q103 61 158 60 Q206 60 219 105 Q185 100 166 80 Q142 109 100 116Z" fill={friend.hair} />
        <path d="M129 132 Q137 125 145 132 M176 132 Q184 125 192 132" fill="none" stroke="#342721" strokeWidth="5" strokeLinecap="round" />
        <path d={mouth} fill={friend.expression === "surprised" ? "#743E3A" : "none"} stroke="#743E3A" strokeWidth="5" strokeLinecap="round" />
        <circle cx="116" cy="151" r="9" fill="#E7837D" opacity="0.36" />
        <circle cx="204" cy="151" r="9" fill="#E7837D" opacity="0.36" />
      </svg>
      {label && (
        <div style={{
          display: "inline-block", marginTop: -4, padding: "5px 14px", borderRadius: 999,
          background: "rgba(255,255,255,.9)", color: "#46546D", fontWeight: 800, fontSize: 19,
          boxShadow: "0 5px 12px rgba(45,53,74,.08)",
        }}>{friend.name}</div>
      )}
    </div>
  );
};
