import audioDurationsJson from "../audio-durations.json";
import episodesJson from "../episodes.json";
import type {AudioDurations, Episode, Scene} from "./types";

export const FPS = 30;
export const EPISODES = episodesJson as Episode[];
export const AUDIO_DURATIONS = audioDurationsJson as AudioDurations;

export const durationForScene = (episode: Episode, scene: Scene) => {
  const recordedFrames = AUDIO_DURATIONS[episode.id]?.[scene.id]?.frames ?? Math.round(FPS * 5);
  const spokenFramesWithBreathingRoom = recordedFrames + Math.round(FPS * 0.9);
  const minimumFrames = Math.round(FPS * 4.8);
  const quizThinkingTime = scene.visual === "quiz" ? Math.round(FPS * 1.8) : 0;

  return Math.max(minimumFrames, spokenFramesWithBreathingRoom) + quizThinkingTime;
};

export const durationForEpisode = (episode: Episode) =>
  episode.scenes.reduce((total, scene) => total + durationForScene(episode, scene), 0);

export const startFrameForScene = (episode: Episode, sceneIndex: number) =>
  episode.scenes.slice(0, sceneIndex).reduce((total, scene) => total + durationForScene(episode, scene), 0);
