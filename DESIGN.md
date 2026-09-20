# Blackboard — motion study 001

## Brief
Neutrální motion demo schválené uživatelem. Jedna tmavá 2D plocha s tečkovaným rastrem, čtyři UI panely v prostoru, nepřerušené přelety kamery. Pracovní obsah fiktivní aplikace Noda; všechna čísla jsou ilustrativní. Bez hlasu a bez hudby. Širokoúhlý formát 1920 × 1080, 24 sekund, 30 fps.

## Design direction
Grafitový pracovní prostor s precizními hranami, měkkou typografií a jedním limetkovým akcentem. Inspiration: OpenDesign / design-systems/linear-app/DESIGN.md. Adaptace, nikoli kopie značky Linear: vlastní identita Blackboard a demonstrační Noda. Rozvržení zůstává jednoduché a technické, s otevřeným negativním prostorem mezi panely a jemnou trasou kamery.

## Tokens
- Canvas: #111512
- Application shell: #101210
- Panel: #191d19
- Raised surface: #222722
- Border: #353d34
- Primary text: #f1f4ec
- Secondary text: #b0b9ac
- Accent: #d3f99a
- Secondary scene markers only: #c0b6e9 / #a9cbdc / #e6c2a6
- Typography: Inter Variable, IBM Plex Mono. Font files embedded locally.
- Radius: 8–14 px for studio; 16–24 px at video-native scale.

## Spatial contract
World: 4400 × 2800 logical pixels.
Four panels:
1. Overview: (240, 520), 1340 × 840
2. Workflow: (2540, 420), 1340 × 840
3. Analytics: (2780, 1740), 1340 × 840
4. Detail: (420, 1820), 1340 × 840

Camera = center x, center y, zoom. Separate translation and zoom rigs. No perspective, 3D rotation, scene cuts or crossfading whole panels. Dot grid tracks camera coordinates.

## Motion
0–1.7 s: full board, establish shared space.
1.7–3.5 s: arrive at overview.
3.5–6 s: overview metrics and graph reveal.
6–8.1 s: lateral pull-out / flight / push-in to workflow.
8.1–11.2 s: connected nodes illuminate in sequence.
11.2–13.4 s: diagonal flight to analytics.
13.4–16.4 s: chart draws, bars rise.
16.4–18.7 s: return leftward to detail.
18.7–21.5 s: checklist resolves, progress ring fills.
21.5–23.4 s: pull back to full board.
23.4–24 s: hold, ready for a seamless restart.

Camera: power3.inOut for translation; sine.inOut for pull-out/push-in. UI reveals use expo.out, power2.out and restrained back.out, with differentiated durations. All render-critical animation lives in one paused, seekable GSAP timeline registered for Hyperframes.

## Avoid
No glassmorphism, giant gradients, 3D tilts, excessive glow, random particles, remote assets or timer-driven render state. No audio until a sound direction is chosen. No claims that mock UI statistics are real.

## Sources used
- OpenDesign: https://github.com/nexu-io/open-design
  - design-systems/linear-app/DESIGN.md
  - design-templates/hyperframes/references/motion-principles.md
  - design-templates/hyperframes/house-style.md
- Hyperframes: https://github.com/heygen-com/hyperframes
  - skills/hyperframes-core + hyperframes-animation + hyperframes-cli

Downloads are in ../vendor/. These are sparse source checkouts, not an installed OpenDesign desktop application. Hyperframes CLI is installed and pinned in package.json.
