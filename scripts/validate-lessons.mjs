import {existsSync, statSync} from "node:fs";
import {readFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function validateLessons() {
  console.log("🔍 Validating Ruhi-Remotion lesson content and source coverage...");

  const episodesPath = path.join(root, "src/episodes.json");
  const coveragePath = path.join(root, "src/content/source-coverage.json");
  const audioDurationsPath = path.join(root, "src/audio-durations.json");
  const audioDir = path.join(root, "public/audio");

  const episodes = JSON.parse(await readFile(episodesPath, "utf8"));
  const coverage = JSON.parse(await readFile(coveragePath, "utf8"));
  let audioDurations = {};
  if (existsSync(audioDurationsPath)) {
    audioDurations = JSON.parse(await readFile(audioDurationsPath, "utf8"));
  }

  const expectedEpisodeIds = [
    "episode-1-justice",
    "episode-2-wealth-poverty",
    "episode-3-opportunity",
    "episode-4-challenging-injustice",
  ];

  if (episodes.length !== 4) {
    throw new Error(`Expected exactly 4 episodes, found ${episodes.length}`);
  }

  const registeredSourceIds = new Set(coverage.sources.map((s) => s.sourceId));

  const errors = [];
  const warnings = [];

  episodes.forEach((ep, epIndex) => {
    if (ep.id !== expectedEpisodeIds[epIndex]) {
      errors.push(`Episode ${epIndex + 1} has unexpected id '${ep.id}', expected '${expectedEpisodeIds[epIndex]}'`);
    }

    const sceneIds = new Set();
    let quizCount = 0;

    ep.scenes.forEach((scene, sceneIndex) => {
      // Unique scene ID
      if (sceneIds.has(scene.id)) {
        errors.push(`Duplicate scene id '${scene.id}' in ${ep.id}`);
      }
      sceneIds.add(scene.id);

      // Non-empty heading & narration
      if (!scene.heading || scene.heading.trim() === "") {
        errors.push(`Empty heading in ${ep.id} -> ${scene.id}`);
      }
      if (!scene.narration || scene.narration.trim() === "") {
        errors.push(`Empty narration in ${ep.id} -> ${scene.id}`);
      }

      // Source ID check
      if (scene.sourceIds) {
        scene.sourceIds.forEach((sid) => {
          if (!registeredSourceIds.has(sid)) {
            errors.push(`Unknown sourceId '${sid}' in ${ep.id} -> ${scene.id}`);
          }
        });
      }

      // Reflection quiz check
      if (scene.visual === "quiz" || scene.withholdAnswer) {
        quizCount++;
        if (sceneIndex !== ep.scenes.length - 1) {
          errors.push(`Reflection prompt '${scene.id}' in ${ep.id} is at scene ${sceneIndex + 1}, must be final scene`);
        }
        if (!scene.withholdAnswer) {
          errors.push(`Reflection prompt '${scene.id}' in ${ep.id} must have withholdAnswer: true`);
        }
      }

      // Audio file presence check
      const audioFile = path.join(audioDir, `${ep.id}-${scene.id}.mp3`);
      if (existsSync(audioFile)) {
        const stats = statSync(audioFile);
        if (stats.size === 0) {
          errors.push(`Audio file is 0 bytes: ${audioFile}`);
        }
      } else {
        warnings.push(`Audio file pending generation: ${ep.id}-${scene.id}.mp3`);
      }
    });

    if (quizCount !== 1) {
      errors.push(`Episode ${ep.id} must have exactly 1 unanswered reflection question, found ${quizCount}`);
    }

    // Intro cast check
    const introScene = ep.scenes[0];
    const castNames = ["Ruhi", "Aima", "Nuh", "Fathima"];
    castNames.forEach((name) => {
      if (!introScene.narration.includes(name)) {
        errors.push(`Intro scene for ${ep.id} should introduce character '${name}'`);
      }
    });
  });

  // Educational Invariant Checks
  // Ep 1: 8 sweets shared equally by 4 friends
  const ep1 = episodes.find((e) => e.id === "episode-1-justice");
  const ep1Start = ep1.scenes.find((s) => s.id === "sweets-start");
  const ep1Share = ep1.scenes.find((s) => s.id === "share-equally");
  if (!ep1Start.narration.includes("eight sweets") || !ep1Start.narration.includes("four friends")) {
    errors.push("Episode 1 sweets-start must mention 8 sweets for 4 friends");
  }
  if (!ep1Share.narration.includes("Each friend gets two")) {
    errors.push("Episode 1 share-equally must result in 2 sweets per friend");
  }

  // Ep 3: Four distinct food choices
  const ep3 = episodes.find((e) => e.id === "episode-3-opportunity");
  const ep3Food = ep3.scenes.find((s) => s.id === "four-favorites");
  if (
    !ep3Food.narration.includes("cucumbers") ||
    !ep3Food.narration.includes("mangoes") ||
    !ep3Food.narration.includes("apples") ||
    !ep3Food.narration.includes("bananas")
  ) {
    errors.push("Episode 3 four-favorites must specify 4 distinct foods (cucumbers, mangoes, apples, bananas)");
  }

  // Ep 4: Sequence: accident -> feelings -> admit -> say-sorry -> repair
  const ep4 = episodes.find((e) => e.id === "episode-4-challenging-injustice");
  const ep4Ids = ep4.scenes.map((s) => s.id);
  const accidentIdx = ep4Ids.indexOf("accident");
  const feelingsIdx = ep4Ids.indexOf("feelings");
  const admitIdx = ep4Ids.indexOf("admit");
  const sorryIdx = ep4Ids.indexOf("say-sorry");
  const repairIdx = ep4Ids.indexOf("help-repair");

  if (!(accidentIdx < feelingsIdx && feelingsIdx < admitIdx && admitIdx < sorryIdx && sorryIdx < repairIdx)) {
    errors.push("Episode 4 must maintain sequence: accident -> feelings -> admit -> say-sorry -> help-repair");
  }

  console.log(`✅ Validated 4 episodes with ${episodes.reduce((acc, ep) => acc + ep.scenes.length, 0)} scenes total.`);
  console.log(`✅ Source coverage verified against ${coverage.sources.length} curriculum items.`);

  if (warnings.length > 0) {
    console.log(`ℹ️  ${warnings.length} warning(s):`);
    warnings.slice(0, 5).forEach((w) => console.log(`   - ${w}`));
    if (warnings.length > 5) {
      console.log(`   ... and ${warnings.length - 5} more`);
    }
  }

  if (errors.length > 0) {
    console.error(`❌ Validation failed with ${errors.length} error(s):`);
    errors.forEach((err) => console.error(`   - ${err}`));
    process.exit(1);
  } else {
    console.log("✨ All content invariants and lesson contracts passed!");
  }
}

validateLessons().catch((err) => {
  console.error(err);
  process.exit(1);
});
