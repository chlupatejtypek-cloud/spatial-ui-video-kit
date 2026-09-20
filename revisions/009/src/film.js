// Google AI Studio — rev 009 "polish cut". One paused, seek-safe timeline, absolute values.
// Camera glides almost constantly; station changes are cross-dissolves during the glides;
// heroes keep a subtle float. Dark navy board only; die-cut stickers; navy tags.
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
function pulse(sel, t, amount = 1.05) {
  TL.to(sel, { scale: amount, duration: .2, ease: 'sine.inOut' }, t)
    .to(sel, { scale: 1, duration: .24, ease: 'sine.inOut' }, t + .2);
}
function dissolve(scope, t, d = .85) {
  TL.to(`${scope} .retire`, { opacity: 0, duration: d, stagger: .04, ease: 'power1.inOut' }, t);
}
function glide(cam, t, d = 1.05) {
  TL.to(camera, { ...cam, duration: d, ease: 'power1.inOut', onUpdate: applyCamera }, t);
}

// ── HOOK (0–14) — topic from frame zero ───────────────────────────────
TL.fromTo('#hook-kicker', { y: 14 }, { y: 0, duration: .45 }, 0.1);
TL.fromTo('#hook-title', { y: 30 }, { y: 0, duration: .6, ease: 'power2.out' }, 0.25);
TL.fromTo('#hook-sub', { y: 18 }, { y: 0, duration: .5 }, 0.6);

TL.to('#blob-main', { attr: { d: 'M 660 480 C 880 400 1080 560 1030 760 C 980 960 1140 1080 1000 1240 C 860 1400 640 1420 540 1240 C 440 1060 600 960 540 800 C 480 640 460 560 660 480 Z' }, duration: 4.8, ease: 'sine.inOut' }, 0.35);
TL.to('#blob-main', { attr: { d: 'M 720 400 C 920 400 1040 540 1000 740 C 960 940 1100 1060 1020 1240 C 940 1420 680 1360 580 1200 C 480 1040 540 920 520 760 C 500 600 540 400 720 400 Z' }, duration: 4.8, ease: 'sine.inOut' }, 5.2);
TL.to('#blob-main', { attr: { d: 'M 700 420 C 900 380 1060 520 1020 720 C 980 920 1120 1040 1010 1220 C 900 1400 660 1380 560 1220 C 460 1060 560 940 520 780 C 480 620 520 460 700 420 Z' }, duration: 2.8, ease: 'sine.inOut' }, 10.2);
TL.to('#blob-echo', { attr: { d: 'M 720 400 C 920 400 1040 540 1000 740 C 960 940 1100 1060 1020 1240 C 940 1420 680 1360 580 1200 C 480 1040 540 920 520 760 C 500 600 540 400 720 400 Z' }, duration: 4.8, ease: 'sine.inOut' }, 0.55);
TL.to('#blob-echo', { attr: { d: 'M 700 420 C 900 380 1060 520 1020 720 C 980 920 1120 1040 1010 1220 C 900 1400 660 1380 560 1220 C 460 1060 560 940 520 780 C 480 620 520 460 700 420 Z' }, duration: 4.6, ease: 'sine.inOut' }, 5.6);
TL.to('#blob-spin', { rotation: 9, svgOrigin: '770 880', duration: 13, ease: 'none' }, 0.35);
TL.to('#blob-orbit', { rotation: -22, svgOrigin: '770 880', duration: 13, ease: 'none' }, 0.35);
TL.to('#orbit-dot', { attr: { cx: 770, cy: 1440 }, duration: 3.0, ease: 'sine.inOut' }, 0.9)
  .to('#orbit-dot', { attr: { cx: 340, cy: 880 }, duration: 3.0, ease: 'sine.inOut' }, 4.05)
  .to('#orbit-dot', { attr: { cx: 770, cy: 320 }, duration: 3.0, ease: 'sine.inOut' }, 7.2)
  .to('#orbit-dot', { attr: { cx: 1200, cy: 880 }, duration: 3.0, ease: 'sine.inOut' }, 10.35);

pop('#hook-photo', 5.2, .55);
TL.to('#hook-photo', { rotation: -3, duration: .8, ease: 'sine.inOut' }, 5.9);
TL.to('#hook-photo', { scale: 1.035, duration: 3.17, ease: 'sine.inOut' }, 6.2)
  .to('#hook-photo', { scale: 1, duration: 3.2, ease: 'sine.inOut' }, 9.4);

rise('#promise-1', 8.6);
rise('#promise-2', 9.8);
rise('#promise-3', 11.0);
pulse('#hook-title', 8.6, 1.03);

// the dip: hook fades, dark, the presentation returns
TL.to('#hook-lockup', { opacity: 0, y: -24, duration: .5, ease: 'power2.in' }, 12.65);
TL.to('#hook-photo', { opacity: 0, scale: .97, rotation: -6, duration: .5, ease: 'power2.in' }, 12.7);
TL.to('#scene-a .tag-s', { opacity: 0, y: -14, duration: .4, stagger: .05, ease: 'power2.in' }, 12.75);
TL.to('#orbit-dot', { opacity: 0, duration: .3 }, 12.9);
TL.to('#blob-spin', { opacity: 0, duration: .4 }, 12.9);
TL.to('#blob-orbit', { opacity: 0, duration: .4 }, 12.9);
TL.to('#dip', { opacity: 1, duration: .35, ease: 'power1.in' }, 13.15);
TL.to('#dip', { opacity: 0, duration: .45, ease: 'power1.out' }, 13.6);

// ── A2 "One browser tab" (13.74–25.19) ────────────────────────────────
fade('#title-tab', 13.9, .55);
pop('#st-chatbubble', 14.55, .55);
for (let i = 0; i < 4; i++) {
  TL.to('#st-chatbubble', { y: -9, duration: 1.02, ease: 'sine.inOut' }, 15.3 + i * 2.2)
    .to('#st-chatbubble', { y: 0, duration: 1.05, ease: 'sine.inOut' }, 16.35 + i * 2.2);
}
fade('#tag-talk', 19.9, .5);
fade('#tag-models', 21.1, .5);

// ── B "Steer the model" (25.57–37.95) ─────────────────────────────────
fade('#title-b', 25.4, .55);
pop('#st-sliders', 26.2);
for (let i = 0; i < 4; i++) {
  TL.to('#st-sliders', { rotation: 1.2, y: -7, duration: 1.02, ease: 'sine.inOut' }, 26.75 + i * 2.2)
    .to('#st-sliders', { rotation: 0, y: 0, duration: 1.05, ease: 'sine.inOut' }, 27.79 + i * 2.2);
}
fade('#tag-sys', 29.8);
TL.to('#thermo', { opacity: 1, duration: .4 }, 32.7);
TL.to('#thermo-fill', { scaleY: .62, duration: .9, ease: 'power1.inOut' }, 32.9);
fade('#tag-temp', 32.9);
TL.to('#thermo-fill', { scaleY: .28, duration: .9, ease: 'power1.inOut' }, 34.4);
TL.to('#thermo-fill', { scaleY: .33, duration: .5, ease: 'sine.inOut' }, 35.5)
  .to('#thermo-fill', { scaleY: .3, duration: .5, ease: 'sine.inOut' }, 36.0)
  .to('#thermo-fill', { scaleY: .31, duration: .5, ease: 'sine.inOut' }, 36.5);
pop('#st-thinking', 36.0);
TL.to('#st-thinking', { rotation: 8, scale: 1.05, duration: .5, ease: 'sine.inOut', transformOrigin: '50% 50%' }, 36.55)
  .to('#st-thinking', { rotation: 0, scale: 1, duration: .6, ease: 'sine.inOut' }, 37.1);
rise('#tag-deep', 36.3);

// ── C "Feed it anything" (38.33–52.37) ────────────────────────────────
fade('#title-c', 38.75, .55);
TL.fromTo('#card-1', { opacity: 0, x: -80, rotation: -7 }, { opacity: 1, x: 0, rotation: -2, duration: .5, ease: 'back.out(1.4)' }, 40.5);
TL.fromTo('#card-2', { opacity: 0, x: -80, rotation: 6 }, { opacity: 1, x: 0, rotation: 1.5, duration: .5, ease: 'back.out(1.4)' }, 41.3);
TL.fromTo('#card-3', { opacity: 0, x: -80, rotation: -5 }, { opacity: 1, x: 0, rotation: -1, duration: .5, ease: 'back.out(1.4)' }, 42.9);
for (let i = 0; i < 3; i++) {
  TL.to('#card-1', { y: -6, duration: 1.07, ease: 'sine.inOut' }, 43.6 + i * 2.4)
    .to('#card-1', { y: 0, duration: 1.1, ease: 'sine.inOut' }, 44.7 + i * 2.4);
  TL.to('#card-2', { y: -5, duration: 1.07, ease: 'sine.inOut' }, 44.2 + i * 2.4)
    .to('#card-2', { y: 0, duration: 1.1, ease: 'sine.inOut' }, 45.3 + i * 2.4);
  TL.to('#card-3', { y: -7, duration: 1.07, ease: 'sine.inOut' }, 44.8 + i * 2.4)
    .to('#card-3', { y: 0, duration: 1.1, ease: 'sine.inOut' }, 45.9 + i * 2.4);
}

// ── D "Build with words" (52.75–78.9) ─────────────────────────────────
fade('#title-d', 53.3, .55);
pop('#st-loop', 54.6);
for (let i = 0; i < 2; i++) {
  TL.to('#st-loop', { y: -9, duration: 0.97, ease: 'sine.inOut' }, 55.2 + i * 2.0)
    .to('#st-loop', { y: 0, duration: 1.0, ease: 'sine.inOut' }, 56.2 + i * 2.0);
}
rise('#app-card', 55.8, .6);
TL.to('#st-app', { opacity: 1, duration: .45 }, 55.95);
TL.to('#code-l1', { scaleX: 1, duration: .45, ease: 'power1.inOut' }, 56.3);
TL.to('#code-l2', { scaleX: 1, duration: .45, ease: 'power1.inOut' }, 56.9);
TL.to('#code-l3', { scaleX: 1, duration: .45, ease: 'power1.inOut' }, 57.5);
TL.to('#glow', { opacity: .6, duration: .3 }, 59.2);
TL.fromTo('#glow', { scale: .97, transformOrigin: '50% 50%' }, { scale: 1.02, duration: .5, ease: 'sine.out' }, 59.2)
  .to('#glow', { scale: 1, opacity: .35, duration: .5, ease: 'sine.inOut' }, 59.7);
TL.to('#st-loop', { rotation: 360, duration: 1.1, ease: 'power1.inOut', transformOrigin: '50% 50%' }, 61.2);
TL.to('#st-loop', { y: -9, duration: 0.97, ease: 'sine.inOut' }, 63.2)
  .to('#st-loop', { y: 0, duration: 1.0, ease: 'sine.inOut' }, 64.2);
rise('#tag-key', 64.5);
rise('#cycle-strip', 66.3);
pulse('#cycle-strip', 67.7, 1.03);
pulse('#cycle-strip', 68.6, 1.03);
pulse('#cycle-strip', 69.9, 1.03);
pulse('#title-d', 71.9, 1.04);
TL.to('#cycle-strip', { y: -4, duration: .87, ease: 'sine.inOut' }, 72.8)
  .to('#cycle-strip', { y: 0, duration: .6, ease: 'sine.inOut' }, 73.7);
TL.to('#st-rocket', { opacity: 1, duration: .15 }, 76.7);
TL.fromTo('#st-rocket', { x: 0, y: 60, rotation: 0 }, { x: -40, y: -240, rotation: -7, duration: 1.0, ease: 'power2.in' }, 76.95);
TL.to('#st-rocket', { y: -248, duration: .47, ease: 'sine.inOut' }, 78.0)
  .to('#st-rocket', { y: -242, duration: .45, ease: 'sine.inOut' }, 78.5);

// ── CAMERA: almost always moving ──────────────────────────────────────
glide({ z: 1.02 }, 0.3, 7.9);
glide({ z: 1.008 }, 8.2, 4.6);
glide({ x: 540, y: 960, z: 1.06 }, 12.9, 1.0);   // settle back into the tab board (during the dip)
glide({ z: 1.115 }, 13.9, 10.4);                 // push on the tab station
glide({ x: 1620, y: 960, z: 1.08 }, 24.5, 1.2);  // travel right — steer
glide({ z: 1.1 }, 25.7, 11.7);
glide({ x: 540, y: 2640, z: 1.1 }, 37.6, 1.2);   // travel down-left — feed
glide({ z: 1.13 }, 38.8, 12.6);
glide({ x: 1620, y: 2640, z: 1.15 }, 51.6, 1.6); // travel right — build
glide({ z: 1.155 }, 53.2, 11.9);
glide({ z: 1.12 }, 65.5, 1.3);                   // settle for the cycle
glide({ z: 1.145 }, 66.8, 8.7);
glide({ z: 1.16 }, 75.5, 1.2);
glide({ z: 1.19 }, 76.7, 1.9);                   // launch push — motion until the cut

window.__timelines['motion-009'] = TL;
