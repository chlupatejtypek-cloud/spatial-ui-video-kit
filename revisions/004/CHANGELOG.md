# 004 — changes against 003

- New **sticker art style** replaces stroke icons: coherent die-cut set (cream outline, blue palette, coral accents), generated with one locked prompt template (`STICKER_STYLE.md`), keyed to transparency, ≤10 new stickers per session with mandatory cleanup of superseded sets.
- **Beat-level synchronization**: nine short narration clips drive the timeline; every sticker/pill pop lands on the measured start of the sentence that names it, with word-level pulses.
- **One-way camera path** A→B→C→D (right, down, right): no return travel, so retired scenes can never be seen again — fixes “old UI visible when coming back”.
- Bigger elements: 470 px hero key, 260 px flow stickers, 190 px rule stickers, 92 px pills; text reduced to short labels.
- No repeated scene content: identity → request flow → safety rules → leak recovery → cycle + rocket finale.
- Builder now copies `revisions/<id>/stickers/` into the composition; mini sticker icons in pills use CSS backgrounds to avoid duplicate-media lint warnings.
- Rocket launch uses an absolute `gsap.set` baseline and absolute tweens (no repeated `fromTo`, no relative `y` strings) for seek determinism.
- Audio slot lengths corrected from the Hyperframes runtime measurements (ffprobe reports ~60 ms of MP3 encoder padding extra).
