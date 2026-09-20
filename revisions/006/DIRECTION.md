# 006 — “API keys — cross-fade cut” (hook v2)

Portrait 1080×1920, 64 s, 30 fps, six long beats (×1.12), full cross-fade editing.

## Hook v2 — owner's correction

Owner on hook v1: “ten začátek je hrozný, vůbec jsi nepochopil — na začátku je to moc prázdné a hned musí být jasné o čem to bude; text klidně, moderně, a v pozadí random zajímavý tvar jako design; plus jeden skutečný obrázek z netu, který k tomu fakt souvisí; pak se to ztmaví a vrátíme se do prezentace.”

Hook v2 delivers exactly that:

1. **Frame zero = the topic.** Kicker “THE 60-SECOND EXPLAINER”, huge gradient lockup **“API Keys”**, subline “what they are • how they work • how they leak” — readable at 0.0 s, it only settles (y-drift), never fades in.
2. **Generative shape as the backdrop**: an SVG blob (two morphing paths + dashed orbit ring + a travelling dot) drifts, rotates and slowly morphs through three shapes across the whole hook. No empty dots-only stage anywhere.
3. **A real photo from the web**: a circuit-board key (Vecteezy stock, saved to `photo/api-key-circuit.png`, 32 KB) pops on “…they are called API keys” (5.1 s), tilts −3°, captioned “an API key, in the wild”.
4. **Promise pills** (8.4 / 9.6 / 10.8 s) answer the teaser while the shape keeps moving.
5. **The dip** (owner's request): hook elements fade, the screen goes dark (~13.95 s), and the presentation returns out of the dark — title “Two jobs, one string” + the key sticker.

Everything after the hook is untouched from the validated cross-fade cut: three cross-dissolves, packet motion, tilted rule cards, leak/recovery, cycle + rocket.

## Photo attribution

Hook photo: “Digital key with a futuristic design, circuit patterns, glowing blue accents” — Vecteezy (vecteezy.com/free-png/cyber-security-keys), found via image search for this project. Local copy only, no hotlinking; used as an illustrative editorial prop inside the film.

## Cleanup status (owner's standing order)

Executed at session start, before authoring: vendor clones (−35 MB), all QA scratch, generated compositions, superseded media. Videos no longer live in the repo at all (sources + docs only); the workspace holds exactly one current MP4. Git history kept as a single squashed commit.

## Validation

Lint 0/0 · browser tests 6/6 · Hyperframes check PASS zero warnings (motion 300 samples, layout 22 times incl. the dip-dark frame, contrast) · rendered + artifact-verified.
