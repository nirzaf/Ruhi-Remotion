import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {DAILY_ROUTINE_SCENES} from "./explainerData";
import {DayCardsVisual} from "./ExplainerDayCards";
import {ConclusionVisual, OpeningVisual} from "./ExplainerOpenClose";
import {SceneShell} from "./ExplainerShell";

const AUDIO_FOR_SCENE: Record<string, string> = {
  opening: "audio/qatar-history/QH-L1-01-scene-01.mp3",
  morning: "audio/qatar-history/QH-L1-01-scene-03.mp3",
  daytime: "audio/qatar-history/QH-L1-01-scene-04.mp3",
  conclusion: "audio/qatar-history/QH-L1-01-scene-06.mp3",
};

export const DailyRoutineExplainer: React.FC = () => {
  const currentFrame = useCurrentFrame();
  let cursor = 0;
  return (
    <AbsoluteFill>
      {DAILY_ROUTINE_SCENES.map((scene, i) => {
        const from = cursor;
        cursor += scene.durationInFrames;
        const sceneFrame = Math.max(0, Math.min(scene.durationInFrames, currentFrame - from));
        void sceneFrame;
        return (
          <Sequence key={scene.id} from={from} durationInFrames={scene.durationInFrames} name={scene.id}>
            <SceneShell heading={scene.heading} sceneIndex={i} durationInFrames={scene.durationInFrames} keywords={scene.keywords} caption={scene.caption}>
              {scene.id === "opening" && <OpeningVisual />}
              {scene.id === "morning" && <DayCardsVisual activeIndex={0} />}
              {scene.id === "daytime" && <DayCardsVisual activeIndex={1} />}
              {scene.id === "conclusion" && <ConclusionVisual />}
            </SceneShell>
            <Audio src={staticFile(AUDIO_FOR_SCENE[scene.id])} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
