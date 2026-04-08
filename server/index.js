const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const { ensureStore } = require('./data/store');
const { handleApi } = require('./routes');

const publicDir = path.join(__dirname, '..', 'public');
const port = Number(process.env.PORT || 4317);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

function createServer() {
  ensureStore();

  return http.createServer((req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');

    if (req.url.startsWith('/api/')) {
      handleApi(req, res);
      return;
    }

    serveStatic(req, res);
  });
}

function startServer(serverPort = port) {
  const server = createServer();
  server.listen(serverPort, () => {
    console.log(`NyaayaMitra Launchpad running at http://localhost:${serverPort}`);
  });
  return server;
}

if (require.main === module) {
  startServer();
}

function serveStatic(req, res) {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    res.end('Method Not Allowed');
    return;
  }

  const requestPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname);
  const safePath = requestPath === '/' ? '/index.html' : requestPath;
  const filePath = path.normalize(path.join(publicDir, safePath));

  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      fs.readFile(path.join(publicDir, 'index.html'), (fallbackError, fallback) => {
        if (fallbackError) {
          res.writeHead(404);
          res.end('Not Found');
          return;
        }
        res.writeHead(200, { 'Content-Type': mimeTypes['.html'] });
        res.end(req.method === 'HEAD' ? undefined : fallback);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Cache-Control': ['.html', '.css', '.js'].includes(ext) ? 'no-store' : 'public, max-age=3600'
    });
    res.end(req.method === 'HEAD' ? undefined : content);
  });
}

module.exports = { createServer, startServer };
