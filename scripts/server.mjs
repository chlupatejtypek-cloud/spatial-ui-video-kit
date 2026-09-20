import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT || 3000);
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.mjs':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.woff2':'font/woff2', '.mp4':'video/mp4', '.zip':'application/zip', '.md':'text/plain; charset=utf-8' };
http.createServer(async (req, res) => {
  try {
    let pathname = decodeURIComponent(new URL(req.url, 'http://preview.internal').pathname);
    if (pathname === '/') pathname = '/index.html';
    if (pathname.endsWith('/')) pathname += 'index.html';
    if (pathname.includes('node_modules') || pathname.includes('/.') || pathname.includes('..')) { res.writeHead(403); res.end('Forbidden'); return; }
    const filename = path.resolve(root, '.' + pathname);
    if (!filename.startsWith(root + path.sep)) { res.writeHead(403); res.end('Forbidden'); return; }
    const info = await stat(filename);
    if (!info.isFile()) throw new Error('Not a file');
    const headers = { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream', 'Cache-Control':'no-cache', 'Accept-Ranges':'bytes', 'X-Content-Type-Options':'nosniff' };
    const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if (range) {
      const start = Number(range[1]), end = Math.min(range[2] ? Number(range[2]) : info.size - 1, info.size - 1);
      if (start > end || start >= info.size) { res.writeHead(416, { 'Content-Range': `bytes */${info.size}` }); res.end(); return; }
      res.writeHead(206, { ...headers, 'Content-Length':end - start + 1, 'Content-Range':`bytes ${start}-${end}/${info.size}` });
      if (req.method === 'HEAD') res.end(); else createReadStream(filename, { start, end }).pipe(res);
    } else {
      res.writeHead(200, { ...headers, 'Content-Length':info.size });
      if (req.method === 'HEAD') res.end(); else createReadStream(filename).pipe(res);
    }
  } catch { res.writeHead(404, { 'Content-Type':'text/plain; charset=utf-8' }); res.end('Soubor nebyl nalezen.'); }
}).listen(port, '0.0.0.0', () => console.log(`Blackboard Motion Studio ready on 0.0.0.0:${port}`));
