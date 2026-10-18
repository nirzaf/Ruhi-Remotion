import React from "react";
import {Composition, Folder} from "remotion";
import {getQatarEpisodeDuration, QATAR_HISTORY_EPISODES} from "../content/episodes";
import {DailyRoutineExplainer} from "./explainer/DailyRoutineExplainer";
import {DAILY_ROUTINE_EXPLAINER_ID, DAILY_ROUTINE_TOTAL_FRAMES, EXPLAINER_FPS, EXPLAINER_HEIGHT, EXPLAINER_WIDTH} from "./explainer/explainerData";
import {LessonVideo} from "./video/LessonVideo";
import {durationForEpisode, EPISODES, FPS} from "./video/timing";
import {EpisodeVideo} from "./videos/EpisodeVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Primary Pilot & Course Catalog: Qatar History and Citizenship (Class 1) */}
      {QATAR_HISTORY_EPISODES.map((episode) => (
        <Composition
          key={episode.id}
          id={episode.id}
          component={EpisodeVideo}
          defaultProps={{episodeId: episode.id}}
          durationInFrames={getQatarEpisodeDuration(episode)}
          fps={episode.fps}
          width={episode.width}
          height={episode.height}
        />
      ))}

      {/* 30s Explainer: My Daily Routine cutdown (own editable node for Studio) */}
      <Composition
        id={DAILY_ROUTINE_EXPLAINER_ID}
        component={DailyRoutineExplainer}
        durationInFrames={DAILY_ROUTINE_TOTAL_FRAMES}
        fps={EXPLAINER_FPS}
        width={EXPLAINER_WIDTH}
        height={EXPLAINER_HEIGHT}
      />

      {/* Existing Ruhi Global Citizenship Compositions preserved for compatibility */}
      <Folder name="Global-Citizenship-Unit-1">
        <Composition
          id="episode-1-justice"
          component={LessonVideo}
          defaultProps={{episodeId: "episode-1-justice"}}
          durationInFrames={durationForEpisode(EPISODES[0])}
          fps={FPS}
          width={1920}
          height={1080}
        />
        <Composition
          id="episode-2-wealth-poverty"
          component={LessonVideo}
          defaultProps={{episodeId: "episode-2-wealth-poverty"}}
          durationInFrames={durationForEpisode(EPISODES[1])}
          fps={FPS}
          width={1920}
          height={1080}
        />
        <Composition
          id="episode-3-opportunity"
          component={LessonVideo}
          defaultProps={{episodeId: "episode-3-opportunity"}}
          durationInFrames={durationForEpisode(EPISODES[2])}
          fps={FPS}
          width={1920}
          height={1080}
        />
        <Composition
          id="episode-4-challenging-injustice"
          component={LessonVideo}
          defaultProps={{episodeId: "episode-4-challenging-injustice"}}
          durationInFrames={durationForEpisode(EPISODES[3])}
          fps={FPS}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
