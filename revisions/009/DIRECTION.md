# 009 — “Google AI Studio — polish cut” (owner rebuild after 008)

Portrait 1080×1920, 79 s, 30 fps, six beats (audio reused), narrative unchanged.

## Owner verdict on 008 (kept as hard rules)

- Sketch stickers “vůbec nesedí” → **retired forever**; die-cut style (cream outline, blue
  palette) is the project's sticker language again.
- Paper/white panels “fakt silena a špatná” → **retired forever**; the board stays dark navy.
- “UI často úplně mimo” → all geometry recomputed around the four viewport centers; every
  hero, tag and card is centered on its own axis and verified by layout check at every zoom.
- “Bude se to přelínat a kamera skoro furt v pohybu” → cross-dissolve grammar back, and the
  camera now rests only in short settle moments: every station has a slow push-in, travels
  happen during narration, and the film ends on the launch push (no stills, no silent tail).
- New workflow rule (owner): **intro first, perfected and approved, then the rest.**

## Design

- One label style: **navy tag** — small 10 px radius, coral pin dot, IBM Plex Mono, thin
  blue border (replaces both the old pills and 008 paper notes).
- One panel variation: **navy cards** (760×260, tilted ≤2°) at the feed station.
- Stations: hook (lockup + morphing shape + real photo, dip at ~13.5 s) → “One browser tab”
  → “Steer the model” (tag + gauge + deep-thinking star) → “Feed it anything” (three cards)
  → “Build with words” (loop hero, navy app card with phone + typing code, glow preview,
  key tag, prompt→feed→build strip, rocket launch).

## Validation

Lint 0/0 · tests 6/6 · check PASS zero warnings (motion 300, layout 31×, contrast incl.
paper-era sampling replaced) · render transcoded to CRF 27 (breathing-scene bitrate control,
owner-approved size hygiene).

## Next session protocol (owner instruction)

Generate the **intro only**, polish it with the owner until perfect, then build the rest.
