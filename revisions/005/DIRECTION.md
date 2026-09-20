# 005 — “API keys — hook cut”

Portrait 1080×1920, 64 s, 30 fps, six long narration beats, gaps only 0.38 s, playback ×1.12.

## Owner feedback this revision answers

1. **Voice**: faster, longer sentences, shorter gaps (Fish Audio requested; key supplied but had no API credit — HTTP 402 — so the approved pipeline voice was sped up with `atempo=1.12` and the pacing rules were applied; `scripts/narrate-fish.mjs` + `narration-script.json` switch to Fish the moment credit exists).
2. **The opening must hook** — never an empty stage: the film cold-opens on a **blurred, drifting world of sticker ghosts** with a sharp title; the key snaps into focus on “…they are called API keys” (5.1 s), then three promise pills answer “in the next minute you will know…”.
3. **Blur instead of emptiness**: out-of-focus stickers carry the first 13 seconds; blur = focus, not blankness.
4. **Stop dealing points one by one**: ambient motion — ghost drift, request/response packets shuttling on the flow line, tilt-wobble on rule 1, spin on the rotate sticker.
5. **Varied, faster transitions**: fast pan (0.55 s, 24.7 s), **dip-to-dark in-place swap** (34.25–35.25 s, no visible travel), **zoom-punch** into the rotate sticker (44.40 s, ×1.9) with the swap at the dip peak; camera life continues after the punch (z 1.9 → 1.12).

## Beat map (starts are the measured audio ins)

| Beat | Start | Length | Visual |
| --- | --- | --- | --- |
| 1 | 0.95 | 13.40 | hook: ghosts + title + sub; key pops 5.1; promises 8.4/9.6/10.8; ghosts fade 13.3 |
| 2 | 14.79 | 10.19 | two jobs: chip-who 19.7, chip-what 20.7, trio pulse 23.0 |
| 3 | 25.42 | 8.62 | flow: fast pan 24.70; app 25.75; header 27.2; packets; server/check slam 29.3/30.7; data 33.2 |
| 4 | 34.49 | 9.76 | dip-to-dark swap 34.6; rules land tilted 35.9/39.6/41.9; rotate spins 42.1 |
| 5 | 44.69 | 8.51 | zoom punch 44.40; warning falls 45.7; leak struck 47.3; acts 47.35/49.0/50.3 |
| 6 | 53.63 | 7.21 | cycle 53.95 + word pulses; rocket 58.9; end 64.0 |

## Validation

Lint 0/0 · browser tests 6/6 · Hyperframes check PASS, zero warnings (motion 300 samples, contrast, layout at 12 times) · rendered + artifact-verified. Seek-determinism hardening this round: no zero-duration `TL.set` for camera swaps (`.001` tweens instead), no CSS+GSAP rotation on `#boring`, identity-matrix canonicalization in the test signature.
