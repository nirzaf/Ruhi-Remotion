import React from "react";
import {spring, useCurrentFrame, useVideoConfig} from "remotion";
import {QATAR_HISTORY_TOKENS} from "../design/tokens";
import type {Scene} from "../types";
import {Character, friends} from "../video/Character";

type IllustratedActionProps = {
  scene: Scene;
};

export const IllustratedAction: React.FC<IllustratedActionProps> = ({scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const primaryVisual = scene.visualAssetIds[0] ?? "calendar-routine-cards";

  const enter = spring({
    frame,
    fps,
    config: {damping: 16, stiffness: 90},
  });

  // ---------------------------------------------------------------------------
  // SCENE 2: Repeatable Calendar Routine Cards (Morning · School · Evening)
  // ---------------------------------------------------------------------------
  if (primaryVisual === "calendar-routine-cards") {
    const cards = [
      {
        step: "01. Morning",
        title: "Wake & Clean",
        subtitle: "Wake up, wash, and brush teeth",
        accent: QATAR_HISTORY_TOKENS.palette.maroon,
        bg: "#FFFDF9",
        icon: "sun",
      },
      {
        step: "02. Daytime",
        title: "School & Learn",
        subtitle: "Eat breakfast, dress, and learn",
        accent: QATAR_HISTORY_TOKENS.palette.teal,
        bg: "#FFFDF9",
        icon: "school",
      },
      {
        step: "03. Evening",
        title: "Rest & Bedtime",
        subtitle: "Prepare for tomorrow and sleep on time",
        accent: QATAR_HISTORY_TOKENS.palette.navy,
        bg: "#FFFDF9",
        icon: "moon",
      },
    ];

    return (
      <div
        style={{
          width: 1560,
          height: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 32,
        }}
      >
        {cards.map((card, idx) => {
          const cardPop = spring({
            frame: Math.max(0, frame - idx * 14),
            fps,
            config: {damping: 15, stiffness: 95},
          });
          return (
            <div
              key={card.step}
              style={{
                flex: 1,
                height: 440,
                borderRadius: 26,
                backgroundColor: card.bg,
                border: `3px solid ${QATAR_HISTORY_TOKENS.palette.sandBorder}`,
                boxShadow: "0 14px 32px rgba(35, 51, 72, 0.08)",
                padding: "32px 34px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transform: `translateY(${(1 - cardPop) * 28}px) scale(${0.94 + cardPop * 0.06})`,
                opacity: cardPop,
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: card.accent,
                  letterSpacing: 0.6,
                }}
              >
                {card.step}
              </div>

              {/* Vector Icon */}
              <div style={{display: "flex", justifyContent: "center", margin: "12px 0"}}>
                <svg viewBox="0 0 180 160" width="180" height="160">
                  <rect x="15" y="10" width="150" height="140" rx="24" fill={QATAR_HISTORY_TOKENS.palette.cream} />
                  {card.icon === "sun" && (
                    <g>
                      <circle cx="90" cy="80" r="36" fill="#F59E0B" />
                      <circle cx="90" cy="80" r="26" fill="#FDE047" />
                      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                        <line
                          key={deg}
                          x1="90"
                          y1="26"
                          x2="90"
                          y2="14"
                          stroke="#F59E0B"
                          strokeWidth="6"
                          strokeLinecap="round"
                          transform={`rotate(${deg} 90 80)`}
                        />
                      ))}
                    </g>
                  )}
                  {card.icon === "school" && (
                    <g>
                      <rect x="44" y="64" width="92" height="64" rx="8" fill={QATAR_HISTORY_TOKENS.palette.teal} />
                      <polygon points="36,66 90,30 144,66" fill={QATAR_HISTORY_TOKENS.palette.maroon} />
                      <rect x="78" y="92" width="24" height="36" rx="4" fill="#FFFFFF" />
                      <circle cx="90" cy="52" r="10" fill="#FFF8ED" />
                    </g>
                  )}
                  {card.icon === "moon" && (
                    <g>
                      <circle cx="90" cy="80" r="44" fill={QATAR_HISTORY_TOKENS.palette.navy} />
                      <path
                        d="M98 48 A28 28 0 1 0 118 98 A22 22 0 1 1 98 48 Z"
                        fill="#FDE047"
                      />
                      <circle cx="68" cy="64" r="3.5" fill="#FFFFFF" />
                      <circle cx="114" cy="60" r="2.5" fill="#FFFFFF" />
                    </g>
                  )}
                </svg>
              </div>

              <div>
                <div
                  style={{
                    fontSize: 38,
                    fontWeight: 900,
                    color: QATAR_HISTORY_TOKENS.palette.navy,
                    marginBottom: 8,
                  }}
                >
                  {card.title}
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 600,
                    color: QATAR_HISTORY_TOKENS.palette.navyMuted,
                    lineHeight: 1.3,
                  }}
                >
                  {card.subtitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // SCENE 3: Child Wakes Up + Bathroom Sink & Gentle Toothbrushing Action
  // ---------------------------------------------------------------------------
  if (primaryVisual === "wake-and-brush-teeth") {
    const brushMotion = Math.sin(frame / 4) * 10;
    const secondCardIn = spring({
      frame: Math.max(0, frame - 24),
      fps,
      config: {damping: 15, stiffness: 90},
    });

    return (
      <div
        style={{
          width: 1560,
          height: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 36,
        }}
      >
        {/* Left Panel: Waking Up Early in the Morning */}
        <div
          style={{
            flex: 1,
            height: 460,
            borderRadius: 28,
            backgroundColor: QATAR_HISTORY_TOKENS.palette.cream,
            border: `3px solid ${QATAR_HISTORY_TOKENS.palette.sandBorder}`,
            boxShadow: "0 14px 32px rgba(35, 51, 72, 0.08)",
            padding: "28px 36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: enter,
          }}
        >
          <div style={{maxWidth: 340}}>
            <div style={{fontSize: 22, fontWeight: 800, color: QATAR_HISTORY_TOKENS.palette.maroon, marginBottom: 8}}>
              Step 1 · Morning
            </div>
            <div style={{fontSize: 44, fontWeight: 900, color: QATAR_HISTORY_TOKENS.palette.navy, lineHeight: 1.15, marginBottom: 14}}>
              Wake Up Early
            </div>
            <div style={{fontSize: 25, fontWeight: 600, color: QATAR_HISTORY_TOKENS.palette.navyMuted, lineHeight: 1.35}}>
              Greet the morning feeling rested, energetic, and happy.
            </div>
            {/* Morning 6:30 Clock + Bed Icon */}
            <svg viewBox="0 0 280 120" width="260" height="110" style={{marginTop: 18}}>
              <rect x="8" y="42" width="145" height="60" rx="12" fill={QATAR_HISTORY_TOKENS.palette.teal} />
              <rect x="18" y="24" width="46" height="24" rx="8" fill="#FFFFFF" stroke={QATAR_HISTORY_TOKENS.palette.navy} strokeWidth="3" />
              <circle cx="215" cy="60" r="42" fill="#FFFFFF" stroke={QATAR_HISTORY_TOKENS.palette.maroon} strokeWidth="6" />
              <line x1="215" y1="60" x2="215" y2="34" stroke={QATAR_HISTORY_TOKENS.palette.navy} strokeWidth="5" strokeLinecap="round" />
              <line x1="215" y1="60" x2="236" y2="60" stroke={QATAR_HISTORY_TOKENS.palette.maroon} strokeWidth="5" strokeLinecap="round" />
            </svg>
          </div>
          <Character friend={friends.nuh} width={215} label={false} pose="wave" frame={frame} />
        </div>

        {/* Right Panel: Clean Ourselves & Brush Our Teeth */}
        <div
          style={{
            flex: 1,
            height: 460,
            borderRadius: 28,
            backgroundColor: QATAR_HISTORY_TOKENS.palette.cream,
            border: `3px solid ${QATAR_HISTORY_TOKENS.palette.sandBorder}`,
            boxShadow: "0 14px 32px rgba(35, 51, 72, 0.08)",
            padding: "28px 36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transform: `translateY(${(1 - secondCardIn) * 24}px)`,
            opacity: secondCardIn,
          }}
        >
          <div style={{maxWidth: 360}}>
            <div style={{fontSize: 22, fontWeight: 800, color: QATAR_HISTORY_TOKENS.palette.teal, marginBottom: 8}}>
              Step 2 · Hygiene
            </div>
            <div style={{fontSize: 44, fontWeight: 900, color: QATAR_HISTORY_TOKENS.palette.navy, lineHeight: 1.15, marginBottom: 14}}>
              Brush Our Teeth
            </div>
            <div style={{fontSize: 25, fontWeight: 600, color: QATAR_HISTORY_TOKENS.palette.navyMuted, lineHeight: 1.35}}>
              Wash with clean water and brush our teeth every morning.
            </div>
          </div>

          {/* Animated Sink, Water & Toothbrush */}
          <svg viewBox="0 0 320 340" width="300" height="320" role="img" aria-label="Sink and toothbrush">
            {/* Mirror */}
            <rect x="70" y="18" width="180" height="130" rx="22" fill="#E0F2FE" stroke={QATAR_HISTORY_TOKENS.palette.teal} strokeWidth="7" />
            <line x1="100" y1="115" x2="155" y2="45" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
            {/* Sink Basin & Tap */}
            <path d="M90 190 H230 L212 250 H108 Z" fill="#FFFFFF" stroke={QATAR_HISTORY_TOKENS.palette.navy} strokeWidth="6" />
            <path d="M160 190 V160 Q160 146 176 146 H188" fill="none" stroke={QATAR_HISTORY_TOKENS.palette.navy} strokeWidth="8" strokeLinecap="round" />
            {/* Flowing Water Stream */}
            <line x1="186" y1="154" x2="186" y2="186" stroke="#38BDF8" strokeWidth="6" strokeDasharray="8 6" />
            {/* Animated Toothbrush & Paste */}
            <g transform={`translate(${brushMotion}, 0)`}>
              <rect x="64" y="276" width="190" height="18" rx="9" fill={QATAR_HISTORY_TOKENS.palette.maroon} />
              <rect x="206" y="252" width="44" height="24" rx="6" fill="#FFFFFF" stroke={QATAR_HISTORY_TOKENS.palette.navy} strokeWidth="3" />
              <path d="M210 252 Q228 234 246 252" fill="#38BDF8" />
            </g>
          </svg>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // SCENE 4: Breakfast Place Setting, School Uniform/Clothes, and Backpack
  // ---------------------------------------------------------------------------
  if (primaryVisual === "breakfast-and-uniform") {
    const rightCardIn = spring({
      frame: Math.max(0, frame - 20),
      fps,
      config: {damping: 15, stiffness: 90},
    });

    return (
      <div
        style={{
          width: 1560,
          height: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 36,
        }}
      >
        {/* Breakfast Table Card */}
        <div
          style={{
            flex: 1,
            height: 460,
            borderRadius: 28,
            backgroundColor: QATAR_HISTORY_TOKENS.palette.cream,
            border: `3px solid ${QATAR_HISTORY_TOKENS.palette.sandBorder}`,
            boxShadow: "0 14px 32px rgba(35, 51, 72, 0.08)",
            padding: "32px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: enter,
          }}
        >
          <div style={{maxWidth: 350}}>
            <div style={{fontSize: 22, fontWeight: 800, color: QATAR_HISTORY_TOKENS.palette.maroon, marginBottom: 8}}>
              Step 3 · Morning Meal
            </div>
            <div style={{fontSize: 44, fontWeight: 900, color: QATAR_HISTORY_TOKENS.palette.navy, lineHeight: 1.15, marginBottom: 14}}>
              Eat Breakfast
            </div>
            <div style={{fontSize: 25, fontWeight: 600, color: QATAR_HISTORY_TOKENS.palette.navyMuted, lineHeight: 1.35}}>
              A healthy breakfast in the morning gives us energy to learn.
            </div>
          </div>

          <svg viewBox="0 0 300 300" width="280" height="280" role="img" aria-label="Healthy breakfast plate and milk cup">
            <rect x="20" y="40" width="260" height="220" rx="28" fill={QATAR_HISTORY_TOKENS.palette.sand} />
            {/* Plate */}
            <circle cx="125" cy="155" r="72" fill="#FFFFFF" stroke={QATAR_HISTORY_TOKENS.palette.navy} strokeWidth="6" />
            <circle cx="125" cy="155" r="52" fill="none" stroke={QATAR_HISTORY_TOKENS.palette.sandBorder} strokeWidth="3" />
            {/* Healthy Food Items */}
            <circle cx="110" cy="145" r="22" fill="#FDE047" />
            <circle cx="110" cy="145" r="10" fill="#F59E0B" />
            <rect x="132" y="138" width="32" height="36" rx="8" fill="#D97706" />
            {/* Milk Glass */}
            <rect x="214" y="88" width="44" height="92" rx="10" fill="#FFFFFF" stroke={QATAR_HISTORY_TOKENS.palette.teal} strokeWidth="5" />
            <rect x="220" y="106" width="32" height="68" rx="6" fill="#E0F2FE" />
          </svg>
        </div>

        {/* School Uniform & Backpack Card */}
        <div
          style={{
            flex: 1,
            height: 460,
            borderRadius: 28,
            backgroundColor: QATAR_HISTORY_TOKENS.palette.cream,
            border: `3px solid ${QATAR_HISTORY_TOKENS.palette.sandBorder}`,
            boxShadow: "0 14px 32px rgba(35, 51, 72, 0.08)",
            padding: "32px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transform: `translateY(${(1 - rightCardIn) * 24}px)`,
            opacity: rightCardIn,
          }}
        >
          <div style={{maxWidth: 350}}>
            <div style={{fontSize: 22, fontWeight: 800, color: QATAR_HISTORY_TOKENS.palette.teal, marginBottom: 8}}>
              Step 4 · Ready for School
            </div>
            <div style={{fontSize: 44, fontWeight: 900, color: QATAR_HISTORY_TOKENS.palette.navy, lineHeight: 1.15, marginBottom: 14}}>
              Get Dressed
            </div>
            <div style={{fontSize: 25, fontWeight: 600, color: QATAR_HISTORY_TOKENS.palette.navyMuted, lineHeight: 1.35}}>
              Put on our neat school uniform and pack our schoolbag.
            </div>
          </div>

          <svg viewBox="0 0 300 300" width="280" height="280" role="img" aria-label="Neat school uniform shirt and backpack">
            <rect x="20" y="40" width="260" height="220" rx="28" fill={QATAR_HISTORY_TOKENS.palette.sand} />
            {/* Neat School Shirt */}
            <path
              d="M55 95 L90 75 H140 L175 95 L160 130 L145 120 V215 H85 V120 L70 130 Z"
              fill="#FFFFFF"
              stroke={QATAR_HISTORY_TOKENS.palette.navy}
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <polygon points="115,92 107,145 115,158 123,145" fill={QATAR_HISTORY_TOKENS.palette.maroon} />
            {/* School Backpack */}
            <rect x="172" y="110" width="84" height="106" rx="22" fill={QATAR_HISTORY_TOKENS.palette.teal} stroke={QATAR_HISTORY_TOKENS.palette.navy} strokeWidth="5" />
            <rect x="186" y="154" width="56" height="44" rx="12" fill="#FFF8ED" stroke={QATAR_HISTORY_TOKENS.palette.navy} strokeWidth="4" />
            <path d="M198 110 V94 Q214 80 230 94 V110" fill="none" stroke={QATAR_HISTORY_TOKENS.palette.navy} strokeWidth="6" />
          </svg>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // SCENE 5: School Building, Classroom Board, and Attentive Student Listening
  // ---------------------------------------------------------------------------
  if (primaryVisual === "school-and-classroom") {
    return (
      <div
        style={{
          width: 1560,
          height: 500,
          borderRadius: 28,
          backgroundColor: QATAR_HISTORY_TOKENS.palette.cream,
          border: `3px solid ${QATAR_HISTORY_TOKENS.palette.sandBorder}`,
          boxShadow: "0 14px 32px rgba(35, 51, 72, 0.08)",
          padding: "36px 56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 44,
          opacity: enter,
        }}
      >
        {/* Left: School Exterior & Classroom Board */}
        <svg viewBox="0 0 680 390" width="660" height="380" role="img" aria-label="School classroom board and books">
          {/* Classroom Teaching Board */}
          <rect
            x="24"
            y="24"
            width="620"
            height="330"
            rx="24"
            fill={QATAR_HISTORY_TOKENS.palette.tealDark}
            stroke={QATAR_HISTORY_TOKENS.palette.sandBorder}
            strokeWidth="12"
          />
          <text x="64" y="102" fill="#FFF8ED" fontSize="36" fontWeight="800" fontFamily="sans-serif">
            Welcome to Class 1
          </text>
          <line x1="64" y1="126" x2="580" y2="126" stroke="#8A1538" strokeWidth="5" />
          <text x="64" y="184" fill="#FFFFFF" fontSize="30" fontWeight="700" fontFamily="sans-serif">
            1. Listen carefully to our teacher
          </text>
          <text x="64" y="236" fill="#FFFFFF" fontSize="30" fontWeight="700" fontFamily="sans-serif">
            2. Learn new things together
          </text>
          <text x="64" y="288" fill="#FDE047" fontSize="30" fontWeight="700" fontFamily="sans-serif">
            3. Follow school rules kindly
          </text>
        </svg>

        {/* Right: Attentive Students Listening */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: 28,
          }}
        >
          <Character friend={{...friends.ruhi, expression: "listening"}} width={220} label={false} pose="listen" frame={frame} />
          <Character friend={{...friends.fathima, expression: "happy"}} width={220} label={false} pose="stand" frame={frame} />
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // SCENE 6: Evening Sky, Preparing Things, and Going to Bed on Time
  // ---------------------------------------------------------------------------
  if (primaryVisual === "evening-and-bedtime") {
    const starTwinkle = 0.65 + Math.sin(frame / 10) * 0.35;

    return (
      <div
        style={{
          width: 1560,
          height: 500,
          borderRadius: 28,
          backgroundColor: QATAR_HISTORY_TOKENS.palette.navy,
          border: `3px solid ${QATAR_HISTORY_TOKENS.palette.sandBorder}`,
          boxShadow: "0 16px 36px rgba(35, 51, 72, 0.14)",
          padding: "40px 64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: QATAR_HISTORY_TOKENS.palette.white,
          opacity: enter,
        }}
      >
        <div style={{maxWidth: 640}}>
          <div style={{fontSize: 24, fontWeight: 800, color: "#FDE047", marginBottom: 12}}>
            Evening Habit · Healthy Rest
          </div>
          <div style={{fontSize: 54, fontWeight: 900, lineHeight: 1.12, marginBottom: 18}}>
            Going to Bed on Time
          </div>
          <div style={{fontSize: 30, fontWeight: 600, color: QATAR_HISTORY_TOKENS.palette.sand, lineHeight: 1.4}}>
            At the end of the day, we put away our things and sleep on time so we wake up rested and ready.
          </div>
        </div>

        {/* Nighttime Bedroom Window, Crescent Moon & Cozy Bed Illustration */}
        <svg viewBox="0 0 640 380" width="620" height="368" role="img" aria-label="Nighttime bedroom window with moon and cozy bed">
          {/* Bedroom Wall Card */}
          <rect x="20" y="16" width="600" height="348" rx="26" fill="#1B2838" stroke="#334B68" strokeWidth="5" />
          {/* Window with Crescent Moon & Stars */}
          <rect x="70" y="48" width="200" height="160" rx="18" fill="#0F172A" stroke="#F1DFC7" strokeWidth="6" />
          <path d="M168 86 A34 34 0 1 0 194 146 A26 26 0 1 1 168 86 Z" fill="#FDE047" />
          <circle cx="114" cy="92" r="4" fill="#FFFFFF" opacity={starTwinkle} />
          <circle cx="222" cy="88" r="5" fill="#FFFFFF" opacity={starTwinkle} />
          <circle cx="126" cy="158" r="3.5" fill="#FFFFFF" opacity={starTwinkle} />

          {/* Night Clock (8:00 PM) */}
          <circle cx="510" cy="108" r="44" fill="#FFF8ED" stroke={QATAR_HISTORY_TOKENS.palette.maroon} strokeWidth="6" />
          <line x1="510" y1="108" x2="510" y2="78" stroke={QATAR_HISTORY_TOKENS.palette.navy} strokeWidth="5" strokeLinecap="round" />
          <line x1="510" y1="108" x2="486" y2="122" stroke={QATAR_HISTORY_TOKENS.palette.maroon} strokeWidth="5" strokeLinecap="round" />

          {/* Cozy Bed */}
          <rect x="280" y="240" width="280" height="84" rx="16" fill={QATAR_HISTORY_TOKENS.palette.teal} />
          <rect x="296" y="210" width="84" height="36" rx="12" fill="#FFF8ED" />
          <rect x="272" y="186" width="22" height="148" rx="8" fill="#DEC4A2" />
          <rect x="552" y="226" width="22" height="108" rx="8" fill="#DEC4A2" />
        </svg>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // SCENE 7: Six-Step Daily Routine Strip with Sequential Arrows
  // ---------------------------------------------------------------------------
  if (primaryVisual === "six-step-routine-sequence") {
    const steps = [
      {num: "1", label: "Wake Up", time: "Morning", color: QATAR_HISTORY_TOKENS.palette.maroon},
      {num: "2", label: "Brush Teeth", time: "Clean", color: QATAR_HISTORY_TOKENS.palette.teal},
      {num: "3", label: "Breakfast", time: "Healthy Meal", color: QATAR_HISTORY_TOKENS.palette.maroon},
      {num: "4", label: "Get Dressed", time: "Uniform", color: QATAR_HISTORY_TOKENS.palette.teal},
      {num: "5", label: "Go to School", time: "Learn", color: QATAR_HISTORY_TOKENS.palette.maroon},
      {num: "6", label: "Bedtime", time: "Night Rest", color: QATAR_HISTORY_TOKENS.palette.navy},
    ];

    return (
      <div
        style={{
          width: 1560,
          height: 500,
          borderRadius: 28,
          backgroundColor: QATAR_HISTORY_TOKENS.palette.cream,
          border: `3px solid ${QATAR_HISTORY_TOKENS.palette.sandBorder}`,
          boxShadow: "0 14px 32px rgba(35, 51, 72, 0.08)",
          padding: "36px 40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 32,
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontSize: 30,
            fontWeight: 800,
            color: QATAR_HISTORY_TOKENS.palette.navyMuted,
          }}
        >
          Daily Routine Sequence · First → Next → Later
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          {steps.map((step, index) => {
            const stepReveal = spring({
              frame: Math.max(0, frame - index * 18),
              fps,
              config: {damping: 15, stiffness: 100},
            });

            return (
              <React.Fragment key={step.num}>
                <div
                  style={{
                    flex: 1,
                    height: 270,
                    borderRadius: 22,
                    backgroundColor: "#FFFFFF",
                    border: `3px solid ${step.color}`,
                    boxShadow: "0 10px 24px rgba(35, 51, 72, 0.07)",
                    padding: "22px 16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    textAlign: "center",
                    transform: `translateY(${(1 - stepReveal) * 24}px) scale(${0.92 + stepReveal * 0.08})`,
                    opacity: stepReveal,
                  }}
                >
                  <div
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: "50%",
                      backgroundColor: step.color,
                      color: "#FFFFFF",
                      fontSize: 28,
                      fontWeight: 900,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    {step.num}
                  </div>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 900,
                      color: QATAR_HISTORY_TOKENS.palette.navy,
                      lineHeight: 1.15,
                    }}
                  >
                    {step.label}
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: QATAR_HISTORY_TOKENS.palette.navyMuted,
                    }}
                  >
                    {step.time}
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div
                    aria-hidden="true"
                    style={{
                      fontSize: 36,
                      fontWeight: 900,
                      color: QATAR_HISTORY_TOKENS.palette.maroon,
                      opacity: stepReveal,
                    }}
                  >
                    →
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};
