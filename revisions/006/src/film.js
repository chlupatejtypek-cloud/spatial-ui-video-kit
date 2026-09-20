// API keys — cross-fade cut, hook v2. One paused, seek-safe timeline.
// HOOK (0–14.3): the topic is clear from frame one — kicker + big "API Keys"
// lockup over a slowly morphing generative shape; the real photo pops on
// "…they are called API keys"; promise pills answer the teaser. Then the
// screen dips to dark (owner's request) and we land back in the presentation.
// Scene changes stay cross-dissolves; all values absolute (seek-safe).
gsap.registerPlugin(MotionPathPlugin);

const camera = { x: 540, y: 960, z: 1 };
const world = document.getElementById('world');
function applyCamera() {
  world.style.transform = `translate(${540 - camera.x * camera.z}px, ${960 - camera.y * camera.z}px) scale(${camera.z})`;
}
gsap.set(camera, { x: 540, y: 960, z: 1, onUpdate: applyCamera });
applyCamera();
gsap.set('#st-rocket', { opacity: 0, x: 0, y: 60, rotation: 0 });
gsap.set('#boring', { rotation: -5 });
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
function draw(sel, t, dur = .55) {
  TL.to(sel, { strokeDashoffset: 0, autoRound: false, duration: dur, ease: 'power1.inOut' }, t);
}
function dissolve(scope, t, d = .8) {
  TL.to(`${scope} .retire`, { opacity: 0, duration: d, stagger: .04, ease: 'power1.inOut' }, t);
}
function glide(cam, t, d = 1.05) {
  TL.to(camera, { ...cam, duration: d, ease: 'power1.inOut', onUpdate: applyCamera }, t);
}

// ── HOOK (0–14.3) ─────────────────────────────────────────────────────
// topic first: the lockup is fully readable from frame zero, it just settles
TL.fromTo('#hook-kicker', { y: 14 }, { y: 0, duration: .45 }, 0.1);
TL.fromTo('#hook-title', { y: 30 }, { y: 0, duration: .6, ease: 'power2.out' }, 0.25);
TL.fromTo('#hook-sub', { y: 18 }, { y: 0, duration: .5 }, 0.6);

// the generative shape: continuous morph + slow rotation for the whole hook
TL.to('#blob-main', { attr: { d: 'M 660 480 C 880 400 1080 560 1030 760 C 980 960 1140 1080 1000 1240 C 860 1400 640 1420 540 1240 C 440 1060 600 960 540 800 C 480 640 460 560 660 480 Z' }, duration: 4.6, ease: 'sine.inOut' }, 0.3);
TL.to('#blob-main', { attr: { d: 'M 720 400 C 920 400 1040 540 1000 740 C 960 940 1100 1060 1020 1240 C 940 1420 680 1360 580 1200 C 480 1040 540 920 520 760 C 500 600 540 400 720 400 Z' }, duration: 4.6, ease: 'sine.inOut' }, 4.9);
TL.to('#blob-main', { attr: { d: 'M 700 420 C 900 380 1060 520 1020 720 C 980 920 1120 1040 1010 1220 C 900 1400 660 1380 560 1220 C 460 1060 560 940 520 780 C 480 620 520 460 700 420 Z' }, duration: 4.2, ease: 'sine.inOut' }, 9.5);
TL.to('#blob-echo', { attr: { d: 'M 720 400 C 920 400 1040 540 1000 740 C 960 940 1100 1060 1020 1240 C 940 1420 680 1360 580 1200 C 480 1040 540 920 520 760 C 500 600 540 400 720 400 Z' }, duration: 4.6, ease: 'sine.inOut' }, 0.3);
TL.to('#blob-echo', { attr: { d: 'M 700 420 C 900 380 1060 520 1020 720 C 980 920 1120 1040 1010 1220 C 900 1400 660 1380 560 1220 C 460 1060 560 940 520 780 C 480 620 520 460 700 420 Z' }, duration: 4.6, ease: 'sine.inOut' }, 4.9);
TL.to('#blob-spin', { rotation: 9, svgOrigin: '770 880', duration: 13, ease: 'none' }, 0.3);
TL.to('#blob-orbit', { rotation: -22, svgOrigin: '770 880', duration: 13, ease: 'none' }, 0.3);
// a small dot travels the orbit ring (CSS positioning inside a rotated ellipse
// would fight GSAP, so the dot rides the same rotation via its own spin)
TL.to('#orbit-dot', { attr: { cx: 770, cy: 1440 }, duration: 3.35, ease: 'sine.inOut' }, 1.0)
  .to('#orbit-dot', { attr: { cx: 340, cy: 880 }, duration: 3.35, ease: 'sine.inOut' }, 4.4)
  .to('#orbit-dot', { attr: { cx: 770, cy: 320 }, duration: 3.35, ease: 'sine.inOut' }, 7.8)
  .to('#orbit-dot', { attr: { cx: 1200, cy: 880 }, duration: 2.8, ease: 'sine.inOut' }, 11.2);

// “…they are called API keys” — the real photo lands
pop('#hook-photo', 5.1, .55);
TL.to('#hook-photo', { rotation: -3, duration: .8, ease: 'sine.inOut' }, 5.75);
TL.fromTo('#hook-photo figcaption', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .45 }, 5.95);

// the promise, one pill per clause
rise('#promise-1', 8.4);
rise('#promise-2', 9.6);
rise('#promise-3', 10.8);
pulse('#hook-title', 8.4, 1.03);

// ── the dip: hook fades, screen goes dark, presentation returns ───────
TL.to('#hook-lockup', { opacity: 0, y: -24, duration: .5, ease: 'power2.in' }, 13.15);
TL.to('#hook-photo', { opacity: 0, scale: .97, rotation: -6, duration: .5, ease: 'power2.in' }, 13.2);
TL.to('#scene-a .minipill', { opacity: 0, y: -14, duration: .4, stagger: .05, ease: 'power2.in' }, 13.25);
TL.to('#orbit-dot', { opacity: 0, duration: .3 }, 13.3);
TL.to('#dip', { opacity: 1, duration: .45, ease: 'power1.in' }, 13.5);   // dark at ~13.95
TL.to('#blob-spin', { opacity: 0, duration: .4 }, 13.75);
TL.to('#blob-orbit', { opacity: 0, duration: .4 }, 13.75);
TL.to('#dip', { opacity: 0, duration: .55, ease: 'power1.out' }, 14.15); // out of the dark

// ── Beat 2 (14.79–25.04): the presentation — two jobs, one string ─────
fade('#title-a', 14.45, .55);
pop('#st-key', 15.05, .55);
pulse('#st-key', 18.2, 1.05);
fade('#chip-who', 19.7);
fade('#chip-what', 20.75);
pulse('#st-key', 23.0, 1.04);
pulse('#chip-who', 23.0, 1.05);
pulse('#chip-what', 23.12, 1.05);

// ── Cross-dissolve 1 (24.35–26.2): glide right while A melts into B ───
glide({ x: 1620, y: 960 }, 24.35, 1.05);
TL.to('#board-a .retire, #title-a', { opacity: 0, duration: .85, stagger: .04, ease: 'power1.inOut' }, 24.6);
TL.fromTo('#title-b', { opacity: 0, scale: 1.04, transformOrigin: '50% 50%' },
  { opacity: 1, scale: 1, duration: .7, ease: 'power1.out' }, 25.35);
pop('#st-app', 25.6);

// ── Beat 3 (25.42–34.11): one verified request, alive with packets ────
fade('#key-header', 27.2);
draw('#req-line', 27.8);
TL.to('#pkt-a', { opacity: 1, duration: .18 }, 28.3);
TL.to('#pkt-a', { y: 253, duration: .42, ease: 'none' }, 28.4)
  .to('#pkt-a', { y: 0, duration: .42, ease: 'none' }, 28.95)
  .to('#pkt-a', { y: 253, duration: .42, ease: 'none' }, 29.5)
  .to('#pkt-a', { y: 0, duration: .42, ease: 'none' }, 30.05)
  .to('#pkt-a', { y: 253, duration: .42, ease: 'none' }, 30.6);
TL.to('#pkt-a', { opacity: 0, duration: .2 }, 31.15);
fade('#st-server', 29.3, .55);
TL.to('#st-server', { scale: 1.06, duration: .2, ease: 'sine.out' }, 29.95)
  .to('#st-server', { scale: 1, duration: .3, ease: 'sine.inOut' }, 30.15);
pop('#st-check', 30.7);
draw('#res-line', 32.4, .5);
TL.to('#pkt-b', { opacity: 1, duration: .18 }, 32.55);
TL.to('#pkt-b', { y: 245, duration: .4, ease: 'none' }, 32.6)
  .to('#pkt-b', { y: 0, duration: .4, ease: 'none' }, 33.1)
  .to('#pkt-b', { y: 245, duration: .4, ease: 'none' }, 33.6);
TL.to('#pkt-b', { opacity: 0, duration: .18 }, 34.02);
pop('#st-database', 33.2);
pulse('#st-database', 33.85, 1.06);

// ── Cross-dissolve 2 (34.35–36.2): glide down while B melts into C ────
glide({ x: 540, y: 2640 }, 34.35, 1.05);
dissolve('#scene-b', 34.55, .85);
TL.fromTo('#title-c', { opacity: 0, scale: 1.04, transformOrigin: '50% 50%' },
  { opacity: 1, scale: 1, duration: .7, ease: 'power1.out' }, 34.95);

// ── Beat 4 (34.49–44.31): rules land as tilted sticker cards ──────────
TL.fromTo('#rule-1', { opacity: 0, x: -80, rotation: -10 }, { opacity: 1, x: 0, rotation: -3, duration: .5, ease: 'back.out(1.4)' }, 35.9);
TL.fromTo('#boring', { opacity: 0, y: 24, rotation: -12 }, { opacity: 1, y: 0, rotation: -5, duration: .5, ease: 'back.out(1.6)' }, 36.3);
pulse('#rule-1', 37.2, 1.03);
TL.to('#rule-1 .rule-sticker', { rotation: 3, duration: .3, ease: 'sine.inOut', transformOrigin: '50% 50%' }, 37.6)
  .to('#rule-1 .rule-sticker', { rotation: -2, duration: .3, ease: 'sine.inOut' }, 37.9)
  .to('#rule-1 .rule-sticker', { rotation: 0, duration: .3, ease: 'sine.inOut' }, 38.2);
TL.fromTo('#rule-2', { opacity: 0, x: -80, rotation: 7 }, { opacity: 1, x: 0, rotation: 2, duration: .5, ease: 'back.out(1.4)' }, 39.6);
TL.fromTo('#rule-3', { opacity: 0, x: -80, rotation: -8 }, { opacity: 1, x: 0, rotation: -1.5, duration: .5, ease: 'back.out(1.4)' }, 41.9);
TL.to('#rotate-sticker', { rotation: 360, duration: .9, ease: 'power1.inOut', transformOrigin: '50% 50%' }, 42.1);

// ── Cross-dissolve 3 (44.2–46.1): zoom into the sticker, glide out to D
glide({ x: 290, y: 2885, z: 1.9 }, 44.2, .7);
dissolve('#scene-c', 44.5, .85);
glide({ x: 1620, y: 2640, z: 1.18 }, 44.9, 1.2);

// ── Beat 5 (44.69–53.25): leak, revoke, recover ───────────────────────
fade('#title-d', 45.2);
TL.fromTo('#st-warning', { y: -280 }, { y: 0, duration: .7, ease: 'bounce.out' }, 45.7);
TL.to('#st-warning', { opacity: 1, duration: .3 }, 45.7);
rise('#leak-pill', 46.6, .45);
TL.to('#strike', { opacity: 1, duration: .1 }, 47.3);
TL.fromTo('#strike', { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: .45, ease: 'power2.in' }, 47.32);
TL.to('#leak-pill', { opacity: .55, duration: .35 }, 47.9);
fade('#act-1', 47.35, .5);
fade('#act-2', 49.0, .5);
fade('#act-3', 50.3, .5);
pulse('#st-warning', 51.6, 1.05);

// ── Beat 6 (53.63–60.91): the cycle, then build ───────────────────────
rise('#cycle-pill', 53.95);
pulse('#cycle-pill', 55.0, 1.04);
pulse('#cycle-pill', 55.9, 1.04);
TL.to('#st-rocket', { opacity: 1, duration: .15 }, 58.62);
TL.fromTo('#st-rocket', { x: 0, y: 60, rotation: 0 }, { x: 150, y: -320, rotation: 8, duration: 1.05, ease: 'power2.in' }, 58.92);
TL.to('#st-rocket', { y: -336, duration: .8, ease: 'sine.inOut' }, 60.05)
  .to('#st-rocket', { y: -320, duration: .8, ease: 'sine.inOut' }, 60.9)
  .to('#st-rocket', { y: -336, duration: .8, ease: 'sine.inOut' }, 61.75)
  .to('#st-rocket', { y: -320, duration: .8, ease: 'sine.inOut' }, 62.6);

// ── camera life: slow drifts, never overlapping the glides ────────────
glide({ z: 1.015 }, 1.2, 6.8);
glide({ z: 1.005 }, 8.2, 6.2);
glide({ z: 1.02 }, 15.0, 8.5);
glide({ z: 1.028 }, 26.0, 7.5);
glide({ z: 1.035 }, 35.6, 7.9);
glide({ z: 1.165 }, 46.3, 6.5);
glide({ z: 1.155 }, 52.8, 5.0);
glide({ z: 1.175 }, 58.92, 1.1);
glide({ z: 1.145 }, 60.1, 3.3);

window.__timelines['motion-006'] = TL;
