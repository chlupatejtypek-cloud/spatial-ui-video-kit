# 003 — changes against 002

- First narrated film: four measured English voice-over clips on track 2, starts 0.8 / 12.6 / 24.8 / 39.1 s.
- Portrait 1080×1920 output (config-driven; 002 stays landscape as an example).
- Accent moved from lime to a calmer blue (`#71a8ff` on deep navy) per user feedback (“moc zelené”).
- Two-viewport shared world: camera pans left/right between stages instead of four dashboard stops.
- In-place content replacement: scenes 1→3 and 2→4 retire while the camera crosses.
- Generic `film.config.json` + `scripts/build-film.mjs` + `scripts/test-film.mjs` replace per-revision scripts; `--rev` selects the film.
- Old renders, the interactive studio HTML and v001 team screenshots were deleted to respect workspace storage limits.
