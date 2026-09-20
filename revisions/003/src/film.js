// API keys explained — one paused, seek-safe timeline. Camera pans left/right
// between two portrait viewports of one shared world; content is replaced in place.
// No wall clock, no randomness, no network: every value is deterministic.
// Entrances use fromTo so GSAP owns the full transform state (lint: no CSS conflicts);
// immediateRender applies the hidden offsets before the first painted frame.
gsap.registerPlugin(MotionPathPlugin);

const camera = { x: 540, y: 1020, z: 1 };
const world = document.getElementById('world');
function applyCamera() {
  world.style.transform = `translate(${540 - camera.x * camera.z}px, ${960 - camera.y * camera.z}px) scale(${camera.z})`;
}
gsap.set(camera, { x: 540, y: 1020, z: 1, onUpdate: applyCamera });
applyCamera();

const TL = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });
window.__timelines = window.__timelines || {};

// Scene 1 — identity. Visible from frame zero: title and key tile.
TL.fromTo('#chip-id', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .65 }, 2.3);
TL.to('#link-id', { strokeDashoffset: 0, autoRound: false, duration: .5 }, 2.45);
TL.fromTo('#chip-scope', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .65 }, 7.6);
TL.to('#link-scope', { strokeDashoffset: 0, autoRound: false, duration: .5 }, 7.75);

// Slow imperceptible camera drift during holds: no dead static stretches.
TL.to(camera, { z: 1.012, duration: 9.9, ease: 'sine.inOut', onUpdate: applyCamera }, 1.5);
TL.to(camera, { z: 1.0, duration: 10.6, ease: 'sine.inOut', onUpdate: applyCamera }, 13.0);
TL.to(camera, { z: 1.012, duration: 12.7, ease: 'sine.inOut', onUpdate: applyCamera }, 25.2);
TL.to(camera, { z: 1.0, duration: 10.9, ease: 'sine.inOut', onUpdate: applyCamera }, 39.4);

// Camera pans between the two portrait viewports of the same world.
TL.to(camera, { x: 1860, duration: 1, ease: 'power2.inOut', onUpdate: applyCamera }, 11.5);
TL.to(camera, { x: 540, duration: 1, ease: 'power2.inOut', onUpdate: applyCamera }, 23.7);
TL.to(camera, { x: 1860, duration: 1, ease: 'power2.inOut', onUpdate: applyCamera }, 37.9);

// Scene 2 — one request travelling through check to data.
TL.fromTo('#s2-title', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .6 }, 12.55);
TL.fromTo('#node-app', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .6 }, 12.7);
TL.fromTo('#node-api', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .6 }, 12.9);
TL.to('#req-line', { strokeDashoffset: 0, autoRound: false, duration: .7 }, 14.6);
TL.fromTo('#key-chip', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .6 }, 15.7);
TL.fromTo('#api-check', { opacity: 0, scale: .8 }, { opacity: 1, scale: 1, duration: .5, ease: 'back.out(1.5)' }, 18.8);
TL.to('#res-line', { strokeDashoffset: 0, autoRound: false, duration: .6 }, 21.9);
TL.fromTo('#node-data', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .6 }, 22.05);
TL.to('#node-data', { borderColor: '#71a8ff', duration: .5 }, 22.7);

// In-place replacement: scene 1 retires as the camera returns to it.
TL.to('#s1 .retire', { opacity: 0, y: -18, scale: .97, duration: .6, stagger: .05, ease: 'power2.in' }, 24.3);
TL.fromTo('#s3-title', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .6 }, 25.0);
TL.fromTo('#rule-1', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .6 }, 26.7);
TL.fromTo('#rule-2', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .6 }, 30.2);
TL.fromTo('#rule-3', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .6 }, 33.4);

// Scenes 2 and 3 retire together while the camera crosses to the right viewport.
TL.to('#s2 .retire', { opacity: 0, y: -18, scale: .97, duration: .6, stagger: .04, ease: 'power2.in' }, 38.25);
TL.to('#s3 .retire', { opacity: 0, y: -18, scale: .97, duration: .6, stagger: .05, ease: 'power2.in' }, 38.25);

// Scene 4 — leak, revoke, recover, and the closing cycle.
TL.fromTo('#s4-title', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .6 }, 39.05);
TL.fromTo('#leak-key', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .6 }, 39.5);
TL.to('#leak-key', { borderColor: '#5d7db0', duration: .5 }, 41.2);
TL.fromTo('#strike', { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: .45, ease: 'power2.in' }, 42.4);
TL.to('#leak-key', { opacity: .5, duration: .4 }, 42.9);
TL.fromTo('#chip-new', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .6 }, 43.6);
TL.fromTo('#chip-update', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .6 }, 44.9);
TL.fromTo('#cycle', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .7 }, 46.9);
TL.to('#cycle', { borderColor: '#71a8ff', duration: .6 }, 50.5);

// Final breath: a gentle push-in on the closing summary.
TL.to(camera, { z: 1.035, duration: 1.1, ease: 'sine.inOut', onUpdate: applyCamera }, 50.5);

window.__timelines['motion-003'] = TL;
