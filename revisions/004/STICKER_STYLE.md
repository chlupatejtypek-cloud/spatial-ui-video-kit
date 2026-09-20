# Sticker style — locked

All sticker art in this project follows one style so every new film stays coherent. This is a hard style guide for any future image generation.

## The style (generated with one shared prompt template)

> Flat vector die-cut sticker of **{subject}**. Thick smooth cream outline (#F7F2E6) around the entire silhouette. Semi-flat shading, two tones per surface, one soft highlight. Palette: royal blue #4F8CFF, sky blue #9CC5FF, deep navy #16304F, cream #F7F2E6, small coral accent #FF7A59. Modern friendly SaaS illustration style. No text. Centered, fills 80% of the square. Isolated on a uniform pure green #00FF00 background, flat color only, no shadows, no gradients, no vignette.

Only `{subject}` changes. Never drop the outline, palette or background sentences — they carry the coherence.

## Pipeline

1. Generate into `revisions/<id>/stickers-src/raw-<n>-<name>.png` (green background).
2. Key out the green: `ffmpeg -i raw.png -vf "colorkey=0x00FF00:0.26:0.10,despill=type=green,format=rgba" stickers/<name>.png`.
3. Normalize to 640×640 (hero size ceiling — the film renders stickers at ≤470 px).
4. Verify: alpha channel must have `min === 0` (really transparent) and the contact sheet must look like one family.
5. `stickers-src/` is scratch — delete it before committing; keep only keyed PNGs and their contact sheet.

## Budget rules (owner's instruction)

- **Maximum 10 new stickers per session.** Plan the set before generating; reuse existing stickers (mini versions as pill icons) before making new ones.
- **Old stickers must be deleted** when a revision supersedes them: a revision's `stickers-src/` always goes; keyed stickers from abandoned revisions go with the revision. The active revision keeps exactly the stickers it uses — no private museum.
- The current committed set (10/10 used this session): key, app, shield, server, check, database, padlock, rotate, warning, rocket.

## Usage rules in films

- Stickers are the story; text pills only label them. One hero sticker per beat.
- Stickers pop (`back.out`) exactly on the narration beat that names them; pulses are small (≤1.12) and rare.
- Die-cut outline + `drop-shadow` seats them on the dark board — never place them on light panels.
