import {spawn} from "node:child_process";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Detached: survives parent exit, logs to render-explainer.log
const child = spawn("pnpm", ["exec", "remotion", "render", "src/index.ts", "explainer-daily-routine", "out/videos/explainer-daily-routine.mp4", "--codec", "h264", "--overwrite", "--log=error"], {
  cwd: root,
  detached: true,
  stdio: "ignore",
  shell: true,
  windowsHide: true,
});

child.unref();
console.log(`Render launched detached (pid ${child.pid}). Watch out/videos/explainer-daily-routine.mp4`);
