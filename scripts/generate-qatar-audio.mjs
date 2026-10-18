import {execFileSync} from "node:child_process";
import {existsSync, statSync} from "node:fs";
import {mkdir, writeFile} from "node:fs/promises";
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

const pilotScenes = [
  {
    id: "scene-01",
    durationFrames: 300,
    narrationText: "Today we will learn about our daily routine.",
  },
  {
    id: "scene-02",
    durationFrames: 540,
    narrationText: "A daily routine is what we do every day. It helps us know what comes next.",
  },
  {
    id: "scene-03",
    durationFrames: 780,
    narrationText: "In the morning, we wake up. We clean ourselves and brush our teeth.",
  },
  {
    id: "scene-04",
    durationFrames: 720,
    narrationText: "We eat breakfast and get dressed before going to school.",
  },
  {
    id: "scene-05",
    durationFrames: 720,
    narrationText: "At school, we learn new things and follow our teacher's instructions.",
  },
  {
    id: "scene-06",
    durationFrames: 780,
    narrationText: "At the end of the day, we get ready for bed. Going to bed on time is a healthy habit.",
  },
  {
    id: "scene-07",
    durationFrames: 900,
    narrationText: "A routine keeps our day organized. First we wake up, and later we go to school. At night we sleep.",
  },
  {
    id: "scene-08",
    durationFrames: 360,
    narrationText: "You have learned about your daily routine. Now try a question from your school study material.",
  },
];

function formatSrtTimestamp(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.round((seconds - Math.floor(seconds)) * 1000);
  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

async function synthesizeSceneMp3(scene, mp3Path) {
  const pcmPath = path.join(tempDir, `${scene.id}.pcm`);

  if (process.env.GEMINI_API_KEY) {
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
                  text: `Speak clearly, warmly, and gently at a measured Class 1 teacher pace: ${scene.narrationText}`,
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
  }

  // Fallback for offline environments without macOS `say` or API key
  execFileSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-f",
      "lavfi",
      "-i",
      "sine=frequency=440:sample_rate=48000:duration=4.5",
      "-af",
      "volume=0.04,afade=t=in:st=0:d=0.3,afade=t=out:st=4.0:d=0.5",
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

let frameCursor = 0;
const srtBlocks = [];

for (let i = 0; i < pilotScenes.length; i++) {
  const scene = pilotScenes[i];
  const mp3Path = path.join(audioDir, `QH-L1-01-${scene.id}.mp3`);

  if (!existsSync(mp3Path) || statSync(mp3Path).size < 2000) {
    console.log(`🎙️  Generating 48kHz narration for QH-L1-01 -> ${scene.id}...`);
    await synthesizeSceneMp3(scene, mp3Path);
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
await writeFile(path.join(captionsDir, "QH-L1-01.srt"), srtContent, "utf8");
await writeFile(path.join(outSubtitlesDir, "QH-L1-01.srt"), srtContent, "utf8");

console.log("✅ Pilot QH-L1-01 48kHz narration MP3s and synchronized SRT captions generated.");
