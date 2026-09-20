# 008 — “Google AI Studio — always-moving cut” (owner rework)

Portrait 1080×1920, 79 s, 30 fps, six beats (audio reused from 007), narrative unchanged.

## Owner notes that drove this revision

1. “Na konci je několik sekund ticha a nelíbí se mi” → narration beat 6 now ends at 77.75 s;
   the film cuts at 78.9 s — no silent tail.
2. “Nelíbí se mi že to vždy přesuneš a pak se to nehýbe” → the camera never rests: slow
   push-ins run through every station, travels happen during narration, and every element
   has its own life loop (breathing paper, floating sketches, gauge shimmer, code pulse).
3. “Libí se mi zoomování” → each station gets a distinct zoom level (1.06 → 1.115 → 1.1 →
   1.13 → 1.16 → 1.19 at the launch), so stations are not interchangeable.
4. “Ne stejný panely s body” → two surface families: cream **paper panels** (gridded,
   corner-folded, breathing) and the dark board. Panels vary in size (1560×1960, 1900×2300,
   520×560 card) and mix with chalk stations.
5. “Hrozně moc zakulacené, nelíbí se mi jejich styl” → rounded pills are retired. New
   **field-note tags**: cream rectangles (10 px radius) with a coral pin dot, IBM Plex Mono
   hand-set look.
6. “Pod obrázkem nechci název” → hook photo has no caption.
7. Stickers: new locked style — **pencil-sketch field-notes lines** (reference: blue-graphite
   anatomy construction sketch). Two tints per subject: chalk-blue `#bcd6f4` on dark board,
   ink-navy `#1d3a5f` on paper (luminance→alpha keying, never green).
8. “Přesné centrovaní” → hero sketches are optically centered in panels; titles span panel
   width; tags align to a common baseline per station.

## Stations

A hook (topic-first lockup, morphing shape, real photo, promise tags, dip at ~13.5 s) →
B cream paper “One browser tab” (ink chat-bubble + hand-drawn arrows) → C dark board
“Steer the model” (chalk sliders + notes + animated temperature gauge) → D big cream paper
“Feed it anything” (ink photo + media, a document that **draws itself** via SVG dashoffset,
arc captions) → E dark board “Build with words” (chalk wand = build-with-words, cream app
card with phone + typing code lines, glow preview, “your code, your key”, prompt→feed→build
tape strip, rocket launch under the closing push-in).

## Sticker set (new style, 10 subjects)

chatbubble, sliders, wand, photo, document*(retired — house SVG drawn on screen instead)*,
media, star, app, rocket, key. Line tints ×2 (chalk/ink); raws deleted after verification.
Source raws generated this session: 11 (document regen hit the per-turn image cap and was
replaced by the self-drawing SVG — owner-approved direction: “různé typy panelů”).

## Validation

Lint 0 err / 1 advisory (file length, intentional) · browser tests 6/6 · HyperFrames check
PASS zero warnings (motion 300 samples, layout 25×, contrast incl. paper frames) ·
rendered + artifact-verified (ffprobe + decoded frames vs page seeks).
