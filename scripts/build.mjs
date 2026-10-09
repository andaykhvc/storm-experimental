import { build } from 'vite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { routes } from '../src/content.js';
import { renderPage, pageMeta, escape } from '../src/templates.js';

await build();
const shell = await readFile('dist/index.html', 'utf8');
for (const path of [...Object.keys(routes), '/404/']) {
  const meta = pageMeta(path);
  const html = shell
    .replace(/<title>.*?<\/title>/, `<title>${escape(meta.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*("\s*\/>)/, `$1${escape(meta.description)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*("\s*\/>)/, `$1${escape(meta.title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*("\s*\/>)/, `$1${escape(meta.description)}$2`)
    .replace('<div id="app"></div>', `<div id="app">${renderPage(path)}</div>`);
  const directory = `dist${path}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}index.html`, html);
  if (path === '/404/') await writeFile('dist/404.html', html);
}
console.log(`Pre-rendered all ${Object.keys(routes).length} website pages and the 404 page.`);
