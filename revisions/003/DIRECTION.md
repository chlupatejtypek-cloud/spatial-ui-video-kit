# How this video was (and is) made

`revisions/003` — **“API keys explained”**, portrait 1080×1920, 52 s, 30 fps, English voice-over.

## Goal

The user asked for a simple narrated video that explains how API keys work, in the calmer blue palette instead of the earlier green, and the whole pipeline had to support vertical (portrait) video, not just landscape.

## Creative direction

One shared dark surface with a subtle dot grid (2400×2100 world). The camera shows one 1080×1920 viewport of it at a time and pans horizontally between two “stages”. One attention target at a time. Panels are replaced in place — earlier content retires and the next scene reuses the space. Accent color is a desaturated blue `#71a8ff`; motion is restrained; the only “burst” allowed is a small back-out on the verification ring.

Narration drives the structure (four chunks, ~45.5 s of speech, film 52 s):

| # | Start | Audio | Content on screen |
| --- | --- | --- | --- |
| 1 | 0.8 | 10.73 s | “What is an API key?” — key tile, then identity (“who is calling”) and permission (“what it may do”) chips |
| 2 | 12.6 | 11.09 s | “How a call works” — app → key chip travels down → API server check ring → response → data node lights up |
| 3 | 24.8 | 13.12 s | “Keep it safe” — never commit, restrict scope, rotate; replaces scene 1 in place |
| 4 | 39.1 | 10.49 s | “If a key leaks” — struck-through key, revoke, new key, update app, closing “Identify → Verify → Protect” |

The voice is synthetic, generated in short sentence-level chunks so each scene can be timed to measured audio (see `docs/AGENT_GUIDE.md` → “Narration workflow”).

## Specific user constraints honored here

- No visible branding of any tool, no scene numbers, no slogans, no navigation chrome.
- Sparse panels; each scene shows one idea.
- No abrupt emphasis: the flow line draws continuously; the check ring is the only pop.
- Irregular rhythm — gaps of 2.3 s / 5.3 s / 3.2 s / 3.5 s / 4.5 s between entrances, driven by the voice, not a metronome.
- Portrait format.

## Technical notes

- World is static geometry; the camera is a single object `{x, y, z}` applied by one `applyCamera()` function — every camera tween calls it. This keeps all travel consistent and seek-safe.
- All entrances are `fromTo` so GSAP owns the whole transform state (a CSS `transform` + GSAP `y` tween is a lint error and a real rendering hazard).
- Connector lines use `pathLength="1"` normalized dash reveal with `autoRound:false` — without it, pixel-rounded `strokeDashoffset` snaps the draw.
- Audio elements require `id` (renderer drops audio without it) and `data-duration` ≤ the real media length (runtime check flags longer slots).
- The old scene retires (fade/rise/shrink) while the camera crosses to the other viewport — content is replaced, never stacked.

## Results

- Hyperframes check: lint/runtime/layout/motion/contrast all pass (300 motion samples, contrast 27/27, zero warnings).
- Browser QA: 6 checks (local-only assets, no chrome, frame zero, narration wiring, deterministic seeks).
- Delivered: `exports/api-keys-explained.mp4`.
