# Ruhi Remotion — Qatar History & Citizenship Video Learning System

An animated educational video series plus a source-faithful assessment manifest system built with [Remotion](https://remotion.dev) for **Class 1 learners (School Session 2026–2027)**.

Two curricula live side by side in Remotion Studio:

| System | Location | Compositions | Status |
| --- | --- | --- | --- |
| **Qatar History & Citizenship** (primary) | Studio root (`QH-*`) | 14 episodes: `QH-L1-01`…`QH-QUIZ-05` | Pilot `QH-L1-01` **approved & rendered** (170 s / 5100 frames @ 30 fps); rest are draft storyboards |
| **Ruhi's Global Citizenship, Unit 1: Social Justice** (legacy, preserved) | `Global-Citizenship-Unit-1` folder | 4 episodes (`episode-1-justice` … `episode-4-challenging-injustice`) | Preserved for compatibility; own data in `src/episodes.json` |

Every Qatar episode carries typed scene contracts (`content/episodes.ts` + `src/types.ts`): narration text, narration MP3 asset, caption asset, on-screen text, visual asset IDs, and PDF page/section/item `sources` — so any frame can be traced back to the school PDFs registered in `reference/source-checksums.json`.

---

## 1. Prerequisites

- **Node.js** `^20.19.0 || ^22.13.0 || >=24` (per `package.json` engines; verified on v24)
- **pnpm** (recommended — repo now carries `pnpm-lock.yaml`) or npm
- **ffmpeg + ffprobe** on `PATH` (required by `narration:qatar` and `render:approved`; check with `ffmpeg -version`)
- Optional: `GEMINI_API_KEY` for real TTS narration (without it, scripts generate silent placeholder tone so timing/captions still work)

## 2. Quickstart

```bash
# Install dependencies (pnpm preferred)
pnpm install
pnpm approve-builds esbuild   # one-time: allow esbuild postinstall (package.json sets allowScripts.esbuild=false)

# Or with npm
npm install

# Validate everything before previewing
pnpm validate:content   # AC-01..AC-11: source registry, scope, pilot timing, question safety
node scripts/validate-lessons.mjs   # legacy 4-episode invariants

# Preview in Remotion Studio
pnpm dev                # Remotion Studio on http://localhost:3000

# Typecheck & lint
pnpm typecheck
pnpm lint
```

> **PowerShell note:** invoke scripts via `cmd /c "pnpm <script>"` if PowerShell misparses output — pnpm itself works fine; only the `$`-prefixed echo in script output trips PS error coloring.

## 3. Course Catalog (14 Qatar episodes)

### P0 — First Midterm (7 episodes, `firstMidterm: true`)

| Episode | Title | Central focus | Review |
| --- | --- | --- | --- |
| `QH-L1-01` | My Daily Routine | Wake → brush teeth → breakfast → dress → school → bedtime; ordering actions | ✅ **approved** |
| `QH-L1-02` | Healthy Habits and Prayer | Hygiene, sleeping on time, ablution, morning prayer (Al Fajr) | draft |
| `QH-L1-03` | A Good Student and Friend | Respect teachers, follow rules, help classmates, school clinic | draft |
| `QH-L1-04` | Everyone Has Interests and Strengths | Hobbies, being special, speaking confidently (no personal-data disclosure) | draft |
| `QH-L2-01` | My Small Family | Mother, father, sister, brother; small/simple family | draft |
| `QH-L2-02` | My Extended Family | Grandparents, aunts/uncles, cousins, family tree | draft |
| `QH-L2-03` | Families Help One Another | Kindness, respect, cooperation, tidying, helping at home | draft |

### P1 — Greetings, Lesson 3 (2 episodes, not in midterm)

| Episode | Title | Central focus | Review |
| --- | --- | --- | --- |
| `QH-L3-01` | Greetings of Peace | Meaning and respectful exchange of greetings | draft |
| `QH-L3-02` | Respecting Elders and Neighbors | Greeting family/teachers/neighbors; Qatari customs | draft |

### P2 — Inter-House Qatar History Quiz enrichment (5 episodes, optional)

| Episode | Title | Central focus | Review |
| --- | --- | --- | --- |
| `QH-QUIZ-01` | Qatar's Flag and Symbols | Flag design/meaning, riyal, Sidra tree, ruling family | draft |
| `QH-QUIZ-02` | Traditional Life in Qatar | Pearl diving, falconry, camel racing, clothing, Souq Waqif | draft |
| `QH-QUIZ-03` | Heritage and Special Places | Al Zubarah, Khor Al Adaid, desert camping, museums | draft |
| `QH-QUIZ-04` | Qatar Through Time | Founder (per school quiz), 1971 independence, oil, old vs modern Doha | draft |
| `QH-QUIZ-05` | Qatar Today and World Cup 2022 | FIFA 2022, Lusail, airport, National Sports Day | draft |

### Pilot spotlight: `QH-L1-01` scene timing (5100 frames = 170 s @ 30 fps)

| Scene | Kind | Heading | Frames | Time |
| --- | --- | --- | --- | --- |
| scene-01 | title | My Daily Routine | 300 | 00:00–00:10 |
| scene-02 | explain | What We Do Every Day | 540 | 00:10–00:28 |
| scene-03 | demonstrate | Morning: Wake Up and Brush Teeth | 780 | 00:28–00:54 |
| scene-04 | demonstrate | Breakfast and Getting Dressed | 720 | 00:54–01:18 |
| scene-05 | demonstrate | Learning at School | 720 | 01:18–01:42 |
| scene-06 | demonstrate | Evening and Bedtime | 780 | 01:42–02:08 |
| scene-07 | recap | Our Day in Order | 900 | 02:08–02:38 |
| scene-08 | handoff | Ready for Practice | 360 | 02:38–02:50 |


---

## 4. Audio, Captions & Rendering

```bash
# (Re)generate 48 kHz mono narration MP3s + SRT for the pilot (needs ffmpeg/ffprobe)
pnpm narration:qatar
# With real voice:  $env:GEMINI_API_KEY="<key>"; pnpm narration:qatar
# Without a key:    placeholder tone so timing still validates

# Render approved pilot → out/videos/QH-L1-01.mp4 + out/thumbnails/QH-L1-01.png
# + out/subtitles/QH-L1-01.srt + out/manifest.json (needs ffmpeg)
pnpm render:approved
# Full frame-by-frame Remotion render instead of the fast still+ffmpeg path:
node scripts/render-approved.mjs --full-remotion

# Legacy: render the 4 Global Citizenship episodes → output/videos/
pnpm render:all

# Direct Remotion CLI for any composition
pnpm exec remotion render src/index.ts QH-L1-01 out/videos/QH-L1-01.mp4 --codec h264
pnpm exec remotion still src/index.ts QH-L1-01 out/thumb.png --frame=45
```

Deliverables (pilot): **1920×1080 H.264 + AAC mono @ 48 kHz, 30 fps, ~170 s**, thumbnail **1280×720 PNG**, captions **SRT**. `render-approved.mjs` stitches 8 per-scene stills (`remotion still` @ sample frames) with per-scene MP3s via ffmpeg (0.35 s fades, `aresample=48000`, concat, `+faststart`), copies the SRT, and writes `out/manifest.json`. `out/` is gitignored; committed `output/stills/` holds legacy preview frames.

## 5. Repository Structure

```text
├── reference/
│   ├── source-pdfs/                  # Parent-owned school PDFs (NOT bundled; exclusions enforced)
│   └── source-checksums.json         # Registry: 20 in-scope PDFs + out-of-scope (KG English) exclusions
├── content/                          # Qatar data (validated by validate-content.mjs)
│   ├── episodes.ts                   # Typed 14-episode catalog; QH-L1-01 approved (8 scenes, 5100 frames)
│   ├── episode-source-map.json       # Episode → PDF/page/section/item traceability + singleCentralFocus
│   ├── student-questions.json        # 52 verbatim child-safe questions; zero answer keys/hints
│   ├── teacher-answers.private.json  # Private answer key — NEVER imported by src/ (AC-07 enforced)
│   ├── content-review.json           # 7 documented anomalies (ANOM-01..07) + privacy blocks
│   └── assets-manifest.json          # Visual/audio/design-token provenance
├── public/
│   ├── audio/qatar-history/          # 8 pilot MP3s: QH-L1-01-scene-01..08.mp3 (48 kHz mono)
│   ├── audio/episode-*-*.mp3         # Legacy Global Citizenship narration
│   └── captions/QH-L1-01.srt         # Pilot captions (copied to out/subtitles/ on render)
├── src/
│   ├── index.ts / Root.tsx           # Entry + registry (14 QH-* comps + 4 legacy in Folder)
│   ├── types.ts                      # Episode / Scene / SceneKind / SourceRef / DeliveryWave contracts
│   ├── videos/EpisodeVideo.tsx       # Deterministic Qatar player: Sequence per scene, Audio if approved
│   ├── components/                   # SceneLayout, TitleScene, IllustratedAction, CaptionLine, EndCard
│   ├── design/tokens.ts              # Qatar palette (maroon #8A1538, cream #FFF8ED, sand #F1DFC7,
│   │                                 # teal #267D80, navy #233348) + Plus Jakarta Sans type scale
│   ├── video/                        # Legacy engine: LessonVideo, Character, Illustration, timing, types
│   ├── episodes.json                 # Legacy 4-episode data (drives render-all + validate-lessons)
│   ├── audio-durations.json          # Legacy per-scene audio frame counts for timing.ts
│   └── content/source-coverage.json  # Legacy curriculum coverage registry
├── scripts/
│   ├── generate-qatar-audio.mjs      # Gemini TTS (Kore voice) → 48 kHz MP3 + SRT; tone fallback offline
│   ├── generate-audio.mjs            # Legacy narration generator
│   ├── validate-content.mjs          # Gates AC-01..AC-11 (see §6)
│   ├── validate-lessons.mjs          # Legacy invariants (quiz-last, 8-sweets/2-each, food list, ep-4 order)
│   ├── render-approved.mjs           # Pilot pipeline (still+ffmpeg default, --full-remotion optional)
│   └── render-all.mjs                # Legacy batch render → output/videos/
├── output/stills/                    # Committed legacy preview frames (ep1..ep4)
├── out/                              # Gitignored: videos/, subtitles/, thumbnails/, manifest.json
├── remotion.config.ts                # Rspack on, jpeg stills, overwrite, 2 s premount
└── .env.example                      # No keys needed locally; only GEMINI_API_KEY is optional
```

## 6. Quality Gates (`pnpm validate:content`, AC-01..AC-11)

| Gate | What it enforces |
| --- | --- |
| AC-01 | Exactly 20 in-scope PDFs in `source-checksums.json`; KG English excluded; every mapping references a registered file |
| AC-02/03 | 7 P0 (`firstMidterm: true`) + 2 P1 + 5 P2 (`firstMidterm: false`); each episode has a substantive `singleCentralFocus` |
| AC-04/05 | `QH-L1-01` exists, `reviewStatus: "approved"`; 8 scenes = 5100 frames (≤ 180 s); all 8 MP3s present; SRT exists |
| AC-06..09 | 52 verbatim questions trace to registered PDFs; no answer keys/`✅` in student bank; unapproved or `blocked_for_child` items have `studentVisible: false`; no privacy prompts in visible text; `MIDTERM-L1-A-05` keeps raw duplicate `a)` labels, held |
| AC-07/08/10/11 | `content-review.json` documents ≥ 7 anomalies; nothing under `src/` imports `teacher-answers.private.json`; assets resolve; tokens match |

Legacy check (`node scripts/validate-lessons.mjs`): 4 episodes, unique scenes, non-empty headings/narration, exactly one `withholdAnswer` quiz as the final scene, cast names (Ruhi, Aima, Nuh, Fathima) in each intro, plus story invariants (8 sweets → 2 each; cucumbers/mangoes/apples/bananas; accident → feelings → admit → sorry → repair).

## 7. Parent Review & Release Gate

1. **Pilot sign-off (`QH-L1-01`)**: watch `out/videos/QH-L1-01.mp4`, read `out/subtitles/QH-L1-01.srt`, check `out/thumbnails/QH-L1-01.png` and `out/manifest.json` before approving `QH-L1-02`…`QH-L2-03`.
2. **Held anomalies (`content/content-review.json`)** — preserved verbatim, never silently "fixed":
   - `ANOM-01` (`MIDTERM-L1-A-05`): printed labels `a)`, `a)`, `b)` kept as-is, held (`studentVisible: false`).
   - `ANOM-02` (`MIDTERM-L1-D-01`, `L1-QA-01/D3/D4`): identity/school/location prompts `blocked_for_child`.
   - `ANOM-03` (`L1-WS-C-03` vs `MIDTERM-L1-C-03`): distinct word-bank variant flagged for review.
   - `ANOM-04` (`MIDTERM-L1-C-06`): raw `"I wake up ______ and happy. (lazily – energetic)"` kept verbatim.
   - `ANOM-05` (`QUIZ-TF-05`/`QUIZ-TF-08`): duplicate World Cup 2022 T/F logged — repetition ≠ mastery.
   - `ANOM-06` (`QUIZ-TF-09`/`QUIZ-MCQ-14`): school-specific wording (`Al Zubarah Fort`) held for factual review.
   - `ANOM-07` (`MIDTERM-L2-A-01/02`): role examples taught while depicting shared family caring.
3. **Privacy rule**: `teacher-answers.private.json` is parent/teacher-only and CI-blocked from `src/` imports.

## 8. Legacy: Global Citizenship Unit 1 (preserved)

Four compositions under the `Global-Citizenship-Unit-1` studio folder, driven by `src/episodes.json`, played by `src/video/LessonVideo.tsx` with hand-drawn `Illustration.tsx`/`Character.tsx` scenes:

| ID | Title | Core beat |
| --- | --- | --- |
| `episode-1-justice` | Justice & Injustice | 8 sweets shared by 4 friends → 2 each |
| `episode-2-wealth-poverty` | Wealth & Poverty | Worth, respect, kindness |
| `episode-3-opportunity` | Equality of Opportunity | cucumbers, mangoes, apples, bananas |
| `episode-4-challenging-injustice` | Challenging Injustice | accident → feelings → admit → sorry → repair |

Validate with `node scripts/validate-lessons.mjs`, narrate with `pnpm narration`, render with `pnpm render:all` → `output/videos/`.

## 9. Tech Stack

Remotion 4.0.536 + React 19 + TypeScript 5.9 (strict, `noUnusedLocals`) + Rspack · ESLint (Remotion flat config) + Prettier · dependency-free Node scripts · ffmpeg/ffprobe for media assembly · optional Gemini 2.5 Flash TTS (voice `Kore`).

## 10. Contributing

1. Edit data in `content/` (Qatar) or `src/episodes.json` (legacy) — never hand-edit generated `public/audio/*` or `out/*`.
2. Keep new questions traceable: registered PDF + page + section + item; keep answer keys out of `student-questions.json`.
3. Run `pnpm validate:content`, `node scripts/validate-lessons.mjs`, `pnpm typecheck`, `pnpm lint` before a PR.
4. Flip `reviewStatus` to `"approved"` only after parent sign-off; `EpisodeVideo` plays audio solely for approved episodes.


