# AGENTS.md — read me first

This repository produces **finished narrated MP4 videos** — 2D "spatial UI" animations where the camera travels across one shared dotted surface and the UI panels are real content, not slides. Everything (source, build, QA, render) is local and deterministic. The intended operator is an AI agent or a developer following the same recipe.

## The five golden rules

1. **Clean the cloud BEFORE you generate anything.** The owner's standing order: the first action of every session (and every new film) is deletion of everything superseded — old MP4s, QA keyframes, sticker sets, narration audio of earlier revisions, generated compositions. Media is recoverable from git history; the storage limit is not.
2. **The deliverable is a video file.** Do not present HTML, previews, studios or editors to the user. Present the finished MP4 and keep everything else internal.
3. **One revision at a time, one config per film.** Every film lives in `revisions/<id>/` and is fully described by `revisions/<id>/film.config.json` — resolution, duration, narration, QA sample points. Portrait 1080×1920 and landscape 1920×1080 are both just config values; nothing else changes.
4. **The timeline is a paused, seek-safe GSAP timeline.** No wall clock, no `Date.now()`, no randomness, no network. Any time must produce the same frame, sought forwards or backwards. Register it as `window.__timelines[<compositionId>]`.
5. **Validate before rendering, verify after rendering.** `lint → test → check → render → ffprobe + decoded frames`. Never trust a single end-position screenshot; inspect mid-times and the decoded file.
6. **Sticker art is budgeted.** Max 10 new stickers per session, one locked style (`revisions/004/STICKER_STYLE.md`); superseded sets are deleted, not archived.
7. **Keep the GitHub repo current.** Push source + docs when authoring starts, and push again right after the verified render. The repo is the owner's backup, not an archive dump.

## Fast path

```bash
npm ci
npm run hf -- browser ensure   # one-time: local headless Chrome
npm run build                  # build the current revision (default 003)
npm test                       # browser QA against the built composition
npm run check                  # full Hyperframes audit (lint/runtime/layout/motion/contrast)
npm run render                 # exports/api-keys-explained.mp4
```

Switch revisions with `--rev` / `FILM_REV` (see README). Read `docs/AGENT_GUIDE.md` before authoring a new film — it contains every pitfall we have already hit and fixed, including GSAP `autoRound:false` for normalized SVG strokes, `<audio>` element `id` requirements, and the audio-slot length trap caught by runtime checks.

## Where things are

| Path | Meaning |
| --- | --- |
| `revisions/003/` | Current film: narrated portrait explainer "API keys explained" (blue accent) |
| `revisions/002/` | Earlier silent landscape film, kept as a worked example |
| `revisions/<id>/film.config.json` | Single source of truth for one film |
| `revisions/<id>/src/` | Hand-written `film.html`, `film.css`, `film.js` |
| `revisions/<id>/audio/` | Narration clips (MP3), measured and wired via config |
| `revisions/<id>/composition/` | Generated — never edit by hand |
| `revisions/<id>/qa/` | Reports, keyframes, contact sheet |
| `scripts/build-film.mjs` | Generic builder for any revision |
| `scripts/test-film.mjs` | Generic browser QA for any revision |
| `scripts/hf.mjs` | Hyperframes CLI wrapper (local FFmpeg, telemetry off, workspace temp) |
| `VIDEO_STYLE.md` | Standing user style preferences — apply to every new film |

UI content shown in the films is illustrative. Do not add branding, scene numbers, slogans or editor chrome — the owner removed them on purpose.

## Session protocol (owner, hard rule)

1. **Intro first.** When (re)building a film: generate ONLY the intro (hook), polish it with
   the owner until explicitly approved, then continue with the rest. Never render a full film
   on an unapproved hook.
2. **Style constants (do not relitigate):** die-cut stickers (sketch style rejected), dark
   navy board (white/paper panels rejected), cross-fade transitions, camera almost always
   moving, no silent tail, "60-second explainer" banned.
