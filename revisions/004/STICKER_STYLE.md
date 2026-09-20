# Sticker style — locked (v2: field-notes sketch, owner-approved)

Owner replaced the die-cut cartoon style with a **pencil-sketch style** (reference: blue-graphite
anatomy construction sketch on cream paper). Hard style guide for every future generation.

## The style (one shared prompt template)

> Antique field-notes construction sketch of **{subject}**: expressive blue-graphite pencil
> lines, loose cross-hatching, a few stray construction and measure strokes around the subject,
> drawn on warm aged cream paper. Confident dark strokes, high contrast against the paper.
> No text, no letters, no numbers, no watermark. Subject centered, fills ~70% of the square.
> Even flat lighting, no shadows, no vignette, straight-on scan.

Only `{subject}` changes. Never drop the paper, hatching or no-text sentences.

## Pipeline (luminance → alpha, NOT green-key)

1. Generate into `revisions/<id>/stickers-src/raw-<n>-<name>.png` (cream paper).
2. **Line version** (for the dark board): alpha = darkness of each pixel
   (`a = clamp(((1 − L) − 0.10) / 0.55)`), tint everything to light chalk-blue `#bcd6f4`.
   Done with a sharp raw-pixel pass — the paper disappears completely, only strokes remain.
3. **Paper plate version** (for cream panels): the raw scan as-is, rounded corners via CSS.
4. Verify: line version must have `alphaMin === 0` (really transparent) and the contact sheet
   must read as one sketchbook; paper plates keep the paper tone uniform.
5. `stickers-src/` is scratch — delete it **only after** the keyed outputs are verified.

## Budget rules (owner's instruction)

- **Maximum 10 new stickers per revision batch.** Reuse minis (CSS `background-image`) before
  making new ones. Old-style stickers are deleted the moment a new style is locked.

## Usage rules in films

- Stickers are the story; text pills only label them. One hero sticker per beat, centered.
- Stickers pop exactly on the narration beat that names them; pulses are small and rare.
- On the dark board use line versions with a soft drop-shadow; on cream panels use paper plates.
