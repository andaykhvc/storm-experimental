import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import { assets, looks, lookbook, editorial, anima, stylingProjects, film, routes } from '../src/content.js';
import { renderPage, pageMeta } from '../src/templates.js';

assert.equal(lookbook.length, 36, 'Include all 36 supplied lookbook photographs.');
assert.equal(looks.length, 9);
assert(looks.every((look) => look.images.length === 4), 'Every supplied look has four views.');
assert.deepEqual(looks.flatMap((look) => look.images), lookbook);
assert.equal(editorial.length, 45);
assert.equal(anima.length, 28);
assert.equal(stylingProjects.flatMap((project) => project.images).length, 15);
assert.equal(new Set(stylingProjects.flatMap((project) => project.images)).size, 15);
assert.equal(film.embedUrl, null, 'Keep unreleased film playback disabled.');

for (const asset of assets.values()) {
  for (const size of ['large', 'small']) {
    await access(`public${asset[size].src}`);
    const ratio = asset.width / asset.height;
    assert(Math.abs(asset[size].width / asset[size].height - ratio) < 0.007, `Changed aspect ratio: ${asset.id}`);
  }
}

const links = new Set();
for (const path of Object.keys(routes)) {
  const html = renderPage(path);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `One main heading: ${path}`);
  assert(html.includes(`data-route="${path}"`));
  assert(pageMeta(path).description.length > 40);
  assert(!/graduation collection/i.test(html), 'Use the Hellion collection title.');
  assert(!/<video|<iframe/i.test(html), 'No prerelease movie or reels.');
  for (const match of html.matchAll(/data-viewer="([^"]+)"/g)) assert(assets.has(match[1]));
  for (const match of html.matchAll(/href="(\/[^"#]*)/g)) links.add(match[1]);
}
for (const link of links) {
  if (link.startsWith('/assets/')) await access(`public${link}`);
  else assert(link in routes, `Invalid internal link: ${link}`);
}
for (const file of await readdir('public/assets')) assert(!/\.(mp4|mov|pptx|tif)$/i.test(file), `Private source exposed: ${file}`);
const css = await readFile('src/styles.css', 'utf8');
assert(!/filter\s*:|object-fit\s*:\s*cover/i.test(css), 'Preserve photo colours and full frames.');
assert(css.includes('prefers-reduced-motion'));
console.log(`Content checks passed: ${Object.keys(routes).length} routes, ${assets.size} images, complete lookbook and archives, valid links, no unreleased footage.`);
