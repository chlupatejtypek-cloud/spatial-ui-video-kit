// Fish Audio narration generator — one command to (re)generate every beat.
//
//   export FISH_API_KEY=<your Fish Audio API key>   # never commit this
//   node scripts/narrate-fish.mjs --rev 005 [--voice <reference_id>] [--model s2-pro] [--speed 1.12]
//
// Beats are read from revisions/<rev>/narration-script.json:
//   { "voice": "<optional reference_id>", "beats": [{ "id": "beat-1", "text": "…" }, …] }
// Output: revisions/<rev>/audio-src/beat-N.mp3, then speed-adjusted copies in
// revisions/<rev>/audio/beat-N.mp3. MEASURE the results (ffprobe) and put the
// measured durations into film.config.json — then let the Hyperframes check be
// the final arbiter (it re-measures media and flags slot mismatches).
//
// STATUS: the current Fish key has no API credit (HTTP 402 "Insufficient API
// credit"), so revision 005 shipped with the fallback voice sped up via atempo.
// Once credit is added, run this script and re-measure; the timeline only needs
// the new numbers in film.config.json (visual beats are authored relative to
// the beat starts, which stay where the config puts them).
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const argOf = (name, fallback) => {
  const i = argv.indexOf(name);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback;
};
const revision = argOf('--rev', process.env.FILM_REV || '005');
const model = argOf('--model', 's2-pro');
const speed = Number(argOf('--speed', '1.12'));
const voice = argOf('--voice', null);
const apiKey = process.env.FISH_API_KEY;
if (!apiKey) { console.error('Set FISH_API_KEY first. Never pass the key as a CLI argument (it leaks into shell history).'); process.exit(1); }

const revDir = path.join(root, 'revisions', revision);
const script = JSON.parse(await fs.readFile(path.join(revDir, 'narration-script.json'), 'utf8'));
await fs.mkdir(path.join(revDir, 'audio-src'), { recursive: true });
await fs.mkdir(path.join(revDir, 'audio'), { recursive: true });

const ffmpeg = (await import('ffmpeg-static')).default;
for (const [i, beat] of script.beats.entries()) {
  const raw = path.join(revDir, 'audio-src', `${beat.id}.mp3`);
  const body = { text: beat.text, format: 'mp3', mp3_bitrate: 192, temperature: 0.7 };
  if (voice ?? script.voice) body.reference_id = voice ?? script.voice;
  const res = await fetch('https://api.fish.audio/v1/tts', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', model },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    console.error(`beat ${beat.id}: HTTP ${res.status} ${await res.text()}`);
    process.exit(1);
  }
  await fs.writeFile(raw, Buffer.from(await res.arrayBuffer()));
  execFileSync(ffmpeg, ['-y', '-v', 'error', '-i', raw, '-filter:a', `atempo=${speed}`, '-b:a', '128k',
    path.join(revDir, 'audio', `${beat.id}.mp3`)]);
  console.log(`✓ ${beat.id} generated (${(await fs.stat(raw)).size} bytes raw, speed ×${speed})`);
}
console.log(`\nDone. Now: ffprobe revisions/${revision}/audio/*.mp3 → put durations into film.config.json → npm test.`);
