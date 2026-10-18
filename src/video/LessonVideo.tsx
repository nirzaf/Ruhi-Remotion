import React from "react";
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame} from "remotion";
import {Illustration} from "./Illustration";
import {AUDIO_DURATIONS, durationForEpisode, durationForScene, EPISODES, FPS} from "./timing";
import type {Episode, Scene} from "./types";

const episodeBackgrounds = [
  "linear-gradient(180deg, #F0F9FF 0%, #FFFDF7 70%, #FFFFFF 100%)", // Ep 1: Playground Sky
  "linear-gradient(180deg, #FEF3C7 0%, #FFFDF7 70%, #FFFFFF 100%)", // Ep 2: Market Amber
  "linear-gradient(180deg, #ECFDF5 0%, #FFFDF7 70%, #FFFFFF 100%)", // Ep 3: Garden Mint
  "linear-gradient(180deg, #FFF1F2 0%, #FFFDF7 70%, #FFFFFF 100%)", // Ep 4: Art Room Rose
];

const episodeThemes = [
  {accent: "#FF6E7F", badge: "FAIRNESS AT THE PLAYGROUND"},
  {accent: "#F59E0B", badge: "MORE THAN MONEY"},
  {accent: "#10B981", badge: "EVERYONE GETS A CHANCE"},
  {accent: "#3B82F6", badge: "MAKE THINGS RIGHT"},
];

type SceneProps = {
  episode: Episode;
  scene: Scene;
  sceneIndex: number;
  sceneDuration: number;
  episodeFrame: number;
};

// Clean, accessible, high-contrast phrase caption for early readers
const EarlyReaderCaption: React.FC<{
  text: string;
  frame: number;
  audioFrames: number;
  accentColor: string;
}> = ({text, frame, audioFrames, accentColor}) => {
  const isSpeaking = frame <= audioFrames + 10;
  return (
    <div
      style={{
        maxWidth: 1380,
        textAlign: "center",
        fontSize: 34,
        lineHeight: 1.35,
        fontWeight: 800,
        color: "#0F172A",
        letterSpacing: 0.2,
      }}
    >
      <span
        style={{
          borderBottom: `3.5px solid ${accentColor}`,
          padding: "4px 18px",
          borderRadius: 14,
          background: isSpeaking ? `${accentColor}18` : "transparent",
          display: "inline-block",
        }}
      >
        {text}
      </span>
    </div>
  );
};

const LessonScene: React.FC<SceneProps> = ({episode, scene, sceneIndex, sceneDuration, episodeFrame}) => {
  const frame = useCurrentFrame();
  const epIndex = Number(episode.number) - 1;
  const theme = episodeThemes[epIndex] ?? episodeThemes[0];
  const bg = episodeBackgrounds[epIndex] ?? episodeBackgrounds[0];

  // Smooth entrance & exit animations
  const headingIn = spring({frame: Math.max(0, frame - 3), fps: FPS, config: {damping: 14, stiffness: 95}});
  const captionIn = spring({frame: Math.max(0, frame - 6), fps: FPS, config: {damping: 14, stiffness: 90}});

  const fade =
    sceneIndex === 0
      ? interpolate(frame, [sceneDuration - 10, sceneDuration], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : interpolate(frame, [0, 10, sceneDuration - 10, sceneDuration], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  const progress = episodeFrame / Math.max(1, durationForEpisode(episode));
  const audioFrames = AUDIO_DURATIONS[episode.id]?.[scene.id]?.frames ?? Math.round(FPS * 6);

  return (
    <AbsoluteFill
      style={{
        background: bg,
        color: "#1E293B",
        fontFamily: "'Avenir Next', 'Nunito', 'Trebuchet MS', system-ui, sans-serif",
        opacity: fade,
        overflow: "hidden",
      }}
    >
      {/* Decorative ambient background glows */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          top: -220,
          right: -80,
          background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 380,
          height: 380,
          borderRadius: "50%",
          bottom: 120,
          left: -140,
          background: `radial-gradient(circle, ${theme.accent}15 0%, rgba(255,255,255,0) 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* ========================================================================= */}
      {/* Top Navigation Bar: Branding & Workbook Page                               */}
      {/* ========================================================================= */}
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 28,
          height: 58,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 20,
        }}
      >
        {/* Left Branding */}
        <div style={{display: "flex", alignItems: "center", gap: 14}}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background: "linear-gradient(135deg, #FF6E7F 0%, #F43F5E 100%)",
              display: "grid",
              placeItems: "center",
              color: "#FFFFFF",
              fontSize: 26,
              fontWeight: 900,
              boxShadow: "0 6px 14px rgba(244, 63, 94, 0.3)",
            }}
          >
            R
          </div>
          <div>
            <div
              style={{
                fontSize: 19,
                fontWeight: 900,
                letterSpacing: 1.2,
                color: "#1E293B",
                lineHeight: 1.1,
              }}
            >
              RUHI'S GLOBAL CITIZENSHIP
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 1.5,
                color: theme.accent,
                textTransform: "uppercase",
              }}
            >
              Grade 1 · Social Justice Lessons
            </div>
          </div>
        </div>

        {/* Right Workbook Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 18px",
            borderRadius: 999,
            color: "#334155",
            background: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(8px)",
            border: "2px solid rgba(148, 163, 184, 0.2)",
            boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)",
            fontSize: 17,
            fontWeight: 800,
          }}
        >
          <span>📖</span>
          <span>{episode.pages}</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Scene Header & Episode Info                                               */}
      {/* ========================================================================= */}
      <div
        style={{
          position: "absolute",
          top: 98,
          left: 90,
          right: 90,
          textAlign: "center",
          transform: `translateY(${(1 - headingIn) * 20}px)`,
          zIndex: 20,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 16px",
            borderRadius: 999,
            background: `${theme.accent}18`,
            border: `1.5px solid ${theme.accent}33`,
            fontSize: 15,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: 2,
            color: theme.accent,
            marginBottom: 8,
          }}
        >
          <span>EPISODE {episode.number}</span>
          <span>·</span>
          <span>{episode.title}</span>
          <span>·</span>
          <span>{theme.badge}</span>
        </div>

        <div
          style={{
            fontSize: 46,
            lineHeight: 1.1,
            fontWeight: 900,
            letterSpacing: -1,
            color: "#0F172A",
            textShadow: "0 2px 4px rgba(255,255,255,0.8)",
          }}
        >
          {scene.heading}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Central Illustration Area                                                 */}
      {/* ========================================================================= */}
      <div
        style={{
          position: "absolute",
          top: 215,
          left: 0,
          right: 0,
          height: 565,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Illustration scene={scene} frame={frame} durationInFrames={sceneDuration} />
      </div>

      {/* ========================================================================= */}
      {/* Dynamic Karaoke Narration Card for Early Readers                         */}
      {/* ========================================================================= */}
      <div
        style={{
          position: "absolute",
          left: 180,
          right: 180,
          bottom: 60,
          minHeight: 120,
          padding: "20px 36px",
          borderRadius: 28,
          background: "rgba(255, 255, 255, 0.96)",
          backdropFilter: "blur(12px)",
          border: `3px solid ${theme.accent}2A`,
          boxShadow: "0 16px 36px rgba(15, 23, 42, 0.1), 0 4px 10px rgba(15, 23, 42, 0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          transform: `translateY(${(1 - captionIn) * 16}px)`,
          zIndex: 25,
        }}
      >
        <EarlyReaderCaption
          text={scene.narration}
          frame={frame}
          audioFrames={audioFrames}
          accentColor={theme.accent}
        />
      </div>

      {/* ========================================================================= */}
      {/* Bottom Progress Bar & Scene Counter                                       */}
      {/* ========================================================================= */}
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          bottom: 22,
          height: 8,
          borderRadius: 99,
          background: "rgba(148, 163, 184, 0.2)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.max(1, progress * 100)}%`,
            height: "100%",
            borderRadius: 99,
            background: `linear-gradient(90deg, #FF6E7F 0%, #FBBF24 50%, #34D399 100%)`,
          }}
        />
      </div>

      {/* Scene number pill */}
      <div
        style={{
          position: "absolute",
          right: 68,
          bottom: 34,
          color: "#64748B",
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: 0.5,
        }}
      >
        Scene {sceneIndex + 1} of {episode.scenes.length}
      </div>

      {/* Narration Spoken Audio */}
      <Audio src={staticFile(`audio/${episode.id}-${scene.id}.mp3`)} />

      {/* Quiz Chime Audio for interactive moments */}
      {scene.visual === "quiz" && <Audio src={staticFile("audio/quiz-chime.wav")} volume={0.4} />}
    </AbsoluteFill>
  );
};

export const LessonVideo: React.FC<{episodeId: string}> = ({episodeId}) => {
  const episodeFrame = useCurrentFrame();
  const episode = EPISODES.find((item) => item.id === episodeId);
  if (!episode) return null;

  let cursor = 0;
  return (
    <AbsoluteFill>
      {episode.scenes.map((scene, sceneIndex) => {
        const from = cursor;
        const sceneDuration = durationForScene(episode, scene);
        cursor += sceneDuration;
        return (
          <Sequence key={scene.id} from={from} durationInFrames={sceneDuration}>
            <LessonScene
              episode={episode}
              scene={scene}
              sceneIndex={sceneIndex}
              sceneDuration={sceneDuration}
              episodeFrame={from + Math.min(episodeFrame - from, sceneDuration)}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const getLessonDuration = (episodeId: string) => {
  const episode = EPISODES.find((item) => item.id === episodeId);
  if (!episode) return FPS * 60;
  return durationForEpisode(episode);
};
