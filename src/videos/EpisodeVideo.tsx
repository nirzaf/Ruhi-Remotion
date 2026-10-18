import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {getQatarEpisodeDuration, QATAR_HISTORY_EPISODES} from "../../content/episodes";
import {EndCard} from "../components/EndCard";
import {IllustratedAction} from "../components/IllustratedAction";
import {SceneLayout} from "../components/SceneLayout";
import {TitleScene} from "../components/TitleScene";

export type EpisodeVideoProps = {
  episodeId: string;
};

export const EpisodeVideo: React.FC<EpisodeVideoProps> = ({episodeId}) => {
  const currentFrame = useCurrentFrame();
  const episode = QATAR_HISTORY_EPISODES.find((ep) => ep.id === episodeId) ?? QATAR_HISTORY_EPISODES[0];
  const totalFrames = getQatarEpisodeDuration(episode);

  let frameCursor = 0;

  return (
    <AbsoluteFill>
      {episode.scenes.map((scene, sceneIndex) => {
        const from = frameCursor;
        const durationInFrames = scene.durationFrames;
        frameCursor += durationInFrames;

        const sceneProgressFrame = Math.max(0, Math.min(durationInFrames, currentFrame - from));
        const episodeProgress = (from + sceneProgressFrame) / Math.max(1, totalFrames);

        return (
          <Sequence key={scene.id} from={from} durationInFrames={durationInFrames}>
            <SceneLayout
              episode={episode}
              scene={scene}
              sceneIndex={sceneIndex}
              totalScenes={episode.scenes.length}
              episodeProgress={episodeProgress}
            >
              {scene.kind === "title" ? (
                <TitleScene episode={episode} scene={scene} />
              ) : scene.kind === "handoff" ? (
                <EndCard episode={episode} />
              ) : (
                <IllustratedAction scene={scene} />
              )}
            </SceneLayout>

            {/* Play local narration audio for all episode scenes */}
            {scene.narrationAsset && (
              <Audio src={staticFile(scene.narrationAsset)} />
            )}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
