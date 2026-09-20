// Google AI Studio — one paused, seek-safe timeline. All values absolute.
// HOOK (0–14): topic-first lockup readable from frame zero (it only settles),
// a generative shape morphs behind it, the real photo pops on its sentence,
// promise pills answer the teaser, then the screen dips to dark and the
// presentation returns. Scene changes stay cross-dissolves with gliding camera.
gsap.registerPlugin(MotionPathPlugin);

const camera = { x: 540, y: 960, z: 1 };
const world = document.getElementById('world');
function applyCamera() {
  world.style.transform = `translate(${540 - camera.x * camera.z}px, ${960 - camera.y * camera.z}px) scale(${camera.z})`;
}
gsap.set(camera, { x: 540, y: 960, z: 1, onUpdate: applyCamera });
applyCamera();
gsap.set('#st-rocket', { opacity: 0, x: 0, y: 60, rotation: 0 });
gsap.set('#thermo-fill', { scaleY: 0, svgOrigin: '100 240' });
gsap.set('#code-block i', { scaleX: 0 });
gsap.set('#orbit-dot', { opacity: 1, cx: 770, cy: 320 });

const TL = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });
window.__timelines = window.__timelines || {};

function fade(sel, t, d = .6) {
  TL.fromTo(sel, { opacity: 0, scale: 1.035, transformOrigin: '50% 50%' },
    { opacity: 1, scale: 1, duration: d, ease: 'power1.out' }, t);
}
function pop(sel, t, d = .5) {
  TL.fromTo(sel, { opacity: 0, scale: 0, rotation: -8, transformOrigin: '50% 60%' },
    { opacity: 1, scale: 1, rotation: 0, duration: d, ease: 'back.out(2)' }, t);
}
function rise(sel, t, d = .5) {
  TL.fromTo(sel, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: d, ease: 'back.out(1.6)' }, t);
}
function pulse(sel, t, amount = 1.06) {
  TL.to(sel, { scale: amount, duration: .2, ease: 'sine.inOut' }, t)
    .to(sel, { scale: 1, duration: .24, ease: 'sine.inOut' }, t + .2);
}
function dissolve(scope, t, d = .8) {
  TL.to(`${scope} .retire`, { opacity: 0, duration: d, stagger: .04, ease: 'power1.inOut' }, t);
}
function glide(cam, t, d = 1.05) {
  TL.to(camera, { ...cam, duration: d, ease: 'power1.inOut', onUpdate: applyCamera }, t);
}

// ── HOOK (0–14) ───────────────────────────────────────────────────────
// topic first: the lockup is fully readable from frame zero, it just settles
TL.fromTo('#hook-kicker', { y: 14 }, { y: 0, duration: .45 }, 0.1);
TL.fromTo('#hook-title', { y: 30 }, { y: 0, duration: .6, ease: 'power2.out' }, 0.25);
TL.fromTo('#hook-sub', { y: 18 }, { y: 0, duration: .5 }, 0.6);

// the generative shape: continuous morph + slow rotation for the whole hook
TL.to('#blob-main', { attr: { d: 'M 660 480 C 880 400 1080 560 1030 760 C 980 960 1140 1080 1000 1240 C 860 1400 640 1420 540 1240 C 440 1060 600 960 540 800 C 480 640 460 560 660 480 Z' }, duration: 4.8, ease: 'sine.inOut' }, 0.35);
TL.to('#blob-main', { attr: { d: 'M 720 400 C 920 400 1040 540 1000 740 C 960 940 1100 1060 1020 1240 C 940 1420 680 1360 580 1200 C 480 1040 540 920 520 760 C 500 600 540 400 720 400 Z' }, duration: 4.8, ease: 'sine.inOut' }, 5.2);
TL.to('#blob-main', { attr: { d: 'M 700 420 C 900 380 1060 520 1020 720 C 980 920 1120 1040 1010 1220 C 900 1400 660 1380 560 1220 C 460 1060 560 940 520 780 C 480 620 520 460 700 420 Z' }, duration: 2.8, ease: 'sine.inOut' }, 10.2);
TL.to('#blob-echo', { attr: { d: 'M 720 400 C 920 400 1040 540 1000 740 C 960 940 1100 1060 1020 1240 C 940 1420 680 1360 580 1200 C 480 1040 540 920 520 760 C 500 600 540 400 720 400 Z' }, duration: 4.8, ease: 'sine.inOut' }, 0.55);
TL.to('#blob-echo', { attr: { d: 'M 700 420 C 900 380 1060 520 1020 720 C 980 920 1120 1040 1010 1220 C 900 1400 660 1380 560 1220 C 460 1060 560 940 520 780 C 480 620 520 460 700 420 Z' }, duration: 4.6, ease: 'sine.inOut' }, 5.6);
TL.to('#blob-spin', { rotation: 9, svgOrigin: '770 880', duration: 13, ease: 'none' }, 0.35);
TL.to('#blob-orbit', { rotation: -22, svgOrigin: '770 880', duration: 13, ease: 'none' }, 0.35);
// a small dot travels the orbit ring: four laps
TL.to('#orbit-dot', { attr: { cx: 770, cy: 1440 }, duration: 3.0, ease: 'sine.inOut' }, 0.9)
  .to('#orbit-dot', { attr: { cx: 340, cy: 880 }, duration: 3.0, ease: 'sine.inOut' }, 4.05)
  .to('#orbit-dot', { attr: { cx: 770, cy: 320 }, duration: 3.0, ease: 'sine.inOut' }, 7.2)
  .to('#orbit-dot', { attr: { cx: 1200, cy: 880 }, duration: 3.0, ease: 'sine.inOut' }, 10.35);

// “It's called Google AI Studio” — the real photo lands
pop('#hook-photo', 5.2, .55);
TL.to('#hook-photo', { rotation: -3, duration: .8, ease: 'sine.inOut' }, 5.9);
TL.fromTo('#hook-photo figcaption', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .45 }, 6.1);

// the promise, one pill per clause
rise('#promise-1', 8.6);
rise('#promise-2', 9.8);
rise('#promise-3', 11.0);
pulse('#hook-title', 8.6, 1.03);

// ── the dip: hook fades, screen goes dark, presentation returns ───────
TL.to('#hook-lockup', { opacity: 0, y: -24, duration: .5, ease: 'power2.in' }, 12.65);
TL.to('#hook-photo', { opacity: 0, scale: .97, rotation: -6, duration: .5, ease: 'power2.in' }, 12.7);
TL.to('#scene-a .minipill', { opacity: 0, y: -14, duration: .4, stagger: .05, ease: 'power2.in' }, 12.75);
TL.to('#orbit-dot', { opacity: 0, duration: .3 }, 12.9);
TL.to('#blob-spin', { opacity: 0, duration: .4 }, 12.9);
TL.to('#blob-orbit', { opacity: 0, duration: .4 }, 12.9);
TL.to('#dip', { opacity: 1, duration: .35, ease: 'power1.in' }, 13.15);  // dark at ~13.5
TL.to('#dip', { opacity: 0, duration: .45, ease: 'power1.out' }, 13.6);  // out of the dark

// ── Beat 2 (13.74–25.19): the presentation — one browser tab ──────────
fade('#title-a', 13.8, .55);
pop('#st-chatbubble', 14.55, .55);
pulse('#st-chatbubble', 18.0, 1.05);
fade('#chip-who', 19.9);
fade('#chip-what', 21.1);
pulse('#st-chatbubble', 23.3, 1.04);
pulse('#chip-who', 23.42, 1.05);
pulse('#chip-what', 23.54, 1.05);

// ── Cross-dissolve 1 (24.85–26.9): glide right while A melts into B ───
glide({ x: 1620, y: 960 }, 24.85, 1.05);
TL.to('#board-a .retire, #title-a', { opacity: 0, duration: .85, stagger: .04, ease: 'power1.inOut' }, 25.05);
TL.fromTo('#title-b', { opacity: 0, scale: 1.04, transformOrigin: '50% 50%' },
  { opacity: 1, scale: 1, duration: .7, ease: 'power1.out' }, 25.6);

// ── Beat 3 (25.57–37.95): steer the model ─────────────────────────────
pop('#st-sliders', 26.2);
pulse('#st-sliders', 28.5, 1.04);
fade('#sys-pill', 29.8);
TL.to('#thermo', { opacity: 1, duration: .4 }, 32.7);
TL.to('#thermo-fill', { scaleY: .62, duration: .9, ease: 'power1.inOut' }, 32.9);
fade('#temp-pill', 32.9);
TL.to('#thermo-fill', { scaleY: .28, duration: .9, ease: 'power1.inOut' }, 34.4);
pop('#st-thinking', 36.0);
fade('#thinking-pill', 36.3);

// ── Cross-dissolve 2 (38.0–40.05): glide down while B melts into C ────
glide({ x: 540, y: 2640 }, 38.0, 1.05);
dissolve('#scene-b', 38.15, .85);
TL.fromTo('#title-c', { opacity: 0, scale: 1.04, transformOrigin: '50% 50%' },
  { opacity: 1, scale: 1, duration: .7, ease: 'power1.out' }, 38.75);

// ── Beat 4 (38.33–52.37): feed it anything ────────────────────────────
pop('#st-photo', 40.5);
pop('#st-document', 41.3);
pop('#st-media', 42.9);
pop('#st-branch', 43.5);
rise('#cap-1', 45.5);
rise('#cap-2', 47.3);
rise('#cap-3', 49.2);
pulse('#st-photo', 50.1, 1.05);
pulse('#st-document', 50.3, 1.05);
pulse('#st-media', 50.5, 1.05);

// ── Cross-dissolve 3 (52.2–55.0): zoom into the set, glide out to D ───
glide({ x: 290, y: 2885, z: 1.9 }, 52.2, 1.35);
dissolve('#scene-c', 52.35, .85);
glide({ x: 1620, y: 2640, z: 1.18 }, 53.85, 1.15);

// ── Beat 5 (52.75–65.69): build with words ────────────────────────────
fade('#title-d', 53.95);
pop('#st-loop', 54.6);
rise('#st-app-phone', 55.8, .6);
fade('#code-block', 56.1, .5);
TL.to('#code-line-1', { scaleX: 1, duration: .45, ease: 'power1.inOut' }, 56.3);
TL.to('#code-line-2', { scaleX: 1, duration: .45, ease: 'power1.inOut' }, 56.9);
TL.to('#code-line-3', { scaleX: 1, duration: .45, ease: 'power1.inOut' }, 57.5);
TL.to('#preview-glow', { opacity: .5, duration: .3 }, 59.2);
TL.fromTo('#preview-glow', { scale: .96, transformOrigin: '50% 50%' }, { scale: 1.02, duration: .5, ease: 'sine.out' }, 59.2)
  .to('#preview-glow', { scale: 1, duration: .4, ease: 'sine.inOut' }, 59.7);
TL.to('#st-loop', { rotation: 360, duration: .9, ease: 'power1.inOut', svgOrigin: '1665 2495' }, 61.4);
fade('#key-pill', 64.5, .5);

// ── Beat 6 (66.07–77.75): the loop, then launch ───────────────────────
rise('#cycle-pill', 66.3);
pulse('#cycle-pill', 67.7, 1.03);
pulse('#cycle-pill', 68.6, 1.03);
pulse('#cycle-pill', 69.9, 1.03);
pulse('#title-d', 71.9, 1.04);
TL.to('#st-rocket', { opacity: 1, duration: .15 }, 76.7);
TL.fromTo('#st-rocket', { x: 0, y: 60, rotation: 0 }, { x: 150, y: -320, rotation: 8, duration: 1.0, ease: 'power2.in' }, 76.95);
TL.to('#st-rocket', { y: -336, duration: .75, ease: 'sine.inOut' }, 78.0);

// ── camera life: slow drifts, never overlapping the glides ────────────
glide({ z: 1.015 }, 1.2, 6.8);
glide({ z: 1.005 }, 8.6, 4.2);
glide({ z: 1.02 }, 14.3, 7.2);
glide({ z: 1.012 }, 21.9, 2.6);
glide({ z: 1.025 }, 26.5, 8.6);
glide({ z: 1.03 }, 35.9, 1.8);
glide({ z: 1.028 }, 39.6, 8.2);
glide({ z: 1.032 }, 48.6, 3.2);
glide({ z: 1.155 }, 55.3, 5.5);
glide({ z: 1.148 }, 61.6, 4.2);
glide({ z: 1.156 }, 66.6, 6.4);
glide({ z: 1.162 }, 73.6, 2.2);
glide({ z: 1.175 }, 76.95, 0.95);

window.__timelines['motion-007'] = TL;
