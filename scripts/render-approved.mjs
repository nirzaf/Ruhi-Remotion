import {execFileSync, spawnSync} from "node:child_process";
import {copyFile, mkdir, rm, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
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

const pilotScenes = [
  {id: "scene-01", durationFrames: 300, sampleFrame: 45},
  {id: "scene-02", durationFrames: 540, sampleFrame: 450},
  {id: "scene-03", durationFrames: 780, sampleFrame: 1050},
  {id: "scene-04", durationFrames: 720, sampleFrame: 1850},
  {id: "scene-05", durationFrames: 720, sampleFrame: 2550},
  {id: "scene-06", durationFrames: 780, sampleFrame: 3300},
  {id: "scene-07", durationFrames: 900, sampleFrame: 4200},
  {id: "scene-08", durationFrames: 360, sampleFrame: 4900},
];

if (process.argv.includes("--full-remotion")) {
  console.log(`🎬 Rendering ${approvedEpisodeId} via full frame-by-frame Remotion CLI...`);
  const renderRes = spawnSync(
    "npx",
    ["remotion", "render", "src/index.ts", approvedEpisodeId, videoOut, "--codec", "h264", "--overwrite"],
    {cwd: root, stdio: "inherit"}
  );
  if (renderRes.status !== 0) {
    process.exit(renderRes.status ?? 1);
  }
} else {
  console.log(`🎬 Rendering ${approvedEpisodeId} (1920x1080 @ 30fps, H.264/AAC, 170s / 5100 frames)...`);
  const segmentPaths = [];

  for (const scene of pilotScenes) {
    const stillPng = path.join(tempRenderDir, `${scene.id}.png`);
    const segmentMp4 = path.join(tempRenderDir, `${scene.id}.mp4`);
    const audioMp3 = path.join(root, `public/audio/qatar-history/${approvedEpisodeId}-${scene.id}.mp3`);
    const durationSec = scene.durationFrames / 30;
    const fadeOutStart = Math.max(0.5, durationSec - 0.4);

    execFileSync(
      "npx",
      [
        "remotion",
        "still",
        "src/index.ts",
        approvedEpisodeId,
        stillPng,
        `--frame=${scene.sampleFrame}`,
        "--image-format=png",
        "--overwrite",
        "--log=error",
      ],
      {cwd: root, stdio: "inherit"}
    );

    execFileSync(
      "ffmpeg",
      [
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-loop",
        "1",
        "-framerate",
        "30",
        "-t",
        String(durationSec),
        "-i",
        stillPng,
        "-i",
        audioMp3,
        "-filter_complex",
        `[0:v]scale=1920:1080,format=yuv420p,fade=t=in:st=0:d=0.35,fade=t=out:st=${fadeOutStart}:d=0.35[v];[1:a]aresample=48000,apad=whole_dur=${durationSec}[a]`,
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

  const firstScenePng = path.join(tempRenderDir, "scene-01.png");
  execFileSync(
    "ffmpeg",
    ["-hide_banner", "-loglevel", "error", "-y", "-i", firstScenePng, "-vf", "scale=1280:720", thumbOut],
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
