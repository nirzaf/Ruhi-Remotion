import {spawnSync} from "node:child_process";
import {mkdir, readFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const episodes = JSON.parse(await readFile(path.join(root, "src/episodes.json"), "utf8"));
const outputDir = path.join(root, "output/videos");
await mkdir(outputDir, {recursive: true});

for (const episode of episodes) {
  const output = path.join(outputDir, `${episode.id}.mp4`);
  console.log(`Rendering ${episode.number}: ${episode.title}`);
  const result = spawnSync("npx", ["remotion", "render", "src/index.ts", episode.id, output, "--overwrite", "--log=error"], {cwd: root, stdio: "inherit"});
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log(`Rendered ${episodes.length} lessons to output/videos.`);
