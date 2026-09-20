import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ffmpeg = require('ffmpeg-static');
const ffprobe = require('ffprobe-static').path;
const env = { ...process.env, DO_NOT_TRACK:'1', HYPERFRAMES_TELEMETRY_DISABLED:'1', PATH: [path.dirname(process.execPath), path.dirname(ffmpeg), path.dirname(ffprobe), process.env.PATH].join(path.delimiter), FFMPEG_PATH:ffmpeg, FFPROBE_PATH:ffprobe };
// Some sandboxes mount /tmp as a tiny RAM disk; render temp files on the workspace volume.
env.TMPDIR = process.env.BLACKBOARD_TMPDIR || path.join(root, '.cache', 'hyperframes-tmp');
mkdirSync(env.TMPDIR, { recursive:true });
if (process.platform === 'win32') { env.TEMP = env.TMPDIR; env.TMP = env.TMPDIR; }
const child = spawn(process.execPath, [path.join(root, 'node_modules/hyperframes/bin/hyperframes.mjs'), ...process.argv.slice(2)], { stdio:'inherit', cwd:root, env });
child.on('exit', code => process.exit(code ?? 1));
child.on('error', error => { console.error(error); process.exit(1); });
