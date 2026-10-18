import React from "react";
import {Composition} from "remotion";
import {LessonVideo} from "./video/LessonVideo";
import {durationForEpisode, EPISODES, FPS} from "./video/timing";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="episode-1-justice" component={LessonVideo} defaultProps={{episodeId: "episode-1-justice"}} durationInFrames={durationForEpisode(EPISODES[0])} fps={FPS} width={1920} height={1080} />
      <Composition id="episode-2-wealth-poverty" component={LessonVideo} defaultProps={{episodeId: "episode-2-wealth-poverty"}} durationInFrames={durationForEpisode(EPISODES[1])} fps={FPS} width={1920} height={1080} />
      <Composition id="episode-3-opportunity" component={LessonVideo} defaultProps={{episodeId: "episode-3-opportunity"}} durationInFrames={durationForEpisode(EPISODES[2])} fps={FPS} width={1920} height={1080} />
      <Composition id="episode-4-challenging-injustice" component={LessonVideo} defaultProps={{episodeId: "episode-4-challenging-injustice"}} durationInFrames={durationForEpisode(EPISODES[3])} fps={FPS} width={1920} height={1080} />
    </>
  );
};
