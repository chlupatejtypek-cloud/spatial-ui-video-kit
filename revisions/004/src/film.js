// API keys — sticker story. One paused, seek-safe timeline.
// The camera visits four viewports A→B→C→D and NEVER returns, so a scene,
// once retired, is never seen again. Every pop is synced to the narration
// beat that names it (start values measured with ffprobe, see film.config.json).
// GSAP owns every transform via fromTo; CSS only declares initial opacity.
gsap.registerPlugin(MotionPathPlugin);

const camera = { x: 540, y: 960, z: 1 };
const world = document.getElementById('world');
function applyCamera() {
  world.style.transform = `translate(${540 - camera.x * camera.z}px, ${960 - camera.y * camera.z}px) scale(${camera.z})`;
}
gsap.set(camera, { x: 540, y: 960, z: 1, onUpdate: applyCamera });
applyCamera();
// absolute baseline for the rocket (no relative tweens anywhere: seek-safety)
gsap.set('#st-rocket', { opacity: 0, x: 0, y: 60, rotation: 0 });

const TL = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });
window.__timelines = window.__timelines || {};

// helpers — pop a sticker exactly on its narration beat
function pop(sel, t) {
  TL.fromTo(sel, { opacity: 0, scale: 0, rotation: -8, transformOrigin: '50% 60%' },
    { opacity: 1, scale: 1, rotation: 0, duration: .5, ease: 'back.out(2)' }, t);
}
function rise(sel, t) {
  TL.fromTo(sel, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .5, ease: 'back.out(1.6)' }, t);
}
function pulse(sel, t, amount = 1.07) {
  TL.to(sel, { scale: amount, duration: .22, ease: 'sine.inOut' }, t)
    .to(sel, { scale: 1, duration: .26, ease: 'sine.inOut' }, t + .22);
}
function draw(sel, t, dur = .6) {
  TL.to(sel, { strokeDashoffset: 0, autoRound: false, duration: dur, ease: 'power1.inOut' }, t);
}
function retire(scope, t) {
  TL.to(`${scope} .retire`, { opacity: 0, y: -20, scale: .96, duration: .5, stagger: .05, ease: 'power2.in' }, t);
}

// ── Viewport A: the key and its two facts ─────────────────────────────
TL.fromTo('#title-a', { y: 22 }, { y: 0, duration: .55 }, 0.15); // visible from frame zero, settles gently
pop('#st-key', 0.9);                       // “Meet the API key”
pulse('#st-key', 3.3, 1.06);               // “one tiny string”
TL.fromTo('#underline-a', { opacity: 0, scaleX: 0, transformOrigin: '50% 50%' },
  { opacity: 1, scaleX: 1, duration: .6, ease: 'power2.inOut' }, 5.2);
pulse('#st-key', 7.3, 1.05);               // “carries two facts”
rise('#chip-who', 8.2);                    // “who is asking”
rise('#chip-what', 9.8);                   // “what that caller may do”

// ── camera A → B, scene 1 retires behind us ───────────────────────────
TL.to(camera, { x: 1620, y: 960, z: 1, duration: .95, ease: 'power2.inOut', onUpdate: applyCamera }, 12.55);
retire('#scene-a', 13.0);

// ── Viewport B: one verified request ──────────────────────────────────
TL.fromTo('#title-b', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .5 }, 13.55);
pop('#st-app', 13.6);                      // “your app calls an API”
rise('#key-header', 15.5);                 // “the key rides along”
draw('#req-line', 16.2, .7);
pop('#st-server', 19.2);                   // “the server checks it”
pop('#st-check', 21.3);                    // “is it allowed to do this?”
pulse('#key-header', 22.6, 1.04);
pulse('#st-check', 25.4, 1.12);            // “the door opens”
draw('#res-line', 25.45, .55);
pop('#st-database', 27.3);                 // “the data flows back”

// ── camera B → C, scene 2 retires ─────────────────────────────────────
TL.to(camera, { x: 540, y: 2640, z: 1, duration: .95, ease: 'power2.inOut', onUpdate: applyCamera }, 29.0);
retire('#scene-b', 29.2);

// ── Viewport C: keep it safe ──────────────────────────────────────────
TL.fromTo('#title-c', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .5 }, 29.8);
TL.fromTo('#rule-1', { opacity: 0, x: -46 }, { opacity: 1, x: 0, duration: .55, ease: 'back.out(1.5)' }, 31.0); // “never push a key”
pulse('#rule-1', 33.4, 1.04);              // “…into a repository”
TL.fromTo('#rule-2', { opacity: 0, x: -46 }, { opacity: 1, x: 0, duration: .55, ease: 'back.out(1.5)' }, 36.3); // “smallest scope”
TL.fromTo('#rule-3', { opacity: 0, x: -46 }, { opacity: 1, x: 0, duration: .55, ease: 'back.out(1.5)' }, 38.7); // “rotate it”

// ── camera C → D, scene 3 retires ─────────────────────────────────────
TL.to(camera, { x: 1620, y: 2640, z: 1, duration: .95, ease: 'power2.inOut', onUpdate: applyCamera }, 40.3);
retire('#scene-c', 46.2);

// ── Viewport D: leak, recover, build ──────────────────────────────────
TL.fromTo('#title-d', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .5 }, 41.3);
TL.fromTo('#st-warning', { opacity: 0, scale: 0, rotation: 6, transformOrigin: '50% 60%' },
  { opacity: 1, scale: 1, rotation: 0, duration: .55, ease: 'back.out(2.2)' }, 41.85); // “if a key leaks”
rise('#act-1', 43.0);                      // “revoke it”
rise('#act-2', 44.0);                      // “issue a fresh one”
rise('#act-3', 45.3);                      // “move on”
TL.fromTo('#cycle-pill', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .55, ease: 'back.out(1.6)' }, 46.4); // “Identify”
pulse('#cycle-pill', 47.25, 1.04);         // “Verify”
pulse('#cycle-pill', 48.05, 1.04);         // “Protect”

// rocket launch on “now go build”: visible fast, then it flies and idles
TL.to('#st-rocket', { opacity: 1, duration: .4 }, 50.55);
TL.to('#st-rocket', { x: 130, y: -240, rotation: 6, duration: 1.1, ease: 'power2.in' }, 50.7);
TL.to('#st-rocket', { y: -256, duration: .8, ease: 'sine.inOut' }, 51.9);
TL.to('#st-rocket', { y: -240, duration: .8, ease: 'sine.inOut' }, 52.7);
TL.to('#st-rocket', { y: -256, duration: .8, ease: 'sine.inOut' }, 53.5);
TL.to('#st-rocket', { y: -240, duration: .8, ease: 'sine.inOut' }, 54.3);

// ── camera life: slow drifts during holds, never a dead frame ─────────
TL.to(camera, { z: 1.02, duration: 9.6, ease: 'sine.inOut', onUpdate: applyCamera }, 1.4);
TL.to(camera, { z: 1.018, duration: 8.0, ease: 'sine.inOut', onUpdate: applyCamera }, 14.5);
TL.to(camera, { z: 1.02, duration: 8.0, ease: 'sine.inOut', onUpdate: applyCamera }, 31.0);
TL.to(camera, { z: 1.022, duration: 6.0, ease: 'sine.inOut', onUpdate: applyCamera }, 43.0);
TL.to(camera, { z: 1.045, duration: 1.3, ease: 'sine.inOut', onUpdate: applyCamera }, 50.7);
TL.to(camera, { z: 1.03, duration: 4.0, ease: 'sine.inOut', onUpdate: applyCamera }, 53.0);

window.__timelines['motion-004'] = TL;
