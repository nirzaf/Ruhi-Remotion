import {execFileSync, spawnSync} from "node:child_process";
import {readFileSync} from "node:fs";
import {copyFile, mkdir, rm, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const remotionCli = path.join(root, "node_modules", "@remotion", "cli", "remotion-cli.js");
const videosDir = path.join(root, "out/videos");
const thumbnailsDir = path.join(root, "out/thumbnails");
const subtitlesDir = path.join(root, "out/subtitles");
const tempRenderDir = path.join(root, "tmp/pilot-render");

await mkdir(videosDir, {recursive: true});
await mkdir(thumbnailsDir, {recursive: true});
await mkdir(subtitlesDir, {recursive: true});
await mkdir(tempRenderDir, {recursive: true});

const approvedEpisodeId = "QH-L1-01";
const videoOut = path.join(videosDir, `${approvedEpisodeId}.mp4`);
const thumbOut = path.join(thumbnailsDir, `${approvedEpisodeId}.png`);
const srtSrc = path.join(root, `public/captions/${approvedEpisodeId}.srt`);
const srtOut = path.join(subtitlesDir, `${approvedEpisodeId}.srt`);

function loadPilotEpisode() {
  const tsText = readFileSync(path.join(root, "content/episodes.ts"), "utf8");
  const arrayStart = tsText.indexOf("export const QATAR_HISTORY_EPISODES");
  const bracketStart = tsText.indexOf("[", arrayStart);
  const exportEnd = tsText.lastIndexOf("export const getQatarEpisodeDuration");
  const arrayLiteral = tsText.slice(bracketStart, exportEnd).trim().replace(/;$/, "");
  const episodes = Function(`"use strict"; return (${arrayLiteral});`)();
  return episodes.find((ep) => ep.id === approvedEpisodeId);
}

function splitIntoCaptionSegments(text) {
  const rawSentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (rawSentences.length <= 1) {
    return [text];
  }
  const merged = [];
  for (const sentence of rawSentences) {
    if (merged.length > 0 && merged[merged.length - 1].length + 1 + sentence.length <= 115) {
      merged[merged.length - 1] = `${merged[merged.length - 1]} ${sentence}`;
    } else {
      merged.push(sentence);
    }
  }
  return merged;
}

if (process.argv.includes("--full-remotion")) {
  console.log(`🎬 Rendering ${approvedEpisodeId} via full frame-by-frame Remotion CLI...`);
  const renderRes = spawnSync(
    process.execPath,
    [remotionCli, "render", "src/index.ts", approvedEpisodeId, videoOut, "--codec", "h264", "--overwrite"],
    {cwd: root, stdio: "inherit"}
  );
  if (renderRes.status !== 0) {
    process.exit(renderRes.status ?? 1);
  }
} else {
  console.log(`🎬 Rendering ${approvedEpisodeId} (1920x1080 @ 30fps, H.264/AAC, 170s / 5100 frames)...`);
  const pilotEpisode = loadPilotEpisode();
  const segmentPaths = [];
  let sceneStartFrame = 0;
  let firstStillPng = "";

  for (const scene of pilotEpisode.scenes) {
    const segmentMp4 = path.join(tempRenderDir, `${scene.id}.mp4`);
    const audioMp3 = path.join(root, `public/audio/qatar-history/${approvedEpisodeId}-${scene.id}.mp3`);
    const durationSec = scene.durationFrames / 30;
    const fadeOutStart = Math.max(0.5, durationSec - 0.4);

    const captionSegments = splitIntoCaptionSegments(scene.narrationText);
    const totalChars = Math.max(1, captionSegments.reduce((sum, s) => sum + s.length, 0));
    const speechWindowFrames = Math.max(1, scene.durationFrames * 0.92);

    const ffmpegInputs = [];
    const concatStreams = [];
    let cumChars = 0;
    let prevEndFrame = 0;

    for (let j = 0; j < captionSegments.length; j++) {
      cumChars += captionSegments[j].length;
      const isLast = j === captionSegments.length - 1;
      const endFrame = isLast
        ? scene.durationFrames
        : Math.max(prevEndFrame + 15, Math.round((cumChars / totalChars) * speechWindowFrames));
      const segFrames = Math.max(1, endFrame - prevEndFrame);
      const localMidFrame = Math.max(55, Math.floor((prevEndFrame + endFrame) / 2));
      const episodeFrame = sceneStartFrame + Math.min(scene.durationFrames - 10, localMidFrame);
      const stillPng = path.join(tempRenderDir, `${scene.id}-seg-${j + 1}.png`);

      if (!firstStillPng) {
        firstStillPng = stillPng;
      }

      execFileSync(
        process.execPath,
        [
          remotionCli,
          "still",
          "src/index.ts",
          approvedEpisodeId,
          stillPng,
          `--frame=${episodeFrame}`,
          "--image-format=png",
          "--overwrite",
          "--log=error",
        ],
        {cwd: root, stdio: "inherit"}
      );

      ffmpegInputs.push("-loop", "1", "-framerate", "30", "-t", String(segFrames / 30), "-i", stillPng);
      concatStreams.push(`[${j}:v]`);
      prevEndFrame = endFrame;
    }

    const audioInputIdx = captionSegments.length;
    const filterComplex = `${concatStreams.join("")}concat=n=${captionSegments.length}:v=1:a=0,scale=1920:1080,format=yuv420p,fade=t=in:st=0:d=0.35,fade=t=out:st=${fadeOutStart}:d=0.35[v];[${audioInputIdx}:a]aresample=48000,apad=whole_dur=${durationSec}[a]`;

    execFileSync(
      "ffmpeg",
      [
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        ...ffmpegInputs,
        "-i",
        audioMp3,
        "-filter_complex",
        filterComplex,
        "-map",
        "[v]",
        "-map",
        "[a]",
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-r",
        "30",
        "-c:a",
        "aac",
        "-b:a",
        "160k",
        "-ar",
        "48000",
        "-ac",
        "1",
        "-shortest",
        segmentMp4,
      ],
      {cwd: root, stdio: "inherit"}
    );

    segmentPaths.push(segmentMp4);
    sceneStartFrame += scene.durationFrames;
  }

  const concatListPath = path.join(tempRenderDir, "concat.txt");
  await writeFile(
    concatListPath,
    segmentPaths.map((p) => `file '${p}'`).join("\n") + "\n",
    "utf8"
  );

  execFileSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      concatListPath,
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-pix_fmt",
      "yuv420p",
      "-r",
      "30",
      "-c:a",
      "aac",
      "-b:a",
      "160k",
      "-ar",
      "48000",
      "-movflags",
      "+faststart",
      videoOut,
    ],
    {cwd: root, stdio: "inherit"}
  );

  execFileSync(
    "ffmpeg",
    ["-hide_banner", "-loglevel", "error", "-y", "-i", firstStillPng, "-vf", "scale=1280:720", thumbOut],
    {cwd: root, stdio: "inherit"}
  );
}

await copyFile(srtSrc, srtOut);

const manifest = {
  generatedAt: new Date().toISOString(),
  approvedRenderedEpisodes: [
    {
      episodeId: approvedEpisodeId,
      title: "My Daily Routine",
      wave: "P0",
      video: "out/videos/QH-L1-01.mp4",
      subtitle: "out/subtitles/QH-L1-01.srt",
      thumbnail: "out/thumbnails/QH-L1-01.png",
      dimensions: "1920x1080",
      thumbnailDimensions: "1280x720",
      fps: 30,
      durationSeconds: 170,
      durationFrames: 5100,
    },
  ],
  heldDraftEpisodesPendingParentReview: [
    "QH-L1-02",
    "QH-L1-03",
    "QH-L1-04",
    "QH-L2-01",
    "QH-L2-02",
    "QH-L2-03",
    "QH-L3-01",
    "QH-L3-02",
    "QH-QUIZ-01",
    "QH-QUIZ-02",
    "QH-QUIZ-03",
    "QH-QUIZ-04",
    "QH-QUIZ-05",
  ],
};

await writeFile(path.join(root, "out/manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
await rm(tempRenderDir, {recursive: true, force: true});

console.log(`✅ Pilot deliverables complete:`);
console.log(`   - Video:     out/videos/QH-L1-01.mp4`);
console.log(`   - Subtitles: out/subtitles/QH-L1-01.srt`);
console.log(`   - Thumbnail: out/thumbnails/QH-L1-01.png`);
