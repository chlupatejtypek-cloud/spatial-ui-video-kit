# 005 — changes against 004

- **Pace**: six long sentences (was nine short), gaps 0.55 s → 0.38 s, playback ×1.12; film 64 s.
- **Cold-open hook**: blurred drifting sticker ghosts + sharp title from frame zero; the key un-blurs on “…they are called API keys”; three promise pills (“what they are / how they work / how they leak”) — no empty stage anywhere.
- **Blur as focus**: ghosts return only as backdrop and fade when the explanation starts.
- **Ambient motion instead of point-dealing**: packet dots shuttle on the request/response lines, rule stickers land tilted and wobble, the rotate sticker spins.
- **Varied transitions**: fast pan (0.55 s), dip-to-dark in-place scene swap, zoom-punch (×1.9) into a sticker with the swap at the dark peak; pans are ~40% faster than 004.
- **Fish Audio prepared**: `scripts/narrate-fish.mjs` + `narration-script.json`; the supplied key returned HTTP 402 (no API credit), so the approved pipeline voice ×1.12 shipped and the switch is one command once credit is added.
- Determinism hardening: camera swaps as 1 ms tweens (zero-duration `set` is not seek-reliable), GSAP owns every transform, identity matrices canonicalized in tests.
