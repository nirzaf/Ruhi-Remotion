# Qatar History and Citizenship — Remotion Video Learning System

An animated educational video series and source-faithful assessment manifest system built in [Remotion](https://remotion.dev) for Class 1 learners (School Session 2026–2027).

Also preserves the original **Ruhi's Global Citizenship Lessons (Unit 1 Social Justice)** compositions under the `Global-Citizenship-Unit-1` folder in Remotion Studio.

---

## 1. Course Scope & Delivery Waves

| Wave | Scope | Episodes | First Midterm Exam? | Status |
| --- | --- | --- | --- | --- |
| **P0 (Pilot)** | Lesson 1 — *I'm a Special Kid* | `QH-L1-01` (**My Daily Routine**) | **Yes** | **Approved & Rendered** (`170s` / `5100 frames` @ `30fps`) |
| **P0 (Core)** | Lesson 1 & Lesson 2 — *My Family and I* | `QH-L1-02`..`04`, `QH-L2-01`..`03` | **Yes** | Draft storyboard — held pending pilot sign-off |
| **P1** | Lesson 3 — *Greetings* | `QH-L3-01`..`02` | **No** | Draft storyboard — separate from First Midterm |
| **P2** | *Inter-House Qatar History Quiz (Grades 1–3)* | `QH-QUIZ-01`..`05` | **No** (Optional Enrichment) | Draft storyboard — separate enrichment |

---

## 2. Repository Structure

```text
├── reference/
│   ├── source-pdfs/                  # Parent-owned original 20 school PDFs (not bundled to web)
│   └── source-checksums.json         # 20-file source registry & out-of-scope exclusion manifest
├── content/
│   ├── episodes.ts                   # Typed 14-episode catalog & approved QH-L1-01 pilot timing
│   ├── episode-source-map.json       # PDF/page/section/item traceability crosswalk
│   ├── student-questions.json        # Verbatim child-safe question bank (zero answer keys/hints)
│   ├── teacher-answers.private.json  # Private teacher/parent answer key & positional mappings
│   ├── content-review.json           # 7 documented source anomalies & privacy-blocked items
│   └── assets-manifest.json          # Visual, audio, and design token provenance
├── public/
│   ├── audio/qatar-history/          # 48 kHz mono narration MP3s for pilot QH-L1-01
│   └── captions/QH-L1-01.srt         # Synchronized English SRT captions
├── src/
│   ├── Root.tsx                      # Registers QH-L1-01..QH-QUIZ-05 + existing lessons
│   ├── types.ts                      # Typed Episode, Scene, and SourceRef contracts
│   ├── design/tokens.ts              # Qatar-inspired palette (#8A1538, #FFF8ED, #F1DFC7, #267D80, #233348)
│   ├── videos/EpisodeVideo.tsx       # Deterministic sequence player
│   └── components/                   # SceneLayout, TitleScene, IllustratedAction, CaptionLine, EndCard
├── scripts/
│   ├── generate-qatar-audio.mjs      # Generates 48 kHz narration & SRT captions for QH-L1-01
│   ├── validate-content.mjs          # Automated quality gates (AC-01 through AC-11)
│   └── render-approved.mjs           # Renders approved pilot MP4, SRT, and 1280x720 thumbnail
└── out/
    ├── videos/QH-L1-01.mp4           # 1920x1080 H.264/AAC pilot video
    ├── subtitles/QH-L1-01.srt        # Companion subtitle file
    └── thumbnails/QH-L1-01.png       # 1280x720 PNG episode thumbnail
```

---

## 3. Commands: Validation, Preview & Rendering

```bash
# Install dependencies
npm install

# Run automated specification & source-integrity checks (AC-01..AC-11)
npm run validate:content

# Run ESLint & TypeScript verification
npm run lint
npm run typecheck

# Preview in Remotion Studio (port 3000)
npm run dev

# Render a single approved episode (QH-L1-01) + 1280x720 thumbnail + SRT
npm run render:approved

# Or render QH-L1-01 directly via official Remotion CLI
npx remotion render src/index.ts QH-L1-01 out/videos/QH-L1-01.mp4 --codec h264
```

---

## 4. Parent Review & Release Gate Protocol

1. **Pilot Sign-Off (`QH-L1-01`)**: Inspect `out/videos/QH-L1-01.mp4`, `out/subtitles/QH-L1-01.srt`, and `out/thumbnails/QH-L1-01.png` before approving batch production of `QH-L1-02` through `QH-L2-03`.
2. **Held Source Anomalies (`content/content-review.json`)**:
   - `ANOM-01` (`MIDTERM-L1-A-05`): Printed option labels `a)`, `a)`, `b)` preserved verbatim and held (`studentVisible: false`) pending parent approval.
   - `ANOM-02` (`MIDTERM-L1-D-01` & `L1-QA-01`, `D3`, `D4`): Personal identity/school/location prompts marked `blocked_for_child` and excluded from child-visible prompts.
   - `ANOM-03` (`L1-WS-C-03` vs `MIDTERM-L1-C-03`): Distinct worksheet word-bank variant preserved and flagged for parent review.
   - `ANOM-04` (`MIDTERM-L1-C-06`): Raw wording `"I wake up ______ and happy. (lazily – energetic)"` preserved verbatim.
   - `ANOM-05` (`QUIZ-TF-05` & `QUIZ-TF-08`): Duplicate World Cup 2022 T/F entry logged so repetition is not counted as independent mastery.
   - `ANOM-06` (`QUIZ-TF-09` & `QUIZ-MCQ-14`): School-specific historical wording (`Al Zubarah Fort`) held for parent/teacher factual review.
   - `ANOM-07` (`MIDTERM-L2-A-01/02`): Curriculum role examples taught while depicting shared family caring.
