import audioDurationsJson from "../audio-durations.json";
import episodesJson from "../episodes.json";
import type {AudioDurations, Episode, Scene} from "./types";

export const FPS = 30;
export const EPISODES = episodesJson as Episode[];
export const AUDIO_DURATIONS = audioDurationsJson as AudioDurations;

export const durationForScene = (episode: Episode, scene: Scene) => {
  const recordedFrames = AUDIO_DURATIONS[episode.id]?.[scene.id]?.frames ?? 0;
  const spokenFramesWithBreathingRoom = recordedFrames + Math.round(FPS * 2.3);
  const minimumFrames = Math.round(FPS * 9.2);
  const quizThinkingTime = scene.visual === "quiz" ? Math.round(FPS * 4) : 0;

  return Math.max(minimumFrames, spokenFramesWithBreathingRoom) + quizThinkingTime;
};

export const durationForEpisode = (episode: Episode) =>
  episode.scenes.reduce((total, scene) => total + durationForScene(episode, scene), 0);

export const startFrameForScene = (episode: Episode, sceneIndex: number) =>
  episode.scenes.slice(0, sceneIndex).reduce((total, scene) => total + durationForScene(episode, scene), 0);
