import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveIcons, icon } from '../src/icons.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => fs.readFile(path.join(root, p), 'utf8');
const file = p => fs.readFile(path.join(root, p));
const latin = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const ext = 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';
let fontCss = '';
for (const [family, module, name, weight] of [['Inter','@fontsource-variable/inter','inter','100 900'],['IBM Plex Mono','@fontsource/ibm-plex-mono','ibm-plex-mono','400']]) {
  for (const [subset, ranges] of [['latin-ext',ext],['latin',latin]]) {
    const suffix = family === 'Inter' ? 'wght-normal' : '400-normal';
    const data = (await file(`node_modules/${module}/files/${name}-${subset}-${suffix}.woff2`)).toString('base64');
    fontCss += `@font-face{font-family:'${family}';font-style:normal;font-display:block;font-weight:${weight};src:url(data:font/woff2;base64,${data}) format('woff2');unicode-range:${ranges}}\n`;
  }
}
const gsap = (await read('node_modules/gsap/dist/gsap.min.js')).replace(/\/\/# sourceMappingURL=.*$/m, '');
const compositionCss = fontCss + await read('src/composition.css');
const markup = resolveIcons(await read('src/composition.html'));
const compositionJs = await read('src/composition.js');
const composition = `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=1920, height=1080"><title>Blackboard — Motion Study 001</title><script src="assets/gsap.min.js"></script><style>${compositionCss}</style></head><body>${markup}<script>${compositionJs}</script></body></html>`;
await fs.mkdir(path.join(root,'composition/assets'),{recursive:true});
await fs.mkdir(path.join(root,'exports'),{recursive:true});
await fs.writeFile(path.join(root,'composition/index.html'),composition);
await fs.writeFile(path.join(root,'composition/assets/gsap.min.js'),gsap);
const previewComposition = composition.replace('<script src="assets/gsap.min.js"></script>', `<script>${gsap}</script>`).replace('</body>', `<script>${await read('src/preview-bridge.js')}</script></body>`);
const inlineJSON = value => JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
const studio = `<!doctype html>\n<html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#131612"><meta name="description" content="Blackboard Motion Lab — jedna 2D plocha, čtyři UI panely a plynulá kamera. OpenDesign × Hyperframes."><title>blackboard. — Motion Lab / Prostor 01</title><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%231c2714'/%3E%3Cpath d='M14 14h15v15H14zm21 0h15v15H35zM14 35h15v15H14z' fill='%23d3f99a'/%3E%3Ccircle cx='42.5' cy='42.5' r='7.5' fill='%23d3f99a'/%3E%3C/svg%3E"><style>${fontCss}${await read('src/studio.css')}</style></head><body>${resolveIcons(await read('src/studio.html'))}<script>window.BLACKBOARD_STANDALONE=false;window.BLACKBOARD_ICONS=${inlineJSON({play:icon('play'),pause:icon('pause')})};window.BLACKBOARD_COMPOSITION=${inlineJSON(previewComposition)};</script><script>${await read('src/studio.js')}</script></body></html>`;
await fs.writeFile(path.join(root,'index.html'),studio);
await fs.writeFile(path.join(root,'blackboard-preview.html'),studio.replace('window.BLACKBOARD_STANDALONE=false','window.BLACKBOARD_STANDALONE=true'));
console.log(`Built composition/index.html (${Math.round(composition.length/1024)} KB) and standalone studio (${Math.round(studio.length/1024)} KB). No remote assets.`);
