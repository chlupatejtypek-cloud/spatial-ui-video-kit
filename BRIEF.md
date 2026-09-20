---
workflow: general-video
flow: companion
---
# Spatial UI video kit — current state

User: Czech speaker. Deliverable is always a FINISHED MP4 opened directly in the video viewer; HTML/GSAP/Hyperframes/OpenDesign stay internal. The repo doubles as a public how-to so any next agent can reproduce the pipeline.

## Standing user decisions
- Videos may be portrait (1080×1920) or landscape; portrait preferred for explainers. Both are config-driven (`revisions/<id>/film.config.json`).
- Style: calm blue accent now (the lime read as “too green”); no branding, no slogans, no scene numbers; sparse panels; one attention target; replaced-in-place scenes; irregular rhythm; clean continuous reveals (no abrupt emphasis).
- Storage: delete old videos and scratch files proactively; keep exactly one current MP4 in exports/.
- No public upload of videos, no cloud services, no paid APIs.

## House rules (owner, latest)
- **Cleanup first, always**: before generating anything new, delete every superseded video, sticker set, narration audio, QA keyframe and composition. Media lives in git history.
- **Keep the GitHub repo updated** throughout, not only at the end.
- **Cross-fade editing** is the default look: panels melt into each other with overlapping fades on a continuous camera path; no hard cuts/dips.

## Revision 006 (current): “API keys — cross-fade cut”
Answers “předtim byla videa prolinavejsi”. All three scene changes are cross-dissolves (outgoing fade 0.85 s + camera glide 1.05–1.2 s + incoming fade); zoom resolves by gliding out. Hook v2 (owner-corrected): text-first lockup “API Keys” readable from frame zero, morphing generative SVG shape behind it, a real web photo (circuit key, attributed) landing on “…they are called API keys”, promise pills, then a dip to dark back into the presentation. Cross-fade editing, beat-sync (6 beats ×1.12), packets/tilt ambient motion, sticker set reused (0 new stickers). Output `exports/api-keys-crossfade-cut.mp4` (delivered, artifact-verified). Videos no longer live in the repo; the workspace holds exactly one current MP4. Direction: `revisions/006/DIRECTION.md`. Git history was reset to one commit after delivery to keep the repo small; media of superseded revisions lives nowhere by design (regenerable).

## Revision 005: “API keys — hook cut”
Owner feedback on 004: hook is missing (opening too empty), too many single points dealt one by one, transitions should vary and pan faster, voice must be faster with longer sentences and short gaps — via Fish Audio. Locked decisions: cold-open hook over a blurred living world (never empty), blur-as-focus, ambient motion (packets, drift, wobble) instead of serial points, three transition types (fast pan / dip-to-dark swap / zoom-punch), 6 long beats at 0.38 s gaps ×1.12. **Fish Audio key supplied but has no API credit (402)** → fallback voice ×1.12 shipped; `scripts/narrate-fish.mjs` + `narration-script.json` switch to Fish once credit exists (then re-measure config). Output `exports/api-keys-hook-cut.mp4`. Direction: `revisions/005/DIRECTION.md`.

## Revision 004: “API keys — sticker story”
Owner's verdict on 003: ugly key icon, everything too small, stale UI visible on camera returns, repetitive scenes, weak sync. Locked decisions: **sticker art style** (die-cut set, one template, max 10 stickers/session, superseded sets deleted — `revisions/004/STICKER_STYLE.md`), **one-way camera** A→B→C→D (never returns; scenes retire while the camera leaves), **beat-level sync** (nine measured narration beats; visuals pop exactly on their sentence; word-level pulses), larger elements (470 px hero). Output `exports/api-keys-sticker-story.mp4`. Direction: `revisions/004/DIRECTION.md`.

## Revision 003: “API keys explained”
Portrait 1080×1920, 52 s, 30 fps, four English narration chunks (0.8 / 12.6 / 24.8 / 39.1 s), blue `#71a8ff` accent, two-viewport world with horizontal camera pans. Scene 1 identity → scene 2 request flow → scene 3 safety rules (replaces 1) → scene 4 leak/recovery + closing cycle (replaces 2). Sources: `revisions/003/src/`, config `revisions/003/film.config.json`, direction `revisions/003/DIRECTION.md`. Output: `exports/api-keys-explained.mp4`.

## Revision 002 (example, kept)
Silent landscape film (24 s, 1920×1080) demonstrating focus-led graph reveal, `autoRound:false` stroke draws and subpixel handoff. Deep QA in `scripts/qa-motion-002.mjs`.

## Publishing
Public GitHub repo **https://github.com/chlupatejtypek-cloud/spatial-ui-video-kit** created and pushed from this project with the user's token; the token must be revoked by the user after the upload. Token never written to disk, config or docs.

## Docs map
`AGENTS.md` golden rules · `README.md` repo guide · `docs/AGENT_GUIDE.md` full walkthrough + pitfall archive · `VIDEO_STYLE.md` standing style · `docs/SOURCES.md` tools/licenses.
