// Blackboard 001 — a single, deterministic Hyperframes timeline.
// The camera translates the world and scales a separate rig. Nothing is 3D.
(() => {
  const tl = gsap.timeline({ paused: true });
  const views = {
    all: { x: 2180, y: 1460, z: 0.385 },
    overview: { x: 910, y: 940, z: 1.08 },
    workflow: { x: 3210, y: 840, z: 1.08 },
    analytics: { x: 3450, y: 2160, z: 1.08 },
    detail: { x: 1090, y: 2240, z: 1.08 }
  };
  function pan(a, b, at, duration) {
    tl.fromTo('#world', { x: -a.x, y: -a.y }, { x: -b.x, y: -b.y, duration, ease: 'power3.inOut', immediateRender: false }, at);
    tl.fromTo('#root', { '--cx': a.x, '--cy': a.y }, { '--cx': b.x, '--cy': b.y, duration, ease: 'power3.inOut', immediateRender: false }, at);
  }
  function zoom(a, b, at, duration, ease = 'sine.inOut') {
    tl.fromTo('#camera-zoom', { scale: a }, { scale: b, duration, ease, immediateRender: false }, at);
    tl.fromTo('#root', { '--zoom': a }, { '--zoom': b, duration, ease, immediateRender: false }, at);
  }
  function flight(from, to, at, duration, pullback) {
    pan(from, to, at, duration);
    zoom(from.z, pullback, at, duration * .43);
    zoom(pullback, to.z, at + duration * .43, duration * .57);
  }
  tl.set('#world', { x: -views.all.x, y: -views.all.y, transformOrigin: '0 0' }, 0);
  tl.set('#camera-zoom', { scale: views.all.z, transformOrigin: '0 0' }, 0);
  tl.set('#root', { '--cx': views.all.x, '--cy': views.all.y, '--zoom': views.all.z }, 0);
  tl.addLabel('the-space', 0);
  pan(views.all, views.overview, 1.7, 1.8);
  zoom(views.all.z, views.overview.z, 1.7, 1.8, 'power3.inOut');
  tl.addLabel('overview', 3.5);
  flight(views.overview, views.workflow, 6, 2.1, .56);
  tl.addLabel('workflow', 8.1);
  flight(views.workflow, views.analytics, 11.2, 2.2, .65);
  tl.addLabel('analytics', 13.4);
  flight(views.analytics, views.detail, 16.4, 2.3, .53);
  tl.addLabel('detail', 18.7);
  pan(views.detail, views.all, 21.5, 1.9);
  zoom(views.detail.z, views.all.z, 21.5, 1.9, 'power3.inOut');
  tl.addLabel('connected', 23.4);

  // Local choreography is subordinate to camera arrivals.
  tl.fromTo('.metric', { y: 14, opacity: .65 }, { y: 0, opacity: 1, duration: .7, stagger: .09, ease: 'expo.out' }, 3.05);
  tl.fromTo('#project-count', { innerText: 0 }, { innerText: 12, snap: { innerText: 1 }, duration: 1.15, ease: 'power2.out' }, 3.3);
  tl.fromTo('#task-count', { innerText: 0 }, { innerText: 148, snap: { innerText: 1 }, duration: 1.5, ease: 'power3.out' }, 3.35);
  tl.fromTo('.spark-bars i', { scaleY: .2 }, { scaleY: 1, transformOrigin: '50% 100%', duration: .75, stagger: .07, ease: 'back.out(1.2)' }, 3.5);
  tl.fromTo('#focus-line', { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.7, ease: 'power1.inOut' }, 3.55);
  tl.fromTo('.project-row', { x: -13, opacity: .7 }, { x: 0, opacity: 1, duration: .65, stagger: .13, ease: 'power2.out' }, 3.65);
  tl.fromTo('.row-progress i', { scaleX: .08 }, { scaleX: 1, duration: 1.05, stagger: .12, ease: 'power2.inOut' }, 3.95);

  tl.fromTo('.capture-node', { scale: .95, opacity: .55 }, { scale: 1, opacity: 1, duration: .52, ease: 'back.out(1.2)' }, 8.02);
  tl.fromTo('#wire-one', { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .65, ease: 'power1.inOut' }, 8.32);
  tl.fromTo('.create-node', { y: 16, opacity: .88 }, { y: 0, opacity: 1, duration: .65, ease: 'expo.out' }, 8.85);
  tl.fromTo('#wire-two', { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .68, ease: 'sine.inOut' }, 9.22);
  tl.fromTo('.deliver-node', { scale: .95, opacity: .5 }, { scale: 1, opacity: 1, duration: .6, ease: 'back.out(1.25)' }, 9.72);
  tl.fromTo('#wire-three', { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .6, ease: 'power1.inOut' }, 9.55);
  tl.fromTo('.flow-notification', { x: -17, opacity: .2 }, { x: 0, opacity: 1, duration: .7, ease: 'power3.out' }, 10.12);

  tl.fromTo('#momentum-line', { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.65, ease: 'sine.inOut' }, 13.18);
  tl.fromTo('#area-fill', { opacity: .1 }, { opacity: 1, duration: 1.5, ease: 'power1.out' }, 13.25);
  tl.fromTo('.channel i', { scaleX: .05 }, { scaleX: 1, duration: 1.2, stagger: .14, ease: 'power2.out' }, 13.7);
  tl.fromTo('#chart-highlight', { opacity: 0 }, { opacity: 1, duration: .6, ease: 'power1.out' }, 14.7);
  tl.fromTo('.chart-tooltip', { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power3.out' }, 14.9);
  tl.fromTo('.positive-pill', { scale: .94, opacity: .6 }, { scale: 1, opacity: 1, duration: .6, ease: 'back.out(1.4)' }, 15.15);

  tl.fromTo('.task-check', { scale: .3, opacity: .3 }, { scale: 1, opacity: 1, duration: .5, stagger: .23, ease: 'back.out(1.6)' }, 18.55);
  tl.fromTo('.check-row small', { opacity: .25 }, { opacity: 1, duration: .5, stagger: .23 }, 18.6);
  tl.fromTo('#health-ring', { strokeDashoffset: 628.319 }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, 18.65);
  tl.fromTo('#health-value', { innerText: 0 }, { innerText: 100, snap: { innerText: 1 }, duration: 1.6, ease: 'power2.inOut' }, 18.65);
  tl.fromTo('.comment-card', { y: 15, opacity: .88 }, { y: 0, opacity: 1, duration: .8, ease: 'power3.out' }, 19.35);
  tl.fromTo('.launch-button', { scale: .97, opacity: .85 }, { scale: 1, opacity: 1, duration: .7, ease: 'back.out(1.15)' }, 20.1);
  tl.to('.film-tag', { opacity: 0, duration: .4 }, 1.7);
  tl.to('.film-tag', { opacity: 1, duration: .6, ease: 'sine.out' }, 23.4);
  window.__timelines = window.__timelines || {};
  window.__timelines['blackboard'] = tl;
  window.BLACKBOARD_VIEWS = views;
})();
