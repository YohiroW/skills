#!/usr/bin/env node
'use strict';

// Cross-platform export for Frontend Slides' fixed-stage HTML decks.
// Requires playwright (or playwright-core) and an installed Chromium browser.
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');

const HELP = `Usage: node export-pdf.cjs <input.html> [output.pdf] [options]

Options:
  --compact                  Capture at 1280x720 instead of 1920x1080
  --browser <channel>        Use installed msedge or chrome
  --executable-path <path>   Use an explicit Chromium executable
  --help                     Show this help

Requires playwright or playwright-core (resolved normally or via NODE_PATH).
No packages or browsers are installed automatically. Output is a raster PDF.`;

function parseArgs(args) {
  const options = { compact: false };
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') return { help: true };
    if (arg === '--compact') options.compact = true;
    else if (arg === '--browser' || arg === '--executable-path') {
      const value = args[++i];
      if (!value || value.startsWith('--')) throw new Error(`Missing value for ${arg}`);
      options[arg === '--browser' ? 'channel' : 'executablePath'] = value;
    } else if (arg.startsWith('--')) throw new Error(`Unknown option: ${arg}`);
    else positional.push(arg);
  }
  if (positional.length < 1 || positional.length > 2) throw new Error(HELP);
  options.input = path.resolve(positional[0]);
  if (!/\.html?$/i.test(options.input)) throw new Error('Input must be an HTML file.');
  options.output = path.resolve(positional[1] || options.input.replace(/\.html?$/i, '.pdf'));
  if (!/\.pdf$/i.test(options.output)) throw new Error('Output must have a .pdf extension.');
  if (options.channel && options.executablePath) {
    throw new Error('Choose --browser or --executable-path, not both.');
  }
  return options;
}

function loadChromium() {
  for (const name of ['playwright', 'playwright-core']) {
    let location;
    try { location = require.resolve(name); }
    catch (error) {
      if (error.code === 'MODULE_NOT_FOUND') continue;
      throw error;
    }
    return require(location).chromium;
  }
  throw new Error('Playwright is unavailable. Set NODE_PATH to its node_modules directory; see references/conversion-and-sharing.md.');
}

async function serveDirectory(root) {
  const realRoot = await fs.realpath(root);
  const mime = {
    '.html': 'text/html; charset=utf-8', '.htm': 'text/html; charset=utf-8',
    '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml', '.gif': 'image/gif', '.webp': 'image/webp',
    '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
    '.mp4': 'video/mp4', '.webm': 'video/webm',
  };
  const server = http.createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const filename = await fs.realpath(path.resolve(realRoot, '.' + pathname));
      const relative = path.relative(realRoot, filename);
      if (path.isAbsolute(relative) || relative === '..' || relative.startsWith('..' + path.sep)) {
        response.writeHead(403).end('Forbidden');
        return;
      }
      const data = await fs.readFile(filename);
      response.writeHead(200, { 'Content-Type': mime[path.extname(filename).toLowerCase()] || 'application/octet-stream' });
      response.end(data);
    } catch {
      response.writeHead(404).end('Not found');
    }
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  return server;
}

async function exportPdf(options) {
  const stat = await fs.stat(options.input);
  if (!stat.isFile()) throw new Error('Input must be a regular HTML file.');
  const chromium = loadChromium();
  const width = options.compact ? 1280 : 1920;
  const height = options.compact ? 720 : 1080;
  const server = await serveDirectory(path.dirname(options.input));
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      ...(options.channel ? { channel: options.channel } : {}),
      ...(options.executablePath ? { executablePath: options.executablePath } : {}),
    });
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    page.on('pageerror', error => console.warn(`Page script error: ${error.message}`));
    const url = `http://127.0.0.1:${server.address().port}/${encodeURIComponent(path.basename(options.input))}`;
    await page.goto(url, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const slideCount = await page.locator('.slide').count();
    if (!slideCount) throw new Error('No .slide elements found. This helper exports fixed-stage Frontend Slides decks.');
    if (await page.locator('.deck-stage').count() !== 1) {
      throw new Error('Expected one .deck-stage containing the slides. Adapt this deck before exporting.');
    }
    // Keep the original stage geometry and slide display/layout properties.
    await page.addStyleTag({ content: `
      .deck-controls, .edit-hotzone, .edit-toggle, [data-export-hide] { display: none !important; }
      .slide { visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; }
      .slide[data-export-current] { visibility: visible !important; opacity: 1 !important; }
      .slide[data-export-current] .reveal { visibility: visible !important; opacity: 1 !important; transform: none !important; }
    ` });
    const screenshots = [];
    for (let i = 0; i < slideCount; i++) {
      await page.evaluate(index => {
        // Call the optional controller first for decks with per-slide state.
        const controller = window.presentation;
        if (typeof controller?.showSlide === 'function') controller.showSlide(index);
        else if (typeof controller?.goToSlide === 'function') controller.goToSlide(index);
        document.querySelectorAll('.slide').forEach((slide, current) => {
          slide.classList.toggle('active', current === index);
          slide.classList.toggle('visible', current === index);
          slide.toggleAttribute('data-export-current', current === index);
        });
      }, i);
      const brokenImages = await page.evaluate(async () => {
        const slide = document.querySelector('[data-export-current]');
        const images = [...slide.querySelectorAll('img')];
        await Promise.all(images.map(async img => {
          img.loading = 'eager';
          try { await img.decode(); } catch { /* Report below. */ }
        }));
        return images.filter(img => !img.naturalWidth).map(img => img.getAttribute('src'));
      });
      if (brokenImages.length) throw new Error(`Slide ${i + 1} has unloaded images: ${brokenImages.join(', ')}`);
      await page.evaluate(async () => {
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        for (const animation of document.getAnimations()) {
          const timing = animation.effect?.getComputedTiming();
          if (timing && Number.isFinite(timing.endTime)) {
            try { animation.finish(); } catch { animation.pause(); }
          } else animation.pause();
        }
      });
      screenshots.push(await page.screenshot({ type: 'png', fullPage: false }));
      console.log(`Captured slide ${i + 1}/${slideCount}`);
    }

    const pdfPage = await browser.newPage();
    const pages = screenshots.map(buffer => `<div class="page"><img src="data:image/png;base64,${buffer.toString('base64')}" /></div>`).join('');
    await pdfPage.setContent(`<!doctype html><html><head><style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      @page { size: ${width}px ${height}px; margin: 0; }
      .page { width: ${width}px; height: ${height}px; break-after: page; overflow: hidden; }
      .page:last-child { break-after: auto; }
      img { display: block; width: 100%; height: 100%; }
    </style></head><body>${pages}</body></html>`, { waitUntil: 'load' });
    await pdfPage.evaluate(() => Promise.all([...document.images].map(img => img.decode())));
    await fs.mkdir(path.dirname(options.output), { recursive: true });
    await pdfPage.pdf({
      path: options.output, width: `${width}px`, height: `${height}px`,
      preferCSSPageSize: true, printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    console.log(`Saved ${slideCount} pages to ${options.output}`);
    return { slideCount, width, height, output: options.output };
  } finally {
    try { if (browser) await browser.close(); }
    finally {
      server.closeAllConnections();
      await new Promise(resolve => server.close(resolve));
    }
  }
}

if (require.main === module) {
  (async () => {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) console.log(HELP);
    else await exportPdf(options);
  })().catch(error => { console.error(error.message); process.exitCode = 1; });
}

module.exports = { parseArgs, exportPdf };
