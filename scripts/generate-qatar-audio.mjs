import {execFileSync} from "node:child_process";
import {existsSync, readFileSync, statSync} from "node:fs";
import {mkdir, rm, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const audioDir = path.join(root, "public/audio/qatar-history");
const captionsDir = path.join(root, "public/captions");
const outSubtitlesDir = path.join(root, "out/subtitles");
const tempDir = path.join(root, "tmp/qatar-tts");

await mkdir(audioDir, {recursive: true});
await mkdir(captionsDir, {recursive: true});
await mkdir(outSubtitlesDir, {recursive: true});
await mkdir(tempDir, {recursive: true});

const forceRegenerate = process.argv.includes("--force");
const voice = process.env.EDGE_TTS_VOICE ?? "en-US-AvaMultilingualNeural";
const rate = process.env.EDGE_TTS_RATE ?? "-10%";

function resolvePythonBin() {
  const winCandidate = "C:\\Users\\DELL\\AppData\\Local\\Python\\bin\\python.exe";
  if (existsSync(winCandidate)) {
    return winCandidate;
  }
  return "python";
}

const pythonBin = resolvePythonBin();

/**
 * Extract all episodes and scenes from content/episodes.ts
 */
function loadEpisodesFromTs() {
  const tsText = readFileSync(path.join(root, "content/episodes.ts"), "utf8");
  const arrayStart = tsText.indexOf("export const QATAR_HISTORY_EPISODES");
  const bracketStart = tsText.indexOf("[", arrayStart);
  const exportEnd = tsText.lastIndexOf("export const getQatarEpisodeDuration");
  const arrayLiteral = tsText.slice(bracketStart, exportEnd).trim().replace(/;$/, "");
  return Function(`"use strict"; return (${arrayLiteral});`)();
}

const explainerScenes = [
  {
    id: "opening",
    durationFrames: 175,
    narrationText: "Welcome to Class 1! Today we will learn about our daily routine in order.",
  },
  {
    id: "morning",
    durationFrames: 205,
    narrationText: "First, in the morning, we wake up early feeling rested, wash, and brush our teeth.",
  },
  {
    id: "daytime",
    durationFrames: 167,
    narrationText: "Next, during the daytime, we eat breakfast, get dressed, and go to school.",
  },
  {
    id: "conclusion",
    durationFrames: 150,
    narrationText: "At night we sleep on time. That is our daily routine!",
  },
];

function formatSrtTimestamp(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.round((seconds - Math.floor(seconds)) * 1000);
  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

function isSilentFallback(mp3Path) {
  if (!existsSync(mp3Path)) return true;
  const size = statSync(mp3Path).size;
  if (size < 2000 || size === 91245) return true;
  try {
    const out = execFileSync(
      "ffmpeg",
      ["-hide_banner", "-i", mp3Path, "-af", "volumedetect", "-f", "null", "-"],
      {encoding: "utf8", stdio: ["ignore", "pipe", "pipe"]}
    );
    void out;
  } catch (err) {
    const stderr = String(err.stderr ?? "");
    const match = stderr.match(/max_volume:\s*(-?\d+(?:\.\d+)?)\s*dB/);
    if (match && Number(match[1]) < -35) {
      return true;
    }
  }
  return false;
}

async function synthesizeSceneMp3(clipKey, narrationText, mp3Path) {
  const pcmPath = path.join(tempDir, `${clipKey}.pcm`);
  const rawEdgeMp3Path = path.join(tempDir, `${clipKey}-edge.mp3`);

  if (process.env.GEMINI_API_KEY) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Speak clearly, warmly, and gently at a measured Class 1 teacher pace: ${narrationText}`,
                  },
                ],
              },
            ],
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {voiceName: "Kore"},
                },
              },
            },
          }),
        }
      );

      if (res.ok) {
        const json = await res.json();
        const base64 = json.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64) {
          await writeFile(pcmPath, Buffer.from(base64, "base64"));
          execFileSync(
            "ffmpeg",
            [
              "-hide_banner",
              "-loglevel",
              "error",
              "-y",
              "-f",
              "s16le",
              "-ar",
              "24000",
              "-ac",
              "1",
              "-i",
              pcmPath,
              "-ar",
              "48000",
              "-ac",
              "1",
              "-b:a",
              "160k",
              mp3Path,
            ],
            {stdio: "inherit"}
          );
          return;
        }
      }
    } catch {
      // Fall through to Edge Neural TTS
    }
  }

  // Primary local neural TTS via edge-tts
  execFileSync(
    pythonBin,
    [
      "-m",
      "edge_tts",
      "--voice",
      voice,
      `--rate=${rate}`,
      "--text",
      narrationText,
      "--write-media",
      rawEdgeMp3Path,
    ],
    {stdio: "inherit"}
  );

  execFileSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-i",
      rawEdgeMp3Path,
      "-ar",
      "48000",
      "-ac",
      "1",
      "-b:a",
      "160k",
      mp3Path,
    ],
    {stdio: "inherit"}
  );
}

const episodes = loadEpisodesFromTs();
let generatedCount = 0;
let reusedCount = 0;

for (const episode of episodes) {
  let frameCursor = 0;
  const srtBlocks = [];

  for (let i = 0; i < episode.scenes.length; i++) {
    const scene = episode.scenes[i];
    const clipKey = `${episode.id}-${scene.id}`;
    const mp3Path = path.join(audioDir, `${clipKey}.mp3`);

    if (forceRegenerate || isSilentFallback(mp3Path)) {
      console.log(`🎙️  Generating 48kHz voice narration for ${episode.id} -> ${scene.id}...`);
      await synthesizeSceneMp3(clipKey, scene.narrationText, mp3Path);
      generatedCount++;
    } else {
      reusedCount++;
    }

    const audioSeconds = Number(
      execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp3Path], {
        encoding: "utf8",
      }).trim()
    );

    const startSec = frameCursor / 30;
    const endSec = Math.min((frameCursor + scene.durationFrames - 10) / 30, startSec + Math.max(audioSeconds + 0.8, 4.0));
    srtBlocks.push(
      `${i + 1}\n${formatSrtTimestamp(startSec)} --> ${formatSrtTimestamp(endSec)}\n${scene.narrationText}\n`
    );

    frameCursor += scene.durationFrames;
  }

  const srtContent = `${srtBlocks.join("\n")}`;
  await writeFile(path.join(captionsDir, `${episode.id}.srt`), srtContent, "utf8");
  await writeFile(path.join(outSubtitlesDir, `${episode.id}.srt`), srtContent, "utf8");
}

// Generate narration and SRT for the 30s Daily Routine Explainer cutdown
let explainerCursor = 0;
const explainerSrtBlocks = [];
for (let i = 0; i < explainerScenes.length; i++) {
  const scene = explainerScenes[i];
  const clipKey = `explainer-daily-routine-${scene.id}`;
  const mp3Path = path.join(audioDir, `${clipKey}.mp3`);

  if (forceRegenerate || isSilentFallback(mp3Path)) {
    console.log(`🎙️  Generating 48kHz voice narration for explainer-daily-routine -> ${scene.id}...`);
    await synthesizeSceneMp3(clipKey, scene.narrationText, mp3Path);
    generatedCount++;
  } else {
    reusedCount++;
  }

  const startSec = explainerCursor / 30;
  const endSec = (explainerCursor + scene.durationFrames) / 30;
  explainerSrtBlocks.push(
    `${i + 1}\n${formatSrtTimestamp(startSec)} --> ${formatSrtTimestamp(endSec)}\n${scene.narrationText}\n`
  );
  explainerCursor += scene.durationFrames;
}

const explainerSrtContent = `${explainerSrtBlocks.join("\n")}`;
await writeFile(path.join(captionsDir, "explainer-daily-routine.srt"), explainerSrtContent, "utf8");
await writeFile(path.join(outSubtitlesDir, "explainer-daily-routine.srt"), explainerSrtContent, "utf8");

await rm(tempDir, {recursive: true, force: true});

console.log(
  `✅ Voice narration ready across all ${episodes.length} Qatar History episodes + explainer (${generatedCount} generated, ${reusedCount} reused).`
);
