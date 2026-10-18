import {execFileSync} from "node:child_process";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const scenes = [
  {id: "opening", frames: 175, mp3: "public/audio/qatar-history/QH-L1-01-scene-01.mp3"},
  {id: "morning", frames: 205, mp3: "public/audio/qatar-history/QH-L1-01-scene-03.mp3"},
  {id: "daytime", frames: 167, mp3: "public/audio/qatar-history/QH-L1-01-scene-04.mp3"},
  {id: "conclusion", frames: 150, mp3: "public/audio/qatar-history/QH-L1-01-scene-06.mp3"},
];

const FPS = 30;
let allFit = true;

for (const scene of scenes) {
  const dur = Number(
    execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path.join(root, scene.mp3)], {
      encoding: "utf8",
    }).trim(),
  );
  const sceneSec = scene.frames / FPS;
  const fit = dur <= sceneSec;
  if (!fit) allFit = false;
  console.log(`${scene.id}: scene=${sceneSec.toFixed(2)}s audio=${dur.toFixed(2)}s ${fit ? "OK" : "TRIM NEEDED"}`);
}

const totalFrames = scenes.reduce((s, x) => s + x.frames, 0);
console.log(`total=${totalFrames} frames = ${(totalFrames / FPS).toFixed(2)}s (speedup ${(900 / totalFrames).toFixed(2)}x)`);

if (!allFit) process.exit(1);
