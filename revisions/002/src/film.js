// Revision 002: one uninterrupted, focus-led 2D sequence. Render-critical state is time-only.
(() => {
  gsap.registerPlugin(MotionPathPlugin);
  const tl = gsap.timeline({ paused: true });
  const V = {
    open:   { x: 960,  y: 840,  z: 1.16 },
    focus:  { x: 970,  y: 920,  z: 1.23 },
    chain:  { x: 2260, y: 1025, z: .79 },
    verify: { x: 2680, y: 1010, z: .99 },
    chart:  { x: 2740, y: 1030, z: 1.10 },
    ready:  { x: 3210, y: 976,  z: 1.35 }
  };
  const wireOne = 'M1840 1010 C2005 1010 1995 1115 2160 1115';
  const wireTwo = 'M2460 1115 C2675 1115 2680 940 2850 940';
  const curve = 'M132 440 C203 440 218 406 284 406 S368 373 442 373 S539 337 601 337 S702 275 771 275 S876 210 940 210 S1042 155 1104 155';

  function camera(a, b, start, duration, ease = 'power3.inOut') {
    tl.fromTo('#world', { x: -a.x, y: -a.y }, { x: -b.x, y: -b.y, duration, ease, immediateRender: false }, start);
    tl.fromTo('#camera-zoom', { scale: a.z }, { scale: b.z, duration, ease, immediateRender: false }, start);
    tl.fromTo('#root', { '--cx': a.x, '--cy': a.y, '--zoom': a.z }, { '--cx': b.x, '--cy': b.y, '--zoom': b.z, duration, ease, immediateRender: false }, start);
  }
  gsap.set('#world', { x: -V.open.x, y: -V.open.y, transformOrigin: '0 0' });
  gsap.set('#camera-zoom', { scale: V.open.z, transformOrigin: '0 0' });
  gsap.set('#root', { '--cx': V.open.x, '--cy': V.open.y, '--zoom': V.open.z });
  gsap.set('#signal-one', { x: 1840, y: 1010 });
  gsap.set('#signal-two', { x: 2460, y: 1115 });
  gsap.set('#chart-tip', { x: 132, y: 440 });
  gsap.set('#optimize-progress-fill', { scaleX: 0, transformOrigin: '0 50%' });

  // 1. Establish, then move the eye down to the only active row.
  tl.addLabel('project', 0);
  camera(V.open, V.focus, 1.3, 1.3, 'sine.inOut');
  tl.fromTo('#focus-card', { borderColor: '#667950' }, { borderColor: '#abc888', duration: 1.25, ease: 'sine.inOut' }, 1.35);
  tl.fromTo('#focus-arrow', { x: 0 }, { x: 5, duration: 1.05, ease: 'sine.inOut' }, 1.5);

  // 2. The same row leaves its parent and changes proportions. No replacement-frame trick.
  tl.addLabel('extract', 2.75);
  camera(V.focus, V.chain, 2.75, 2.15);
  tl.fromTo('#project-panel', { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -30, duration: .95, ease: 'sine.inOut' }, 2.9);
  tl.fromTo('#focus-card', { x: 0, y: 0, width: 728, height: 88, borderRadius: 13 }, { x: 934, y: -60, width: 380, height: 240, borderRadius: 21, duration: 2.05, ease: 'power3.inOut', immediateRender: false }, 2.75);
  tl.to('#focus-card', { borderColor: '#62794b', backgroundColor: '#232f20', duration: 1.1, ease: 'sine.inOut' }, 3.8);
  tl.to(['#focus-caption', '#focus-arrow'], { autoAlpha: 0, duration: .32, ease: 'sine.inOut' }, 2.78);
  tl.fromTo('#focus-icon', { x: 0, y: 0 }, { x: 7, y: -3, duration: 1.75, ease: 'power3.inOut' }, 2.95);
  tl.fromTo('#focus-label', { x: 0, y: 0 }, { x: -45, y: 46, duration: 1.75, ease: 'power3.inOut' }, 2.95);
  tl.fromTo('#focus-score', { autoAlpha: 0, y: 7 }, { autoAlpha: 1, y: 0, duration: .8, ease: 'sine.out' }, 4.6);
  tl.fromTo('#optimize-card', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 1.0, ease: 'sine.out' }, 3.8);
  tl.fromTo('#insight-surface', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .9, ease: 'sine.out' }, 4.05);
  tl.to('#connections', { autoAlpha: 1, duration: .95, ease: 'sine.inOut' }, 4.0);

  // 3. One moving signal, one local response; other elements remain still.
  tl.addLabel('optimize', 5.85);
  tl.to('#wire-one', { strokeDashoffset: 0, autoRound: false, duration: 1.10, ease: 'none' }, 5.85);
  tl.to('#signal-one', { autoAlpha: 1, duration: .18, ease: 'sine.out' }, 5.85);
  tl.to('#signal-one', { motionPath: { path: wireOne, autoRotate: false }, duration: 1.10, ease: 'none' }, 5.85);
  tl.to('#signal-one', { autoAlpha: 0, duration: .25, ease: 'sine.inOut' }, 6.95);
  tl.to('#optimize-card', { borderColor: '#8aa76a', duration: .55, ease: 'sine.inOut' }, 6.75);
  tl.to('#optimize-progress-fill', { scaleX: 1, duration: .8, ease: 'power2.inOut' }, 7.05);
  tl.to('#wire-one', { opacity: .48, duration: .7, ease: 'sine.inOut' }, 7.1);
  camera(V.chain, V.verify, 7.85, 1.75, 'power2.inOut');
  tl.to('#wire-two', { strokeDashoffset: 0, autoRound: false, duration: 1.15, ease: 'none' }, 7.95);
  tl.to('#signal-two', { autoAlpha: 1, duration: .18, ease: 'sine.out' }, 7.95);
  tl.to('#signal-two', { motionPath: { path: wireTwo, autoRotate: false }, duration: 1.15, ease: 'none' }, 7.95);
  tl.to('#signal-two', { autoAlpha: 0, duration: .24, ease: 'sine.inOut' }, 9.10);
  tl.to('#insight-surface', { borderColor: '#8ba66e', duration: .6, ease: 'sine.inOut' }, 8.95);
  tl.to('#verify-check', { strokeDashoffset: 0, autoRound: false, duration: .57, ease: 'sine.inOut' }, 9.2);

  // 4. The verification tile opens into a single-purpose chart; old context retires.
  tl.addLabel('chart-open', 9.95);
  camera(V.verify, V.chart, 9.95, 1.95, 'power2.inOut');
  tl.to('#connections', { autoAlpha: 0, duration: .7, ease: 'sine.inOut' }, 9.95);
  tl.to('#focus-card', { autoAlpha: 0, y: -85, duration: .75, ease: 'sine.inOut' }, 10.0);
  tl.to('#optimize-card', { autoAlpha: 0, y: 18, duration: .65, ease: 'sine.inOut' }, 10.08);
  tl.to('#verify-content', { autoAlpha: 0, duration: .45, ease: 'sine.inOut' }, 10.02);
  tl.fromTo('#insight-surface', { x: 0, y: 0, width: 180, height: 180, borderRadius: 21 }, { x: -745, y: -150, width: 1270, height: 660, borderRadius: 25, duration: 1.9, ease: 'power3.inOut', immediateRender: false }, 9.95);
  tl.to('#insight-surface', { borderColor: '#4e603f', backgroundColor: '#1b241b', duration: 1.2, ease: 'sine.inOut' }, 10.35);
  tl.fromTo('#chart-content', { autoAlpha: 0 }, { autoAlpha: 1, duration: .8, ease: 'sine.inOut' }, 10.95);
  tl.fromTo('#chart-heading', { autoAlpha: 0 }, { autoAlpha: 1, duration: .85, ease: 'sine.inOut' }, 10.95);
  tl.fromTo('#chart-grid', { autoAlpha: 0 }, { autoAlpha: 1, duration: .65, ease: 'sine.inOut' }, 11.6);

  // Graph: exactly one reveal, constant color/weight/opacity, no fill or tooltip pop.
  // Tip and stroke share the same linear path-length progress for the entire 4.6 s draw.
  // Critical: pathLength=1 uses fractional dash offsets. Disable CSSPlugin pixel rounding,
  // otherwise a 1px→0px tween snaps halfway through instead of drawing continuously.
  tl.addLabel('trace', 12.35);
  tl.to('#chart-tip', { autoAlpha: 1, duration: .30, ease: 'sine.out' }, 12.05);
  tl.to('#chart-line', { strokeDashoffset: 0, autoRound: false, duration: 4.6, ease: 'none' }, 12.35);
  tl.to('#chart-tip', { motionPath: { path: curve, autoRotate: false }, duration: 4.6, ease: 'none' }, 12.35);
  tl.fromTo('#chart-value', { autoAlpha: 0 }, { autoAlpha: 1, duration: .85, ease: 'sine.inOut' }, 16.70);

  // 5. Keep the exact endpoint in world space while its surrounding surface changes.
  // The two dots match size, fill and coordinates, so the ownership handoff has no visible jump.
  tl.addLabel('resolve', 18.60);
  tl.set('#chart-tip', { autoAlpha: 0 }, 18.60);
  tl.set('#result-mark', { autoAlpha: 1, x: 0, y: 0 }, 18.60);
  camera(V.chart, V.ready, 18.65, 1.9, 'power2.inOut');
  tl.to('#chart-content', { autoAlpha: 0, duration: .72, ease: 'sine.inOut' }, 18.65);
  tl.fromTo('#insight-surface', { x: -745, y: -150, width: 1270, height: 660, borderRadius: 25 }, { x: 70, y: -45, width: 580, height: 350, borderRadius: 24, duration: 1.8, ease: 'power3.inOut', immediateRender: false }, 18.65);
  tl.fromTo('#result-mark', { x: 0, y: 0 }, { x: 1, y: 40, duration: 1.8, ease: 'power3.inOut', immediateRender: false }, 18.65);
  tl.fromTo('#result-circle', { attr: { r: 5.5, 'fill-opacity': 1, 'stroke-opacity': 0 } }, { attr: { r: 46, 'fill-opacity': .055, 'stroke-opacity': 1 }, duration: 1.25, ease: 'sine.inOut' }, 19.0);
  tl.to('#result-check', { strokeDashoffset: 0, autoRound: false, duration: .7, ease: 'sine.inOut' }, 20.15);
  tl.fromTo('#ready-content', { autoAlpha: 0, y: 9 }, { autoAlpha: 1, y: 0, duration: .85, ease: 'sine.out' }, 20.55);
  // A quiet 2.6 s hold is intentional; data-duration owns the 24 s film length.

  window.__timelines = window.__timelines || {};
  window.__timelines['motion-002'] = tl;
  window.MOTION_VIEWS = V;
})();
