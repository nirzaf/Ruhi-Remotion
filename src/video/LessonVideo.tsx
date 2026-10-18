import React from "react";
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame} from "remotion";
import {Illustration} from "./Illustration";
import {durationForEpisode, durationForScene, EPISODES, FPS} from "./timing";
import type {Episode, Scene} from "./types";

const palette = ["#FFF4E4", "#F3F8FF", "#F1F8EB", "#FFF2F0"];

type SceneProps = {
  episode: Episode;
  scene: Scene;
  sceneIndex: number;
  sceneDuration: number;
  episodeFrame: number;
};

const LessonScene: React.FC<SceneProps> = ({episode, scene, sceneIndex, sceneDuration, episodeFrame}) => {
  const frame = useCurrentFrame();
  const headingIn = spring({frame: Math.max(0, frame - 4), fps: FPS, config: {damping: 15, stiffness: 100}});
  const fade = sceneIndex === 0
    ? interpolate(frame, [sceneDuration - 10, sceneDuration], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})
    : interpolate(frame, [0, 12, sceneDuration - 10, sceneDuration], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const progress = episodeFrame / Math.max(1, durationForEpisode(episode));
  const bg = palette[Number(episode.number) - 1] ?? palette[0];

  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${bg} 0%, #FFFDF8 72%, #FFFFFF 100%)`, color: "#35435B", fontFamily: "'Avenir Next', 'Trebuchet MS', sans-serif", opacity: fade, overflow: "hidden"}}>
      <div style={{position: "absolute", width: 460, height: 460, borderRadius: "50%", top: -240, right: -70, background: "rgba(255,255,255,.52)"}} />
      <div style={{position: "absolute", width: 320, height: 320, borderRadius: "50%", bottom: 130, left: -170, background: "rgba(146,201,174,.12)"}} />

      <div style={{position: "absolute", left: 72, right: 72, top: 34, height: 54, display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        <div style={{display: "flex", alignItems: "center", gap: 13}}>
          <div style={{width: 43, height: 43, borderRadius: 15, background: "#F28E9D", display: "grid", placeItems: "center", color: "#FFFFFF", fontSize: 25, fontWeight: 1000, boxShadow: "0 5px 0 #D76F81"}}>R</div>
          <div style={{fontSize: 19, fontWeight: 900, letterSpacing: 1.2, color: "#627084"}}>RUHI'S GLOBAL CITIZENSHIP</div>
        </div>
        <div style={{padding: "10px 17px", borderRadius: 999, color: "#57667A", background: "rgba(255,255,255,.88)", border: "2px solid rgba(95,112,136,.12)", fontSize: 18, fontWeight: 800}}>{episode.pages}</div>
      </div>

      <div style={{position: "absolute", top: 102, left: 110, right: 110, textAlign: "center", transform: `translateY(${(1 - headingIn) * 20}px)`}}>
        <div style={{fontSize: 17, fontWeight: 900, textTransform: "uppercase", letterSpacing: 2.6, color: "#EF8C83", marginBottom: 6}}>Episode {episode.number} · {episode.title} · {episode.subtitle}</div>
        <div style={{fontSize: 45, lineHeight: 1.08, fontWeight: 1000, letterSpacing: -1.2, color: "#33425A", textShadow: "0 2px 0 rgba(255,255,255,.75)"}}>{scene.heading}</div>
      </div>

      <div style={{position: "absolute", top: 226, left: 0, right: 0, height: 562, display: "flex", alignItems: "center", justifyContent: "center"}}>
        <Illustration scene={scene} frame={frame} durationInFrames={sceneDuration} />
      </div>

      <div style={{position: "absolute", left: 240, right: 240, bottom: 65, minHeight: 125, padding: "22px 34px", borderRadius: 30, background: "rgba(255,255,255,.94)", border: "3px solid rgba(88,102,126,.12)", boxShadow: "0 15px 36px rgba(76,83,99,.09)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center"}}>
        <div style={{maxWidth: 1370, fontSize: 35, lineHeight: 1.28, fontWeight: 800, letterSpacing: -0.35, color: "#394860"}}>{scene.narration}</div>
      </div>

      {scene.visual === "quiz" && frame > sceneDuration - 110 && (
        <div style={{position: "absolute", top: 798, left: 0, right: 0, textAlign: "center", fontSize: 21, fontWeight: 900, color: "#6E7E91", letterSpacing: 1.7}}>PAUSE THE VIDEO AND THINK OF YOUR ANSWER</div>
      )}

      <div style={{position: "absolute", left: 74, right: 74, bottom: 25, height: 8, borderRadius: 99, background: "rgba(71,84,108,.13)"}}>
        <div style={{width: `${Math.max(1, progress * 100)}%`, height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#F28E9D,#F4C95D,#8FC9A8)"}} />
      </div>
      <div style={{position: "absolute", right: 78, bottom: 40, color: "#8190A2", fontSize: 16, fontWeight: 800}}>{sceneIndex + 1} / {episode.scenes.length}</div>

      <Audio src={staticFile(`audio/${episode.id}-${scene.id}.mp3`)} />
      {scene.visual === "quiz" && <Audio src={staticFile("audio/quiz-chime.wav")} volume={0.42} />}
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
            <LessonScene episode={episode} scene={scene} sceneIndex={sceneIndex} sceneDuration={sceneDuration} episodeFrame={from + Math.min(episodeFrame - from, sceneDuration)} />
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
