# Video style — standing preferences

Preferences of the video owner. Apply them to every new film unless explicitly overridden. (Původní pokyny byly česky; dokument je anglicky, aby jej přečetl kterýkoliv agent.)

## Output
- Deliver a **finished MP4** and open it directly. Editors, HTML, studios and QA tooling stay internal; never present them as the result.
- Keep editable sources so further revisions are cheap.
- Portrait 1080×1920 is preferred for short explainers; landscape 1920×1080 stays available — both are config values, not code changes.

## Look
- **Sticker art style (locked since 004):** coherent die-cut sticker set — cream outline, royal-blue palette, coral accents; see `revisions/004/STICKER_STYLE.md` for the exact template. Stickers are the story; text pills only label them. Max 10 new stickers per session; old sets are deleted.
- One dark 2D surface with a subtle dotted grid; all UI lives in one coordinate space.
- Camera = pan + zoom between viewports of that world. No perspective, no 3D spins, no independent slides.
- Restrained surfaces and typography. Accent color per film (002: lime, 003: calm blue); the accent has a job, it is not decoration. Default to the calmer blue unless told otherwise.
- **No branding**: no tool logos, no corner marks, no “Noda”, no scene numbers, no captions outside panels, no slogans, no app navigation or breadcrumbs. Add branding only on explicit request.
- Keep text only where it helps comprehension; one clear idea per panel beats a crowded dashboard.

## Attention direction
1. **Cold-open hook (final form, 006):** the topic must be unmistakable from frame zero — modern text lockup (kicker, huge gradient title, subline “what • how • what-if”), visible immediately, only settling. Over it lives a *generative shape* (morphing SVG blob, orbit ring, travelling dot) so the stage never feels empty — no bare dots, no blurred blobs of UI pretending to be content.
2. **One real photo from the web** that genuinely matches the topic lands on the sentence that names it (photo saved locally, attributed in the revision's DIRECTION.md).
3. State the promise early (three short pills), then pay it off beat by beat. When the hook ends, the screen dips to dark and returns into the presentation.
2. One active idea at a time; everything else is calm context.
3. Hand attention over with connected motion: item → signal → next component; curve → its end → result.
4. **Sync to the voice, exactly:** short narration beats; the visual named by a sentence pops at that sentence's measured start. Word-level pulses land on the word. Camera moves sit in the pauses between beats.
4. The camera follows a story; it does not tour equally sized windows on a fixed beat.
5. **Keep the world alive**: drifting backdrops, packets on connector lines, small tilt-wobble — motion everywhere beats a new point every second.
6. Panel sizes and aspect ratios may change; old panels retire, make room, or turn into new ones. Never stack stale content.
7. Rhythm comes from the action (or the narration): short connective moves, longer developments, calm pauses to read. No metronome timing.
8. **Cross-fade editing is the default (owner, since 006):** scenes melt into each other — outgoing content fades while the camera glides on one continuous path and the incoming scene fades in. No hard cuts, no dip-to-black, no camera jumps. Pans 1.0–1.2 s soft in-out; a zoom may resolve by *gliding back out*, never by swapping in the dark. (005's punch/dip tricks are retired unless explicitly requested.)

## Animation cleanliness
- No random blinking, no sudden re-highlighting of a finished curve, no competing counters, tooltip bursts or exaggerated bounce (one small back-out on a key ring is acceptable).
- Curves keep constant width and color and reveal continuously. If a tip leads a curve, it must follow the exact same geometry at the same progress.
- Component-to-component transitions must be spatially continuous. When swapping DOM elements, match position, size, color and the switch frame.
- GSAP normalized SVG strokes (`pathLength=1`) always use `autoRound:false` — otherwise dash offsets get pixel-rounded and the draw visibly snaps.
- Verify sequences by seeking forwards, backwards and mid-times, and by inspecting the decoded MP4 — never by a single end-state screenshot.

## Narration
- **Longer sentences, few gaps, faster delivery** (owner, since 005): ~6 beats for a minute, ≈0.38 s between clips, `atempo≈1.12` on the fallback voice.
- Target voice: **Fish Audio** (`scripts/narrate-fish.mjs`, model `s2-pro`); regenerate with it once the key has credit, then re-measure and update the config.
- Short, concrete sentences; one thought per clip; generate per-scene chunks, measure them, and derive scene timing from the measured lengths.
- English voice for current films; keep clips committed under `revisions/<id>/audio/`.
- The picture should carry the explanation even with the sound off.

## Ethics & safety
- All UI data is illustrative; security topics (e.g. API keys) are explained with generic good practice, never with real credentials.
- No public upload of the user's videos, no cloud render services, no analytics, no paid APIs.
