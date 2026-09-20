// API keys — hook cut. One paused, seek-safe timeline.
// Cold open on a blurred, drifting world (never an empty stage); the key un-blurs first,
// then the promise beats. Transitions vary: fast pan, dip-to-dark in-place swap, zoom punch.
// Every value is absolute (no relative tweens), every pop lands on its measured narration beat.
gsap.registerPlugin(MotionPathPlugin);

const camera = { x: 540, y: 960, z: 1 };
const world = document.getElementById('world');
function applyCamera() {
  world.style.transform = `translate(${540 - camera.x * camera.z}px, ${960 - camera.y * camera.z}px) scale(${camera.z})`;
}
gsap.set(camera, { x: 540, y: 960, z: 1, onUpdate: applyCamera });
applyCamera();
gsap.set('#st-rocket', { opacity: 0, x: 0, y: 60, rotation: 0 });
gsap.set('#boring', { rotation: -5 }); // GSAP owns the resting tilt (no CSS transform)

const TL = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });
window.__timelines = window.__timelines || {};

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
function slam(sel, t) {
  TL.fromTo(sel, { opacity: 0, scale: 1.7 }, { opacity: 1, scale: 1, duration: .3, ease: 'power3.in' }, t)
    .to(sel, { scale: 1.05, duration: .12, ease: 'sine.out' }, t + .3)
    .to(sel, { scale: 1, duration: .16, ease: 'sine.inOut' }, t + .42);
}
function retire(scope, t, d = .5) {
  TL.to(`${scope} .retire`, { opacity: 0, y: -20, scale: .96, duration: d, stagger: .04, ease: 'power2.in' }, t);
}

// ── Cold open (0–14.4): blurred living world + sharp promise ──────────
TL.fromTo('#sub-a', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .55 }, 0.5);
// the world breathes even before the voice starts
TL.to('#ghosts', { x: 10, y: -6, duration: 2.8, ease: 'sine.inOut' }, 0.3);
TL.to('#ghosts', { x: -8, y: 8, duration: 2.8, ease: 'sine.inOut' }, 3.1);
TL.to('#ghosts', { x: 6, y: -4, duration: 2.8, ease: 'sine.inOut' }, 5.9);
TL.to('#ghosts', { x: -10, y: 5, duration: 2.8, ease: 'sine.inOut' }, 8.7);
TL.to('#ghosts', { x: 2, y: 0, duration: 2.8, ease: 'sine.inOut' }, 11.5);
// “…they are called API keys” — the key cuts through the blur
pop('#st-key', 5.1, .55);
TL.to('#sub-a', { opacity: 0, y: -12, duration: .4 }, 5.05);
TL.to('#title-a', { scale: 1.035, duration: .2, ease: 'sine.out' }, 5.1)
  .to('#title-a', { scale: 1, duration: .3, ease: 'sine.inOut' }, 5.3);
// the promise, one line per clause
rise('#promise-1', 8.4);
rise('#promise-2', 9.6);
rise('#promise-3', 10.8);
// clear the stage for the two facts
TL.to('#ghosts', { opacity: 0, scale: 1.06, duration: .7, ease: 'power2.in' }, 13.3);
TL.to('#scene-a .minipill', { opacity: 0, y: -14, duration: .4, stagger: .05, ease: 'power2.in' }, 13.5);

// ── Beat 2 (14.79–25.04): two jobs ────────────────────────────────────
pulse('#st-key', 18.2, 1.05);
rise('#chip-who', 19.7);
rise('#chip-what', 20.7);
pulse('#st-key', 23.0, 1.04);
pulse('#chip-who', 23.0, 1.05);
pulse('#chip-what', 23.12, 1.05);

// ── T1: fast pan A→B while scene 1 dies behind us ─────────────────────
TL.to(camera, { x: 1620, duration: .55, ease: 'power2.inOut', onUpdate: applyCamera }, 24.70);
retire('#scene-a', 24.78, .45);

// ── Beat 3 (25.42–34.11): one verified request, alive with packets ────
TL.fromTo('#title-b', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .45 }, 25.5);
pop('#st-app', 25.75);
rise('#key-header', 27.2);
draw('#req-line', 27.8);
TL.to('#pkt-a', { opacity: 1, duration: .18 }, 28.3);
TL.to('#pkt-a', { y: 253, duration: .42, ease: 'none' }, 28.4)
  .to('#pkt-a', { y: 0, duration: .42, ease: 'none' }, 28.95)
  .to('#pkt-a', { y: 253, duration: .42, ease: 'none' }, 29.5)
  .to('#pkt-a', { y: 0, duration: .42, ease: 'none' }, 30.05)
  .to('#pkt-a', { y: 253, duration: .42, ease: 'none' }, 30.6);
TL.to('#pkt-a', { opacity: 0, duration: .2 }, 31.15);
slam('#st-server', 29.3);
slam('#st-check', 30.7);
draw('#res-line', 32.4, .5);
TL.to('#pkt-b', { opacity: 1, duration: .18 }, 32.55);
TL.to('#pkt-b', { y: 245, duration: .4, ease: 'none' }, 32.6)
  .to('#pkt-b', { y: 0, duration: .4, ease: 'none' }, 33.1)
  .to('#pkt-b', { y: 245, duration: .4, ease: 'none' }, 33.6);
TL.to('#pkt-b', { opacity: 0, duration: .18 }, 34.02);
pop('#st-database', 33.2);
pulse('#st-database', 33.85, 1.06); // starts after the pop fully settles

// ── T2: dip-to-dark, content swaps in place (no visible travel) ───────
TL.to('#dip', { opacity: 1, duration: .3, ease: 'power1.in' }, 34.25);
retire('#scene-b', 34.45, .3);
TL.to(camera, { x: 540, y: 2640, z: 1, duration: .001, onUpdate: applyCamera }, 34.60); // swap in the dark
TL.to('#dip', { opacity: 0, duration: .5, ease: 'power1.out' }, 34.75);

// ── Beat 4 (34.49–44.31): rules land as tilted sticker cards ──────────
TL.fromTo('#title-c', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .45 }, 34.95);
TL.fromTo('#rule-1', { opacity: 0, x: -80, rotation: -10 }, { opacity: 1, x: 0, rotation: -3, duration: .5, ease: 'back.out(1.4)' }, 35.9);
TL.fromTo('#boring', { opacity: 0, y: 24, rotation: -12 }, { opacity: 1, y: 0, rotation: -5, duration: .5, ease: 'back.out(1.6)' }, 36.3);
pulse('#rule-1', 37.2, 1.03);
TL.to('#rule-1 .rule-sticker', { rotation: 3, duration: .3, ease: 'sine.inOut', transformOrigin: '50% 50%' }, 37.6)
  .to('#rule-1 .rule-sticker', { rotation: -2, duration: .3, ease: 'sine.inOut' }, 37.9)
  .to('#rule-1 .rule-sticker', { rotation: 0, duration: .3, ease: 'sine.inOut' }, 38.2);
TL.fromTo('#rule-2', { opacity: 0, x: -80, rotation: 7 }, { opacity: 1, x: 0, rotation: 2, duration: .5, ease: 'back.out(1.4)' }, 39.6);
TL.fromTo('#rule-3', { opacity: 0, x: -80, rotation: -8 }, { opacity: 1, x: 0, rotation: -1.5, duration: .5, ease: 'back.out(1.4)' }, 41.9);
TL.to('#rotate-sticker', { rotation: 360, duration: .9, ease: 'power1.inOut', transformOrigin: '50% 50%' }, 42.1);

// ── T3: zoom punch into the rotate sticker, swap in the dark ──────────
TL.to(camera, { x: 290, y: 2885, z: 1.9, duration: .32, ease: 'power2.in', onUpdate: applyCamera }, 44.40);
TL.to('#dip', { opacity: 1, duration: .15, ease: 'power1.in' }, 44.62);
retire('#scene-c', 44.66, .3);
TL.to(camera, { x: 1620, y: 2640, z: 1.9, duration: .001, onUpdate: applyCamera }, 44.78); // swap at the dip peak
TL.to('#dip', { opacity: 0, duration: .45, ease: 'power1.out' }, 44.85);
TL.to(camera, { z: 1.12, duration: .45, ease: 'power2.out', onUpdate: applyCamera }, 44.85);

// ── Beat 5 (44.69–53.25): leak, revoke, recover ───────────────────────
TL.fromTo('#title-d', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .45 }, 45.1);
TL.fromTo('#st-warning', { y: -280 }, { y: 0, duration: .7, ease: 'bounce.out' }, 45.7);
TL.to('#st-warning', { opacity: 1, duration: .15 }, 45.7);
rise('#leak-pill', 46.6, .45);
TL.to('#strike', { opacity: 1, duration: .1 }, 47.3);
TL.fromTo('#strike', { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: .45, ease: 'power2.in' }, 47.32);
TL.to('#leak-pill', { opacity: .55, duration: .35 }, 47.9);
rise('#act-1', 47.35);
rise('#act-2', 49.0);
rise('#act-3', 50.3);
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

// ── camera life: slow drifts only where they cannot fight the pans ────
TL.to(camera, { z: 1.015, duration: 6.8, ease: 'sine.inOut', onUpdate: applyCamera }, 1.2);
TL.to(camera, { z: 1.005, duration: 6.2, ease: 'sine.inOut', onUpdate: applyCamera }, 8.2);
TL.to(camera, { z: 1.02, duration: 8.5, ease: 'sine.inOut', onUpdate: applyCamera }, 15.0);
TL.to(camera, { z: 1.132, duration: 6.0, ease: 'sine.inOut', onUpdate: applyCamera }, 46.0);
TL.to(camera, { z: 1.118, duration: 5.0, ease: 'sine.inOut', onUpdate: applyCamera }, 52.5);
TL.to(camera, { z: 1.16, duration: 1.1, ease: 'sine.inOut', onUpdate: applyCamera }, 58.92);
TL.to(camera, { z: 1.13, duration: 3.3, ease: 'sine.inOut', onUpdate: applyCamera }, 60.1);

window.__timelines['motion-005'] = TL;
