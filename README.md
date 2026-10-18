# Ruhi's Global Citizenship Lessons: Unit 1 Social Justice Video Series

An animated educational video series built in [Remotion](https://remotion.dev) for Class 1 / early-primary learners (ages 6–7). Covers Unit 1 (Social Justice) of the Global Citizenship curriculum across workbook pages 10–24 and associated midterm test-preparation sheets.

Each episode is a standalone 1920×1080 @ 30 FPS composition featuring original 2.5D vector-illustrated character animations, local audio narration, accessible early-reader captions, and curriculum-aligned reflective questions.

---

## Deliverables & Compositions

| Composition ID | Workbook Pages | Title & Theme | Scene Count | Primary Learning Outcomes | Output Artifact |
| --- | --- | --- | --- | --- | --- |
| `episode-1-justice` | 10–12 | **Justice & Injustice: The Playground Promise** | 9 scenes | Recognize fair vs. unfair; countable equal sharing; taking turns on the slide; helping, caring, and respecting others. | `output/videos/episode-1-justice.mp4` |
| `episode-2-wealth-poverty` | 13–16 | **Wealth & Poverty: What Makes a Good Friend?** | 8 scenes | Differences in money do not determine human worth; everyone is equally important; kindness, helping, and equal respect. | `output/videos/episode-2-wealth-poverty.mp4` |
| `episode-3-opportunity` | 17–20 | **Equality of Opportunity: Everyone Gets a Chance** | 8 scenes | Different preferences are welcome; friends do not need identical tastes; welcoming a waiting friend; equal chance to participate. | `output/videos/episode-3-opportunity.mp4` |
| `episode-4-challenging-injustice` | 21–24 | **Challenging Injustice: Let's Make It Right** | 10 scenes | Distinguish right and wrong; admit mistakes honestly; say sorry with sincere body language; actively help repair harm; polite asking vs. grabbing. | `output/videos/episode-4-challenging-injustice.mp4` |

---

## Primary Cast (The Fairness Explorers)

All four recurring children are first-class peers with unique silhouettes, palettes, expressive face rigs, and distinct speaking and action roles:

- **RUHI (`ruhi`)**: Inquiring explorer with dark wavy hair, coral top, and turquoise hair clips. (Acts as narrator/guide; models polite asking).
- **AIMA (`aima`)**: Creative and empathetic friend with dual puff buns, golden ribbons, and mint green star tee. (Models sharing, turn-taking, and cooperative play).
- **NUH (`nuh`)**: Energetic athletic teammate with textured curly fade, blue sport tee with orange stripe, and bright smile. (Models acknowledging errors, apologizing, and building towers).
- **FATHIMA (`fathima`)**: Observant, caring friend with dark side braid and teal hair tie, plum tunic with teal floral accent, and golden shoes. (Introduced as the fourth first-class recurring cast member; performs major actions across all four episodes including sharing, helping pick up dropped items, inviting waiting friends, and leading the repair of bumped blocks).

---

## Pedagogical & Source Alignment

Educational concepts are grounded directly in parent-provided workbook scans and test-preparation material:

1. **Source Coverage Manifest (`src/content/source-coverage.json`)**:
   - Maps 46 curriculum requirements across workbook pages 10–24 (`WB-10` through `WB-24`), True/False questions (`TF-01` through `TF-12`), MCQs (`MC-01` through `MC-09`), and Short Answer prompts (`SA-01` through `SA-05`).
   - Every scene is tagged with its source IDs and categorized as either `SOURCE_ADAPTATION` or `ORIGINAL` pedagogical example.
2. **Animation Invariants**:
   - **Fair Sharing (`episode-1-justice`)**: Exactly 8 candies are distributed from a central platter to 4 distinct plates with 2 candies each (conservation of objects; no teleportation or disappearing items).
   - **Slide Turn-Taking (`episode-1-justice`)**: Distinct sequential slide turns (Ruhi → Aima → Nuh → Fathima); queue advances visibly with only one active rider on the slide at a time.
   - **Wealth & Poverty Ethics (`episode-2-wealth-poverty`)**: Play tokens are explicitly labeled as a pretend game; differences in token counts are decoupled from human value.
   - **Unique Preferences (`episode-3-opportunity`)**: Ruhi likes cucumbers, Aima likes mangoes, Nuh likes apples, and Fathima likes bananas. Preferences remain distinct while opportunity to play is shared equally.
   - **Apology & Repair Sequence (`episode-4-challenging-injustice`)**: Clear multi-step causal sequence: Accidental collision → upset feelings → admitting the truth → sincere apology → hands-on block-by-block tower rebuild.
3. **Assessment Integrity**:
   - Each episode ends with exactly one unanswered open reflection question (`withholdAnswer: true`).
   - Answers and correct indicators are never revealed on screen during the pause to give young learners authentic thinking time.

---

## Audio & Caption Pipeline

- **Local Narration (`scripts/generate-audio.mjs`)**:
  - Uses native macOS `say` and `ffmpeg` to generate local audio MP3s for all 35 scenes.
  - Automatically caches audio based on SHA-256 script hashing, avoiding unnecessary audio regeneration when text is unchanged.
  - Generates `src/audio-durations.json` with frame-accurate durations verified via `ffprobe`.
- **Early-Reader Captions (`src/video/LessonVideo.tsx`)**:
  - Features clear, high-contrast, large-type captions with generous padding and background pill styling.
  - Uses reliable sentence/phrase-level display rather than misleading pseudo-karaoke word chasing.

---

## Verification & Execution

### Prerequisites
- Node.js 18+ (tested on Node 26)
- ffmpeg & ffprobe installed locally
- macOS (for `say` voice synthesis; pre-generated MP3s in `public/audio/` are checked in for other platforms)

### Running Locally
```bash
# Install dependencies
npm install

# Run static quality and curriculum verification
npm run lint
node scripts/validate-lessons.mjs

# Preview in Remotion Player
npm run dev
```

### Narration Generation
```bash
npm run narration
```

### Video Rendering
```bash
# Render all four episodes in sequence to output/videos/
npm run render:all

# Render an individual episode
npx remotion render src/index.ts episode-1-justice output/videos/episode-1-justice.mp4 --overwrite
```

---

## Repository Structure

```
Ruhi-Remotion/
├── src/
│   ├── Root.tsx                      # Remotion Root with 4 compositions (1920x1080 @ 30fps)
│   ├── episodes.json                 # Canonical 35-scene storyboard, narration, and source links
│   ├── audio-durations.json          # Cached per-scene durations and SHA-256 hashes
│   ├── content/
│   │   └── source-coverage.json      # Comprehensive curriculum alignment manifest
│   └── video/
│       ├── types.ts                  # TypeScript types for Cast, Scenes, and Episodes
│       ├── timing.ts                 # Scene duration calculations with thinking pauses
│       ├── Character.tsx             # 4-character vector rig (RUHI, AIMA, NUH, FATHIMA)
│       ├── Illustration.tsx          # 2.5D storybook scenes, prop animation & staging
│       └── LessonVideo.tsx           # Player frame, headers, progress, and captions
├── scripts/
│   ├── generate-audio.mjs            # Audio generation script with hash validation
│   ├── render-all.mjs                # Sequential multi-composition rendering
│   └── validate-lessons.mjs          # Content, audio, and visual invariant validator
├── public/
│   └── audio/                        # 35 generated scene voice MP3s + quiz chime
└── output/
    ├── videos/                       # 4 deliverable MP4 files
    └── stills/                       # Validated keyframe PNG stills for review
```
