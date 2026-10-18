import {execFileSync} from "node:child_process";
import {createHash} from "node:crypto";
import {existsSync, statSync} from "node:fs";
import {mkdir, readFile, rm, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const episodes = JSON.parse(await readFile(path.join(root, "src/episodes.json"), "utf8"));
const outputDir = path.join(root, "public/audio");
const tempDir = path.join(root, "tmp/narration");
const durationsFilePath = path.join(root, "src/audio-durations.json");

const sampleRate = 44100;
const voice = process.env.NARRATION_VOICE ?? "Samantha";
const voiceRate = process.env.NARRATION_RATE ?? "145";
const mp3Bitrate = process.env.NARRATION_BITRATE ?? "160k";

await mkdir(outputDir, {recursive: true});
await mkdir(tempDir, {recursive: true});

let existingDurations = {};
if (existsSync(durationsFilePath)) {
  try {
    existingDurations = JSON.parse(await readFile(durationsFilePath, "utf8"));
  } catch {
    existingDurations = {};
  }
}

const audioDurations = {};
let generatedCount = 0;
let reusedCount = 0;

for (const episode of episodes) {
  audioDurations[episode.id] = {};
  for (const scene of episode.scenes) {
    const baseName = `${episode.id}-${scene.id}`;
    const aiffPath = path.join(tempDir, `${baseName}.aiff`);
    const mp3Path = path.join(outputDir, `${baseName}.mp3`);

    const hash = createHash("sha256")
      .update(`${scene.narration}::${voice}::${voiceRate}`)
      .digest("hex")
      .slice(0, 16);

    const existingEntry = existingDurations[episode.id]?.[scene.id];
    const fileValid = existsSync(mp3Path) && statSync(mp3Path).size > 1000;

    if (fileValid && existingEntry?.hash === hash && existingEntry?.frames > 0) {
      audioDurations[episode.id][scene.id] = existingEntry;
      reusedCount++;
      continue;
    }

    console.log(`🎙️  Generating narration for ${episode.id} -> ${scene.id}...`);
    execFileSync("say", ["-v", voice, "-r", voiceRate, "-o", aiffPath, scene.narration], {stdio: "inherit"});
    execFileSync(
      "ffmpeg",
      ["-hide_banner", "-loglevel", "error", "-y", "-i", aiffPath, "-ar", String(sampleRate), "-ac", "1", "-b:a", mp3Bitrate, mp3Path],
      {stdio: "inherit"}
    );
    const seconds = Number(
      execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp3Path], {encoding: "utf8"}).trim()
    );
    audioDurations[episode.id][scene.id] = {
      seconds: Number(seconds.toFixed(2)),
      frames: Math.ceil(seconds * 30),
      hash,
    };
    generatedCount++;
  }
}

// Ensure quiz chime exists
const chimePath = path.join(outputDir, "quiz-chime.wav");
if (!existsSync(chimePath) || statSync(chimePath).size < 1000) {
  const notes = [
    {frequency: 783.99, start: 0, duration: 0.42},
    {frequency: 987.77, start: 0.16, duration: 0.5},
    {frequency: 1174.66, start: 0.38, duration: 0.64},
  ];
  const totalSamples = Math.ceil(sampleRate * 1.25);
  const data = Buffer.alloc(totalSamples * 2);

  for (let index = 0; index < totalSamples; index += 1) {
    const time = index / sampleRate;
    let value = 0;
    for (const note of notes) {
      const elapsed = time - note.start;
      if (elapsed >= 0 && elapsed <= note.duration) {
        const attack = Math.min(1, elapsed / 0.025);
        const release = Math.min(1, (note.duration - elapsed) / 0.12);
        const envelope = Math.max(0, Math.min(attack, release)) * Math.exp(-elapsed * 1.9);
        value += Math.sin(2 * Math.PI * note.frequency * elapsed) * envelope * 0.19;
      }
    }
    data.writeInt16LE(Math.max(-1, Math.min(1, value)) * 32767, index * 2);
  }

  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(data.length, 40);
  await writeFile(chimePath, Buffer.concat([header, data]));
}

await writeFile(durationsFilePath, `${JSON.stringify(audioDurations, null, 2)}\n`);
await rm(tempDir, {recursive: true, force: true});

console.log(
  `✅ Narration audio ready: ${generatedCount} generated, ${reusedCount} reused. Total scenes: ${
    generatedCount + reusedCount
  }.`
);
