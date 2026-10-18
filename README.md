# Ruhi's Global Citizenship lessons

Four short Grade 1 lessons for Unit 1, Social Justice, built and rendered with Remotion. Each lesson is a separate 1920×1080 composition with animated vector artwork, spoken narration, matching on-screen captions, page references, and a pause-and-think question.

The episode scripts adapt the lesson summaries supplied for workbook pages 10–24. The textbook itself was not present in the Grade 1 folder when this project was created, so details beyond those summaries are original child-friendly examples.

## Episodes

| Composition | Workbook pages | Main idea |
| --- | --- | --- |
| `episode-1-justice` | 10–12 | Share, take turns, and include others |
| `episode-2-wealth-poverty` | 13–16 | Money does not decide a person's worth |
| `episode-3-opportunity` | 17–20 | Everyone deserves a chance to participate |
| `episode-4-challenging-injustice` | 21–24 | Tell the truth, apologize, and help make things right |

## Run and render

```bash
npm install
npm run narration
npm run dev
```

The narration command uses the built-in macOS `say` voice and `ffmpeg` to create local audio assets; no external AI or video service is used. It defaults to Samantha at 145 words per minute and 160 kbps. Override these defaults with `NARRATION_VOICE`, `NARRATION_RATE`, and `NARRATION_BITRATE` when running `npm run narration`. To render all four MP4 files with Remotion:

```bash
npm run render:all
```

MP4 files are written to `output/videos/`. To render one composition directly:

```bash
npx remotion render src/index.ts episode-1-justice output/videos/episode-1-justice.mp4
```

The episode text and scene order live in `src/episodes.json`. Shared character art and scene animation live in `src/video/`.
