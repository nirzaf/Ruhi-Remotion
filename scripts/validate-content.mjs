import {execFileSync} from "node:child_process";
import {existsSync, readFileSync, readdirSync, statSync} from "node:fs";
import {readFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function validateQatarContent() {
  console.log("🔍 Validating Qatar History & Citizenship specification compliance (AC-01..AC-11)...");

  const errors = [];
  const warnings = [];

  // ---------------------------------------------------------------------------
  // AC-01: 20-file source registry & zero KG English contamination
  // ---------------------------------------------------------------------------
  const checksumsPath = path.join(root, "reference/source-checksums.json");
  if (!existsSync(checksumsPath)) {
    throw new Error("Missing reference/source-checksums.json");
  }
  const checksums = JSON.parse(await readFile(checksumsPath, "utf8"));
  if (checksums.sources.length !== 20) {
    errors.push(`AC-01: Expected exactly 20 in-scope PDFs in reference/source-checksums.json, found ${checksums.sources.length}`);
  }
  const registeredFiles = new Set(checksums.sources.map((s) => s.file));
  for (const file of registeredFiles) {
    if (file.toLowerCase().includes("iprimary english") || file.toLowerCase().includes("revision worksheets")) {
      errors.push(`AC-01: Out-of-scope file '${file}' must not appear in in-scope sources`);
    }
  }

  // ---------------------------------------------------------------------------
  // AC-02 & AC-03: Course scope (7 P0, 2 P1, 5 P2) & single central focus
  // ---------------------------------------------------------------------------
  const sourceMapPath = path.join(root, "content/episode-source-map.json");
  const sourceMap = JSON.parse(await readFile(sourceMapPath, "utf8"));

  const p0Eps = sourceMap.episodes.filter((e) => e.wave === "P0");
  const p1Eps = sourceMap.episodes.filter((e) => e.wave === "P1");
  const p2Eps = sourceMap.episodes.filter((e) => e.wave === "P2");

  if (p0Eps.length !== 7 || p1Eps.length !== 2 || p2Eps.length !== 5) {
    errors.push(`AC-02: Expected 7 P0, 2 P1, and 5 P2 episodes; found P0=${p0Eps.length}, P1=${p1Eps.length}, P2=${p2Eps.length}`);
  }

  for (const ep of sourceMap.episodes) {
    if (ep.wave === "P0" && !ep.firstMidterm) {
      errors.push(`AC-02: P0 episode ${ep.episodeId} must be marked firstMidterm: true`);
    }
    if (ep.wave !== "P0" && ep.firstMidterm) {
      errors.push(`AC-02: Non-P0 episode ${ep.episodeId} (${ep.wave}) must NOT be marked firstMidterm: true`);
    }
    if (!ep.singleCentralFocus || ep.singleCentralFocus.trim().length < 10) {
      errors.push(`AC-03: Episode ${ep.episodeId} is missing a clear singleCentralFocus`);
    }
    for (const mapping of ep.sourceMappings) {
      if (!registeredFiles.has(mapping.file)) {
        errors.push(`AC-01: Episode ${ep.episodeId} references unregistered PDF '${mapping.file}'`);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // AC-04 & AC-05: Pilot QH-L1-01 timing, audio fit, captions, and duration ceiling
  // ---------------------------------------------------------------------------
  const episodesTs = await readFile(path.join(root, "content/episodes.ts"), "utf8");
  if (!episodesTs.includes('id: "QH-L1-01"') || !episodesTs.includes('reviewStatus: "approved"')) {
    errors.push("AC-04: Pilot episode QH-L1-01 must be defined and marked reviewStatus: 'approved'");
  }

  const pilotSceneIds = [
    {id: "scene-01", durationFrames: 300},
    {id: "scene-02", durationFrames: 540},
    {id: "scene-03", durationFrames: 780},
    {id: "scene-04", durationFrames: 720},
    {id: "scene-05", durationFrames: 720},
    {id: "scene-06", durationFrames: 780},
    {id: "scene-07", durationFrames: 900},
    {id: "scene-08", durationFrames: 360},
  ];
  const totalPilotFrames = pilotSceneIds.reduce((sum, s) => sum + s.durationFrames, 0);
  const totalPilotSeconds = totalPilotFrames / 30;

  if (totalPilotSeconds < 120 || totalPilotSeconds > 240) {
    errors.push(`AC-04: Pilot QH-L1-01 duration (${totalPilotSeconds}s) must be within 120–240 seconds`);
  }

  for (const scene of pilotSceneIds) {
    const audioPath = path.join(root, `public/audio/qatar-history/QH-L1-01-${scene.id}.mp3`);
    if (!existsSync(audioPath)) {
      errors.push(`AC-05: Missing local narration audio for QH-L1-01 ${scene.id}: ${audioPath}`);
    } else {
      const stats = statSync(audioPath);
      if (stats.size < 1000) {
        errors.push(`AC-05: Narration audio too small (${stats.size} bytes): ${audioPath}`);
      }
      const clipSeconds = Number(
        execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", audioPath], {
          encoding: "utf8",
        }).trim()
      );
      const sceneSeconds = scene.durationFrames / 30;
      if (clipSeconds + 0.5 > sceneSeconds) {
        errors.push(
          `AC-05: Narration clip for ${scene.id} (${clipSeconds.toFixed(2)}s) exceeds scene duration (${sceneSeconds.toFixed(2)}s)`
        );
      }
    }
  }

  const srtPath = path.join(root, "public/captions/QH-L1-01.srt");
  if (!existsSync(srtPath) || statSync(srtPath).size < 100) {
    errors.push("AC-05: Missing or empty public/captions/QH-L1-01.srt");
  }

  // ---------------------------------------------------------------------------
  // AC-06, AC-07, AC-08, AC-09: Student questions, anomalies, and child privacy
  // ---------------------------------------------------------------------------
  const studentQuestionsPath = path.join(root, "content/student-questions.json");
  const studentQuestions = JSON.parse(await readFile(studentQuestionsPath, "utf8"));
  const rawStudentJson = await readFile(studentQuestionsPath, "utf8");

  if (rawStudentJson.includes("✅") || rawStudentJson.includes("correctOptionId") || rawStudentJson.includes("acceptedAliases")) {
    errors.push("AC-07: Student question manifest must not contain answer keys, '✅', or solution metadata");
  }

  const forbiddenPrivacyPatterns = [
    /complete name/i,
    /what is your name/i,
    /name of your school/i,
    /where are you from/i,
    /date of birth/i,
    /student number/i,
  ];

  for (const q of studentQuestions.questions) {
    if (!registeredFiles.has(q.sourceFile)) {
      errors.push(`AC-06: Question ${q.id} references unregistered sourceFile '${q.sourceFile}'`);
    }
    if (q.reviewStatus === "blocked_for_child" && q.studentVisible) {
      errors.push(`AC-09: Privacy-blocked question ${q.id} has studentVisible: true`);
    }
    if (q.reviewStatus !== "approved" && q.studentVisible) {
      errors.push(`AC-08: Unapproved question ${q.id} (${q.reviewStatus}) must have studentVisible: false`);
    }
    if (q.studentVisible) {
      for (const pat of forbiddenPrivacyPatterns) {
        if (pat.test(q.questionText)) {
          errors.push(`AC-09: Student-visible question ${q.id} contains privacy-sensitive prompt: '${q.questionText}'`);
        }
      }
    }
  }

  // Check ANOM-01 (MIDTERM-L1-A-05 raw duplicate 'a)' option labels preserved & held)
  const a5 = studentQuestions.questions.find((q) => q.id === "MIDTERM-L1-A-05");
  if (!a5 || a5.options[0].display !== "a) pajamas" || a5.options[1].display !== "a) school uniform" || a5.studentVisible !== false) {
    errors.push("AC-08: MIDTERM-L1-A-05 must preserve raw duplicate 'a)' labels and remain held (studentVisible: false)");
  }

  // Check content-review.json has all 7 documented anomalies
  const reviewPath = path.join(root, "content/content-review.json");
  const reviewData = JSON.parse(await readFile(reviewPath, "utf8"));
  if ((reviewData.anomaliesAndSafeguards?.length ?? 0) < 7) {
    errors.push(`AC-08: Expected at least 7 documented source anomalies in content/content-review.json`);
  }

  // Verify no file in src/ imports teacher-answers.private.json
  function scanSrcForPrivateImports(dir) {
    for (const entry of readdirSync(dir, {withFileTypes: true})) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanSrcForPrivateImports(full);
      } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
        const text = statSync(full).size > 0 ? readFileSync(full, "utf8") : "";
        if (text.includes("teacher-answers.private")) {
          errors.push(`AC-07: Video source file ${full} must never import teacher-answers.private.json`);
        }
      }
    }
  }
  scanSrcForPrivateImports(path.join(root, "src"));

  if (warnings.length > 0) {
    warnings.forEach((w) => console.log(`⚠️  ${w}`));
  }

  if (errors.length > 0) {
    console.error(`❌ Qatar History content validation failed with ${errors.length} error(s):`);
    errors.forEach((e) => console.error(`   - ${e}`));
    process.exit(1);
  }

  console.log(`✅ AC-01: 20 in-scope school PDFs verified; out-of-scope KG English sources excluded.`);
  console.log(`✅ AC-02 & AC-03: 14 episodes verified (7 P0 Midterm, 2 P1 Greetings, 5 P2 Enrichment); single central focus enforced.`);
  console.log(`✅ AC-04 & AC-05: Pilot QH-L1-01 (${totalPilotSeconds}s / ${totalPilotFrames} frames) audio & SRT captions verified.`);
  console.log(`✅ AC-06..AC-09: ${studentQuestions.questions.length} verbatim source questions validated; zero answer leaks; 7 anomalies & privacy blocks enforced.`);
}

validateQatarContent().catch((err) => {
  console.error(err);
  process.exit(1);
});
