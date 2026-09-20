(() => {
  // Capture the pristine document before any playhead, exploration or iframe state changes.
  let cleanDocument = '<!doctype html>\n' + document.documentElement.outerHTML;
  if (!window.BLACKBOARD_STANDALONE) cleanDocument = cleanDocument.replace('window.BLACKBOARD_STANDALONE=false', 'window.BLACKBOARD_STANDALONE=true');
  const $ = (id) => document.getElementById(id);
  const frame = $('composition-frame');
  const stage = $('stage');
  const scenes = [
    { label: 'Přehled', time: 3.6, start: 1.7, end: 6 },
    { label: 'Workflow', time: 8.16, start: 6, end: 11.2 },
    { label: 'Analytika', time: 13.5, start: 11.2, end: 16.4 },
    { label: 'Detail', time: 18.8, start: 16.4, end: 21.5 }
  ];
  const state = { ready: false, playing: false, loop: true, time: .65, mode: 'play', speed: 1, camera: { x: 2180, y: 1460, z: .385 }, scale: 1, offsetX: 0, offsetY: 0 };
  const icons = window.BLACKBOARD_ICONS;
  let lastPlaying = null, lastScene = null, scrubResume = false, toastTimer, dragging = null;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const send = (action, data = {}) => frame.contentWindow.postMessage({ source: 'blackboard-studio', action, ...data }, '*');
  const format = (n) => `${String(Math.floor(n / 60)).padStart(2, '0')}:${(n % 60).toFixed(1).padStart(4, '0')}`;
  function toast(message) {
    $('toast').textContent = message;
    $('toast').classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $('toast').classList.remove('visible'), 2700);
  }
  function fitFrame() {
    const w = stage.clientWidth, h = stage.clientHeight;
    state.scale = Math.min(w / 1920, h / 1080);
    state.offsetX = (w - 1920 * state.scale) / 2;
    state.offsetY = (h - 1080 * state.scale) / 2;
    frame.style.transform = `translate(${state.offsetX}px,${state.offsetY}px) scale(${state.scale})`;
  }
  new ResizeObserver(fitFrame).observe(stage);
  function renderState() {
    $('current-time').textContent = format(state.time);
    $('scrubber').value = String(state.time);
    $('playhead').style.left = `${state.time / 24 * 100}%`;
    if (lastPlaying !== state.playing) {
      $('play-button').innerHTML = state.playing ? icons.pause : icons.play;
      $('play-button').setAttribute('aria-label', state.playing ? 'Pozastavit animaci' : 'Přehrát animaci');
      lastPlaying = state.playing;
    }
    const currentScene = scenes.findIndex(s => state.time >= s.start && state.time < s.end);
    if (currentScene !== lastScene) {
      document.querySelectorAll('.scene-button').forEach((button, i) => {
        button.classList.toggle('active', i === currentScene);
        button.setAttribute('aria-current', i === currentScene ? 'step' : 'false');
      });
      document.querySelectorAll('.map-panel').forEach((panel, i) => panel.classList.toggle('active', i === currentScene));
      $('overview-button').classList.toggle('active', currentScene === -1);
      lastScene = currentScene;
    }
    $('camera-label').textContent = state.mode === 'explore' ? 'VOLNÝ POHYB KAMERY' : currentScene === -1 ? 'CELÝ PROSTOR' : `0${currentScene + 1} / ${scenes[currentScene].label.toLocaleUpperCase('cs')}`;
    const { x, y, z } = state.camera;
    $('camera-xy').textContent = `X ${Math.round(x)} · Y ${Math.round(y)}`;
    $('camera-z').textContent = `${Math.round(z * 100)}%`;
    $('zoom-label').textContent = `${Math.round(z * 100)}%`;
    const view = $('map-viewport');
    view.setAttribute('x', x - 960 / z);
    view.setAttribute('y', y - 540 / z);
    view.setAttribute('width', 1920 / z);
    view.setAttribute('height', 1080 / z);
  }
  function setMode(mode) {
    if (state.mode === mode) return;
    state.mode = mode;
    const exploring = mode === 'explore';
    state.playing = false;
    stage.classList.toggle('exploring', exploring);
    $('mode-play').classList.toggle('active', !exploring);
    $('mode-explore').classList.toggle('active', exploring);
    $('mode-play').setAttribute('aria-pressed', String(!exploring));
    $('mode-explore').setAttribute('aria-pressed', String(exploring));
    send(exploring ? 'explore' : 'story');
    send('pause');
    renderState();
  }
  function playPause() {
    if (!state.ready) return;
    if (state.mode === 'explore') setMode('play');
    if (state.playing) { state.playing = false; send('pause'); }
    else { state.playing = true; send('play'); }
    renderState();
  }
  function seek(time, resume = false) {
    setMode('play');
    state.time = clamp(time, 0, 24);
    state.playing = resume;
    send('seek', { time: state.time });
    if (resume) send('play');
    renderState();
  }
  function jump(index) {
    seek(scenes[index].time);
    toast(`0${index + 1} / ${scenes[index].label} — mezerníkem pokračuj`);
  }
  function allSpace() {
    if (state.mode === 'explore') moveCamera({ x: 2180, y: 1460, z: .385 });
    else seek(.65);
  }
  function moveCamera(camera) {
    state.camera = { x: clamp(camera.x, -500, 4900), y: clamp(camera.y, -400, 3300), z: clamp(camera.z, .24, 1.8) };
    send('camera', { camera: state.camera });
    renderState();
  }
  window.addEventListener('message', (event) => {
    if (event.source !== frame.contentWindow || event.data?.source !== 'blackboard-frame') return;
    const message = event.data;
    if (message.type === 'ready') {
      state.ready = true;
      $('loading').style.display = 'none';
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduceMotion) { send('play'); state.playing = true; }
      fitFrame();
    }
    if (message.camera) state.camera = message.camera;
    state.time = message.time;
    state.playing = message.playing;
    if (message.type === 'complete' && state.loop && state.mode === 'play') { send('seek', { time: 0 }); send('play'); }
    renderState();
  });
  frame.srcdoc = window.BLACKBOARD_COMPOSITION;
  $('play-button').addEventListener('click', playPause);
  $('restart-button').addEventListener('click', () => seek(0, true));
  $('brand-home').addEventListener('click', e => { e.preventDefault(); allSpace(); });
  $('overview-button').addEventListener('click', allSpace);
  $('mode-play').addEventListener('click', () => setMode('play'));
  $('mode-explore').addEventListener('click', () => { setMode('explore'); toast('Tvůj prostor. Táhni plochu nebo použij kolečko.'); });
  document.querySelectorAll('.scene-button').forEach(button => button.addEventListener('click', () => jump(Number(button.dataset.scene))));
  $('scrubber').addEventListener('pointerdown', () => { scrubResume = state.playing; send('pause'); });
  $('scrubber').addEventListener('input', e => seek(Number(e.target.value)));
  $('scrubber').addEventListener('change', e => { seek(Number(e.target.value), scrubResume); scrubResume = false; });
  $('loop-button').addEventListener('click', () => {
    state.loop = !state.loop;
    $('loop-button').classList.toggle('active', state.loop);
    $('loop-button').setAttribute('aria-pressed', String(state.loop));
    $('loop-button').setAttribute('aria-label', `Opakování ${state.loop ? 'zapnuto' : 'vypnuto'}`);
    toast(`Opakování ${state.loop ? 'zapnuto' : 'vypnuto'}`);
  });
  $('speed-button').addEventListener('click', () => {
    const speeds = [.5, .75, 1, 1.25, 1.5, 2];
    state.speed = speeds[(speeds.indexOf(state.speed) + 1) % speeds.length];
    send('speed', { speed: state.speed });
    $('speed-button').textContent = `${state.speed.toLocaleString('cs')}×`;
    toast(`Rychlost přehrávání ${state.speed.toLocaleString('cs')}×`);
  });
  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (stage.requestFullscreen) await stage.requestFullscreen();
      else toast('Tento prohlížeč režim celé obrazovky nepodporuje.');
    } catch { toast('Celá obrazovka je v tomto vloženém náhledu omezená.'); }
  }
  $('fullscreen-button').addEventListener('click', fullscreen);
  document.addEventListener('fullscreenchange', fitFrame);
  const surface = $('explore-surface');
  surface.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    dragging = { px: e.clientX, py: e.clientY, ...state.camera };
    surface.setPointerCapture(e.pointerId);
    surface.classList.add('dragging');
  });
  surface.addEventListener('pointermove', e => {
    if (!dragging) return;
    moveCamera({ x: dragging.x - (e.clientX - dragging.px) / (state.scale * dragging.z), y: dragging.y - (e.clientY - dragging.py) / (state.scale * dragging.z), z: dragging.z });
  });
  function endDrag() { dragging = null; surface.classList.remove('dragging'); }
  surface.addEventListener('pointerup', endDrag);
  surface.addEventListener('pointercancel', endDrag);
  surface.addEventListener('wheel', e => {
    e.preventDefault();
    const rect = stage.getBoundingClientRect();
    const px = (e.clientX - rect.left - state.offsetX) / state.scale;
    const py = (e.clientY - rect.top - state.offsetY) / state.scale;
    const z = clamp(state.camera.z * Math.exp(-e.deltaY * .0014), .24, 1.8);
    moveCamera({ x: state.camera.x + (px - 960) / state.camera.z - (px - 960) / z, y: state.camera.y + (py - 540) / state.camera.z - (py - 540) / z, z });
  }, { passive: false });
  $('zoom-in').addEventListener('click', () => moveCamera({ ...state.camera, z: state.camera.z * 1.2 }));
  $('zoom-out').addEventListener('click', () => moveCamera({ ...state.camera, z: state.camera.z / 1.2 }));
  $('zoom-fit').addEventListener('click', allSpace);
  $('map-button').addEventListener('click', e => {
    if (state.mode !== 'explore') return allSpace();
    const rect = $('minimap').getBoundingClientRect();
    moveCamera({ ...state.camera, x: ((e.clientX - rect.left) / rect.width) * 4600 - 100, y: ((e.clientY - rect.top) / rect.height) * 3000 - 100 });
  });
  const menu = $('export-menu');
  $('export-button').addEventListener('click', () => { menu.hidden = !menu.hidden; $('export-button').setAttribute('aria-expanded', String(!menu.hidden)); });
  document.addEventListener('click', e => { if (!menu.contains(e.target) && !$('export-button').contains(e.target)) menu.hidden = true; });
  $('download-html').addEventListener('click', e => {
    e.preventDefault();
    const html = cleanDocument;
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = 'blackboard-preview.html'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    menu.hidden = true;
  });
  ['download-video', 'download-source'].forEach(id => $(id).addEventListener('click', e => {
    if (window.BLACKBOARD_STANDALONE || location.protocol === 'file:') {
      e.preventDefault(); toast('MP4 a ZIP najdeš samostatně mezi soubory projektu nebo v živém náhledu.');
    }
    menu.hidden = true;
  }));
  const help = $('help-dialog');
  $('help-button').addEventListener('click', () => help.showModal());
  $('close-help').addEventListener('click', () => help.close());
  help.addEventListener('click', e => { if (e.target === help) { const r = help.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) help.close(); } });
  document.addEventListener('keydown', e => {
    if (e.target.matches('input,textarea,select') || e.ctrlKey || e.metaKey || e.altKey || help.open) return;
    if (e.code === 'Space') { e.preventDefault(); playPause(); }
    else if (/^[1-4]$/.test(e.key)) jump(Number(e.key) - 1);
    else if (e.key === '0') allSpace();
    else if (e.key.toLowerCase() === 'r') seek(0, true);
    else if (e.key.toLowerCase() === 'e') setMode(state.mode === 'explore' ? 'play' : 'explore');
    else if (e.key.toLowerCase() === 'l') $('loop-button').click();
    else if (e.key.toLowerCase() === 'f') fullscreen();
    else if (e.key === 'ArrowLeft') { e.preventDefault(); seek(state.time - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); seek(state.time + 1); }
    else if (e.key === '?') help.showModal();
    else if (e.key === 'Escape') { menu.hidden = true; if (state.mode === 'explore') setMode('play'); }
  });
  // Diagnostic hook for local automated tests; no network or telemetry.
  window.BlackboardStudio = { getState: () => ({ ...state }), seek, setMode, jump, playPause, allSpace };
  renderState(); fitFrame();
})();
