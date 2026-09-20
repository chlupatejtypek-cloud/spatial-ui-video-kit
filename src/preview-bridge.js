// Preview-only bridge. This file is NOT part of the rendered composition.
(() => {
  const timeline = window.__timelines.blackboard;
  let exploring = false;
  let freeCamera = null;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  function camera() {
    return {
      x: -Number(gsap.getProperty('#world', 'x')),
      y: -Number(gsap.getProperty('#world', 'y')),
      z: Number(gsap.getProperty('#camera-zoom', 'scaleX'))
    };
  }
  function report(type = 'state') {
    window.parent.postMessage({ source: 'blackboard-frame', type, time: timeline.time(), playing: !timeline.paused() && timeline.time() < 24, camera: camera(), exploring }, '*');
  }
  function setCamera(c) {
    c = { x: clamp(c.x, -500, 4900), y: clamp(c.y, -400, 3300), z: clamp(c.z, .24, 1.8) };
    gsap.set('#world', { x: -c.x, y: -c.y });
    gsap.set('#camera-zoom', { scale: c.z });
    gsap.set('#root', { '--cx': c.x, '--cy': c.y, '--zoom': c.z });
    freeCamera = c;
    report();
  }
  function returnToTimeline() {
    if (!exploring) return;
    exploring = false;
    freeCamera = null;
    const time = timeline.time();
    // Force a fresh seek even if the requested time equals the old playhead.
    timeline.time(time > 12 ? 0 : 24, true).time(time, false);
  }
  timeline.eventCallback('onUpdate', () => { if (!exploring) report(); });
  timeline.eventCallback('onComplete', () => report('complete'));
  window.addEventListener('message', (event) => {
    if (event.source !== window.parent || event.data?.source !== 'blackboard-studio') return;
    const command = event.data;
    if (command.action === 'play') {
      returnToTimeline();
      if (timeline.time() >= 23.999) timeline.time(0, false);
      timeline.play();
    } else if (command.action === 'pause') timeline.pause();
    else if (command.action === 'seek') {
      returnToTimeline();
      timeline.pause().time(clamp(Number(command.time) || 0, 0, 24), false);
    } else if (command.action === 'speed') timeline.timeScale(clamp(Number(command.speed) || 1, .25, 3));
    else if (command.action === 'explore') { timeline.pause(); exploring = true; freeCamera = camera(); }
    else if (command.action === 'story') returnToTimeline();
    else if (command.action === 'camera' && exploring && command.camera) setCamera(command.camera);
    report();
  });
  document.fonts.ready.then(() => {
    timeline.pause().time(.65, false);
    report('ready');
  });
})();
