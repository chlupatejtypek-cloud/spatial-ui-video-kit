// Generic builder for any film revision: revisions/<rev>/src -> revisions/<rev>/composition.
// Usage: node scripts/build-film.mjs [--rev 003]   (or env FILM_REV)
// Embeds local Inter fonts, copies local GSAP bundles, resolves {{icon:name}} via the
// revision's icons.mjs (fallback: src/icons.mjs), injects <audio> clips from film.config.json.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
let revision = process.env.FILM_REV || '007';
const flagIndex = argv.indexOf('--rev');
if (flagIndex !== -1 && argv[flagIndex + 1]) revision = argv[flagIndex + 1];
const inline = argv.find(a => a.startsWith('--rev='));
if (inline) revision = inline.split('=')[1];

const revDir = path.join(root, 'revisions', revision);
const source = path.join(revDir, 'src');
const output = path.join(revDir, 'composition');
const config = JSON.parse(await fs.readFile(path.join(revDir, 'film.config.json'), 'utf8'));
await fs.mkdir(path.join(output, 'assets'), { recursive: true });
await fs.mkdir(path.join(root, 'exports'), { recursive: true });

const latin = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const ext = 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';
let fonts = '';
for (const [subset, unicode] of [['latin-ext', ext], ['latin', latin]]) {
  const data = (await fs.readFile(path.join(root, `node_modules/@fontsource-variable/inter/files/inter-${subset}-wght-normal.woff2`))).toString('base64');
  fonts += `@font-face{font-family:'Inter';font-weight:100 900;font-style:normal;font-display:block;src:url(data:font/woff2;base64,${data}) format('woff2');unicode-range:${unicode}}\n`;
}
for (const name of ['gsap.min.js', 'MotionPathPlugin.min.js']) {
  const code = (await fs.readFile(path.join(root, 'node_modules/gsap/dist', name), 'utf8')).replace(/\/\/# sourceMappingURL=.*$/m, '');
  await fs.writeFile(path.join(output, 'assets', name), code);
}

let resolveIcons = s => s;
try {
  ({ resolveIcons } = await import(pathToFileURL(path.join(revDir, 'icons.mjs')).href));
} catch (error) {
  const rawHtml = await fs.readFile(path.join(source, 'film.html'), 'utf8');
  if (rawHtml.includes('{{icon:')) {
    console.warn(`Revision icon module failed to load, using the base icon set. Fix revisions/${revision}/icons.mjs. Cause: ${error.message}`);
    ({ resolveIcons } = await import(pathToFileURL(path.join(root, 'src', 'icons.mjs')).href));
  }
}

const css = await fs.readFile(path.join(source, 'film.css'), 'utf8');
let html = resolveIcons(await fs.readFile(path.join(source, 'film.html'), 'utf8'));
if (config.narration && config.narration.length) {
  const tags = config.narration.map((n, i) => `<audio id="narration-${i + 1}" data-start="${n.start}" data-duration="${n.duration}" data-track-index="${n.track ?? 2}" src="${n.file}" preload="auto"></audio>`).join('');
  html = html.replace(/(<div id="root"[^>]*>)/, `$1${tags}`);
  for (const n of config.narration) {
    const from = path.join(revDir, 'audio', path.basename(n.file));
    const to = path.join(output, 'assets', 'audio', path.basename(n.file));
    await fs.mkdir(path.dirname(to), { recursive: true });
    await fs.copyFile(from, to);
  }
}
const stickersDir = path.join(revDir, 'stickers');
if (await fs.stat(stickersDir).then(() => true).catch(() => false)) {
  await fs.mkdir(path.join(output, 'assets', 'stickers'), { recursive: true });
  for (const f of await fs.readdir(stickersDir)) {
    if (f.endsWith('.png') && f !== 'contact-sheet.png') await fs.copyFile(path.join(stickersDir, f), path.join(output, 'assets', 'stickers', f));
  }
}
const photoDir = path.join(revDir, 'photo');
if (await fs.stat(photoDir).then(() => true).catch(() => false)) {
  await fs.mkdir(path.join(output, 'assets', 'photo'), { recursive: true });
  for (const f of await fs.readdir(photoDir)) await fs.copyFile(path.join(photoDir, f), path.join(output, 'assets', 'photo', f));
}
const js = await fs.readFile(path.join(source, 'film.js'), 'utf8');
const result = `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=${config.width},height=${config.height}"><title>${config.title}</title><script src="assets/gsap.min.js"></script><script src="assets/MotionPathPlugin.min.js"></script><style>${fonts}${css}</style></head><body>${html}<script>${js}</script></body></html>`;
await fs.writeFile(path.join(output, 'index.html'), result);

try {
  await fs.copyFile(path.join(revDir, 'index.motion.json'), path.join(output, 'index.motion.json'));
} catch {}
await fs.writeFile(path.join(output, 'hyperframes.json'), JSON.stringify({ name: config.name, description: config.description }, null, 2) + '\n');

const audio = config.narration && config.narration.length ? `, ${config.narration.length} narration clips` : '';
console.log(`Built revision ${revision} (${config.width}x${config.height}, ${config.duration}s${audio}): ${Math.round(result.length / 1024)} KB. Local assets only, no studio, no runtime network requests.`);
