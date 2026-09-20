// Generic browser QA for any film revision, driven by revisions/<rev>/film.config.json.
// Usage: node scripts/test-film.mjs [--rev 003]   (or env FILM_REV)
// Covers: local-only assets, no app chrome, frame-zero content, narration wiring,
// deterministic forward/backward seeks, keyframe screenshots and a contact sheet.
// Revision-specific geometry assertions live in their own scripts (e.g. qa-motion-002.mjs).
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const argv = process.argv.slice(2);
let revision = process.env.FILM_REV || '006';
const flagIndex = argv.indexOf('--rev');
if (flagIndex !== -1 && argv[flagIndex + 1]) revision = argv[flagIndex + 1];
const inline = argv.find(a => a.startsWith('--rev='));
if (inline) revision = inline.split('=')[1];

const root = process.cwd();
const config = JSON.parse(await fs.readFile(path.join(root, 'revisions', revision, 'film.config.json'), 'utf8'));
const output = path.join(root, 'revisions', revision, 'qa');
await fs.mkdir(output, { recursive: true });
const { width, height, timelineKey } = config;

const pathOutput = execFileSync(process.execPath, ['scripts/hf.mjs', 'browser', 'path'], { encoding: 'utf8' });
const executablePath = pathOutput.trim().split('\n').findLast(line => line.startsWith('/'));
const browser = await puppeteer.launch({ executablePath, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'], defaultViewport: { width, height, deviceScaleFactor: 0.5 } });
const page = await browser.newPage(), errors = [], remote = [], results = [];
page.on('pageerror', e => errors.push(e.message));
page.on('request', r => { if (/^https?:/.test(r.url())) remote.push(r.url()); });

async function seek(time) {
  await page.evaluate(t => { window.__timelines[window.__config.timelineKey].pause().time(t, false); }, time);
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
}
async function test(name, fn) { await fn(); results.push({ name, pass: true }); console.log('✓ ' + name); }
async function signature(time) {
  await seek(time);
  return page.evaluate(ids => Object.fromEntries(ids.map(id => {
    const el = document.getElementById(id), s = getComputedStyle(el);
    const m = new DOMMatrix(s.transform === 'none' ? undefined : s.transform);
    const identity = m.isIdentity;
    return [id, {
      transform: identity ? 'I' : Array.from(m.toFloat64Array()).map(n => Math.round(n * 1e6) / 1e6),
      opacity: s.opacity, visibility: s.visibility, width: s.width, height: s.height,
      strokeDashoffset: s.strokeDashoffset, borderColor: s.borderColor
    }];
  })), config.signatureIds);
}
try {
  await page.goto(pathToFileURL(path.join(root, 'revisions', revision, 'composition', 'index.html')).href, { waitUntil: 'networkidle0' });
  await page.bringToFront();
  await page.evaluate(key => { window.__config = { timelineKey: key }; }, timelineKey);
  await page.evaluate(async () => { await document.fonts.ready; });

  await test('Pure local film: no external requests, no interactive web UI', async () => {
    assert.deepEqual(remote, []);
    assert.equal(await page.$('button,input,iframe,nav'), null);
  });
  await test('No branding, tool names, scene numbers or slogans', async () => {
    const text = await page.evaluate(() => document.body.innerText.toLowerCase());
    for (const word of config.brandScan) assert.ok(!text.includes(word), word);
  });
  await test('Frame zero already shows the subject', async () => {
    await seek(0);
    for (const selector of config.frameZero) {
      const r = await page.$eval(selector, el => { const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height, opacity: getComputedStyle(el).opacity }; });
      assert.ok(parseFloat(r.opacity) >= 0.5, selector + ' opacity ' + r.opacity);
      assert.ok(r.x > 0 && r.y > 0 && r.x + r.w < width && r.y + r.h < height, selector);
    }
  });
  if (config.narration && config.narration.length) {
    await test('Narration clips are wired with the planned starts', async () => {
      const clips = await page.$$eval('audio', els => els.map(e => ({ start: Number(e.dataset.start), duration: Number(e.dataset.duration), src: e.getAttribute('src') })));
      assert.equal(clips.length, config.narration.length);
      clips.sort((a, b) => a.start - b.start);
      config.narration.slice().sort((a, b) => a.start - b.start).forEach((n, i) => {
        assert.equal(clips[i].start, n.start, 'start');
        assert.equal(clips[i].duration, n.duration, 'duration');
        assert.ok(clips[i].src.endsWith(path.basename(n.file)), 'src');
      });
    });
  }
  await test('Backward and nonsequential seeks are deterministic', async () => {
    for (const time of config.seekTimes) {
      const a = await signature(time);
      await signature(config.duration);
      await signature(.2);
      const b = await signature(time);
      assert.deepEqual(b, a, 'Mismatch at ' + time);
    }
  });
  const thumbs = [];
  for (const [i, shot] of config.screenshots.entries()) {
    await seek(shot.time);
    const filename = path.join(output, `frame-${shot.name}.png`);
    await page.screenshot({ path: filename });
    const [tw, th] = config.thumb;
    const image = await sharp(filename).resize(tw, th).toBuffer();
    thumbs.push({ input: image, left: (i % config.cols) * tw, top: Math.floor(i / config.cols) * th });
  }
  const [tw, th] = config.thumb;
  const rows = Math.ceil(config.screenshots.length / config.cols);
  await sharp({ create: { width: config.cols * tw, height: rows * th, channels: 3, background: '#0d1220' } }).composite(thumbs).png().toFile(path.join(output, 'contact-sheet.png'));
  assert.deepEqual(errors, []);
  results.push({ name: 'No browser JavaScript errors', pass: true });
  await fs.writeFile(path.join(output, 'tests.json'), JSON.stringify({ passed: results.length, results, errors, remote }, null, 2));
  console.log(`\n${results.length} checks passed. Contact sheet: revisions/${revision}/qa/contact-sheet.png`);
} catch (e) {
  await fs.writeFile(path.join(output, 'tests.json'), JSON.stringify({ results, errors, remote, failure: e.stack }, null, 2));
  console.error(e);
  process.exitCode = 1;
} finally { await browser.close(); }
