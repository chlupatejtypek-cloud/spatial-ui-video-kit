# Spatial UI Video Kit

Finished, narrated 2D explainer videos built from HTML + GSAP and rendered to MP4 with [Hyperframes](https://github.com/heygen-com/hyperframes), with [OpenDesign](https://github.com/nexu-io/open-design) design principles. This repository is a **how-to for the next agent (or developer)**: the whole pipeline — authoring, narration, QA, rendering, storage hygiene — is documented and reproducible from a clean clone.

**Current film: [`exports/api-keys-crossfade-cut.mp4`](exports/api-keys-crossfade-cut.mp4)** — “API keys — cross-fade cut”, portrait 1080×1920, 64 s, 30 fps, English voice-over, die-cut sticker set, beat-level sync, full cross-fade editing. Earlier films stay in git history as worked examples.

All UI content and values in the films are illustrative.

## Why it looks like this

- One shared dark surface with a dotted grid; the camera **pans and zooms** across it. UI panels are real content in one coordinate space — not slides.
- One attention target at a time; the camera follows one causal action; earlier panels retire and are replaced in place.
- No branding, no scene numbers, no slogans, no editor chrome — the owner removed all of it deliberately.
- Portrait and landscape are **config values**, not rewrites.
- Sticker artwork follows one locked die-cut style with a per-session budget — [`revisions/004/STICKER_STYLE.md`](revisions/004/STICKER_STYLE.md).

Start with [`AGENTS.md`](AGENTS.md) (golden rules), then [`docs/AGENT_GUIDE.md`](docs/AGENT_GUIDE.md) (full walkthrough), then [`VIDEO_STYLE.md`](VIDEO_STYLE.md) (standing style preferences).

## Quickstart

Requirements: **Node ≥ 22** (tested with 24), no global FFmpeg needed.

```bash
npm ci
npm run hf -- browser ensure    # one-time: downloads a local headless Chrome
npm run build                   # build current revision (003) into revisions/003/composition
npm test                        # browser QA: local-only assets, frame zero, seek determinism…
npm run check                   # Hyperframes audit: lint, runtime, layout, motion, contrast
npm run render                  # → exports/api-keys-crossfade-cut.mp4
```

## Working with revisions

Each film is fully described by one JSON config; scripts are generic.

```bash
node scripts/build-film.mjs --rev 003     # or: FILM_REV=003 npm run build
node scripts/test-film.mjs  --rev 003
node scripts/hf.mjs check revisions/003/composition --at 3,19.3,45.4 --json
node scripts/hf.mjs render revisions/003/composition --quality delivery --fps 30 \
     --workers 1 --output exports/api-keys-explained.mp4
```

Revision-specific deep assertions (exact geometry, stroke alignment) live in their own files, e.g. `scripts/qa-motion-002.mjs` for the landscape example; run them with `npm run qa:rev002`.

### `film.config.json` reference

| Key | Meaning |
| --- | --- |
| `width`, `height`, `duration`, `fps` | Composition canvas and length (portrait = 1080×1920) |
| `compositionId`, `timelineKey` | `data-composition-id` and `window.__timelines` key |
| `output` | Render target under `exports/` |
| `narration[]` | `{file, start, duration, track}` — audio clips wired into the build |
| `brandScan` | Words that must never appear on screen (QA scans the text) |
| `frameZero` | Selectors that must already be visible at t=0 |
| `signatureIds` | Elements sampled by the seek-determinism test |
| `seekTimes` | Forward/backward seek sample points |
| `screenshots[]` | QA keyframes and contact sheet layout (`thumb`, `cols`) |

### Authoring a new film

1. Copy `revisions/003/` → `revisions/004/`, edit `film.config.json` (id, sizes, duration, narration, QA points).
2. Rewrite `src/film.html` / `film.css` / `film.js` — keep them sparse; see the guide's timeline rules.
3. Generate narration clips into `audio/`, measure them (`ffprobe`), put the measured values in the config.
4. `npm run build -- --rev 004 && npm test && npm run check` (point the scripts at the new revision), fix everything, render, verify the decoded file, delete nothing you still need — but delete every video you no longer need.

## Narration workflow (short version)

Voice clips are pre-generated MP3s committed under `revisions/<id>/audio/`. The builder injects `<audio id="narration-N" data-start data-duration data-track-index src="assets/audio/…">` tags from the config and copies the files into the composition. Rules learned the hard way:

- Every `<audio>` **must have an `id`** — the renderer silently drops audio elements without one.
- `data-duration` must **not exceed the real media length** (the runtime check flags longer slots; render truncates to the media anyway).
- Measure, don't guess: encoder-reported MP3 length can differ from `ffprobe`'s container estimate by ~50 ms. Trust the Hyperframes runtime check as the arbiter.

Full details and the timing philosophy: `docs/AGENT_GUIDE.md` → “Narration workflow”.

## Storage hygiene (important in this workspace)

The sandbox is small; rendered videos and QA screenshots pile up fast. Standing policy — **cleanup is the first action of every session, before anything new is generated**:

- `exports/` holds **only the current MP4**. Old revisions' videos are deleted once superseded (the git history keeps what matters).
- Per-frame QA screenshots stay only for the current revision; contact sheets are cheap and always kept.
- Never commit `node_modules/`, `.cache/`, `.hyperframes/` or render logs (see `.gitignore`).
- Render temp lives in `.cache/hyperframes-tmp` (workspace), **not** `/tmp` — a small tmpfs once aborted a render mid-flight.

## Validation ladder (never skip rungs)

1. `npm run build` — then `node scripts/hf.mjs lint … --json` must be **0 errors, 0 warnings**.
2. `npm test` — headless-browser checks against the built composition (no server needed).
3. `npm run check` — full Hyperframes audit; motion uses 300 samples. Zero errors, zero warnings; `info` findings must be understood or eliminated.
4. Render, then **verify the artifact**: `ffprobe` (codec, size, fps, duration, `yuv420p`) and decode sample frames (contact sheet from the MP4, not the page). For narrated films also check the audio stream exists and is audible.
5. Present the MP4 — nothing else.

## Repository layout

```text
AGENTS.md                 golden rules for the next agent
README.md                 this guide
VIDEO_STYLE.md            standing style preferences
BRIEF.md                  current task state
docs/AGENT_GUIDE.md       full step-by-step how-to + pitfalls
docs/SOURCES.md           tools, versions, licenses
docs/references/          distilled notes from OpenDesign/Hyperframes sources
docs/licenses/            license copies (Apache-2.0, GSAP notice, OFL fonts)
revisions/003/            current film (portrait, narrated, blue)
revisions/002/            earlier film (landscape, silent, lime) — worked example
scripts/                  generic build/test + revision-specific QA + hf wrapper
exports/                  finished MP4s (current only)
```

## Tools & licenses

Hyperframes CLI 0.8.54 and GSAP 3.14.2 drive timing and rendering; OpenDesign 0.22.1 resources inform the design system. Details, pinned versions and license copies: [`docs/SOURCES.md`](docs/SOURCES.md) and [`docs/licenses/`](docs/licenses). No telemetry, no CDN calls at runtime, no paid APIs; the voice is generated locally during authoring and committed as plain audio files.

- 007: Google AI Studio explainer (79 s) — hook: topic-first lockup + generative shape + real photo + dip to dark.
