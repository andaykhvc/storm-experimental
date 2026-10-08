import { assets, looks, editorial, anima, stylingProjects, film, contact, routes } from './content.js';

export const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
export const normalizePath = (path) => path === '/' ? '/' : `/${path.split('/').filter(Boolean).join('/')}/`;
const arrow = '<span class="arrow" aria-hidden="true">↗</span>';
const imageDescriptions = {
  'editorial-v2-28': 'Two models in Hellion: a sculptural horned silhouette and a black tailored look with a white collar.',
  'editorial-v2-07': 'Full-length Hellion look with sculptural sleeves, a latex blouse and a fitted skirt.',
  'editorial-v2-19': 'Full-length Hellion look with a feathered headpiece and a sheer skirt with a sweeping train.',
  'editorial-v2-29': 'Two Hellion silhouettes photographed against a textured wall.',
  'presentation-8537': 'Storm Nijhuis presenting his collection book alongside the Hellion garments and models.',
  'presentation-8536': 'Storm Nijhuis speaking about his collection, with models wearing Hellion behind him.',
  'presentation-8539': 'Five models wearing Hellion at a collection presentation.',
  'presentation-8535': 'A sculptural Hellion headpiece on a table beside the collection research.',
  'presentation-8540': 'Hellion garments hanging on a rail at the collection presentation.',
  'presentation-8538': 'Two models wearing sculptural Hellion looks at a collection presentation.',
};

export function description(id) {
  if (imageDescriptions[id]) return imageDescriptions[id];
  const asset = assets.get(id);
  if (!asset) return '';
  if (asset.group === 'lookbook') {
    const n = Number(id.split('-')[1]);
    return `Hellion lookbook, look ${String(Math.ceil(n / 4)).padStart(2, '0')}, ${['front', 'side', 'back', 'alternate side'][(n - 1) % 4]} view. Full garment silhouette.`;
  }
  if (asset.group.startsWith('editorial')) return `Hellion editorial photograph ${id.split('-').at(-1)}, series ${asset.group.endsWith('v1') ? 'one' : 'two'}.`;
  if (asset.group === 'anima') return `Anima Obscura, black and white fashion editorial by Storm Nijhuis and Denise Bakker, photograph ${id.split('-').at(-1)}.`;
  if (asset.group === 'styling') return `Fashion portrait from Storm Nijhuis's styling assistance with Annet Veerbeek, image ${id.split('-').at(-1)}.`;
  if (asset.group === 'film') return `Still ${id.split('-').at(-1)} from the upcoming fashion film Hellion.`;
  return id === 'about-01' ? 'Portrait of Storm Nijhuis.' : 'Storm Nijhuis working on the sculptural garments for Hellion in the studio.';
}

export function picture(id, { eager = false, sizes = '(max-width: 700px) 100vw, 50vw', className = '' } = {}) {
  const asset = assets.get(id);
  if (!asset) throw new Error(`Missing asset: ${id}`);
  return `<img class="${className}" src="${asset.large.src}" srcset="${asset.small.src} ${asset.small.width}w, ${asset.large.src} ${asset.large.width}w" sizes="${sizes}" width="${asset.width}" height="${asset.height}" alt="${escape(description(id))}" loading="${eager ? 'eager' : 'lazy'}" ${eager ? 'fetchpriority="high"' : ''} decoding="async" />`;
}

function photo(id, options = {}) {
  return `<button class="photo-button" type="button" data-viewer="${id}" aria-label="Enlarge: ${escape(description(id))}">${picture(id, options)}<span class="photo-enlarge" aria-hidden="true">+</span></button>`;
}

function header(path) {
  const nav = [['Design', '/design/'], ['Styling', '/styling/'], ['Creative direction', '/creative-direction/'], ['About', '/about/'], ['Contact', '/contact/']];
  return `<header class="site-header"><a class="wordmark" href="/" aria-label="Storm Nijhuis home">Storm Nijhuis</a><button class="menu-button" type="button" aria-expanded="false" aria-controls="main-nav">Menu <span aria-hidden="true">+</span></button><nav id="main-nav" aria-label="Main navigation">${nav.map(([name, href]) => `<a href="${href}" ${path.startsWith(href) ? 'aria-current="page"' : ''}>${name}</a>`).join('')}</nav></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="footer-invitation"><span class="eyebrow">For work, collaborations & enquiries</span><a href="mailto:${contact.email}">Let’s talk ${arrow}</a></div><div class="footer-bottom"><a class="wordmark" href="/">Storm Nijhuis</a><span>Amsterdam, NL</span><a href="${contact.instagram}" target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href="/contact/">Contact ↗</a><span>© ${new Date().getUTCFullYear()} Storm Nijhuis</span><button type="button" class="top-button">Back to top ↑</button></div></footer>`;
}

function pageHeading({ eyebrow, title, intro = '', gothic = false }) {
  const heading = title === 'Hellion' ? '<img class="brand-logo" src="/assets/hellion-logo.png" width="1255" height="430" alt="Hellion" />' : title;
  return `<div class="page-heading"><p class="eyebrow">${eyebrow}</p><h1 class="${gothic ? 'gothic' : ''}">${heading}</h1>${intro ? `<p class="page-intro">${intro}</p>` : ''}</div>`;
}

function projectLink({ href, image, title, label, index, extra = '' }) {
  return `<a class="project-link" href="${href}"><div class="project-image">${picture(image)}<span class="project-open" aria-hidden="true">↗</span></div><div class="project-caption"><span class="project-number">${index}</span><div><h3 class="${title === 'Hellion' ? 'gothic' : ''}">${title}</h3><p>${label}</p></div>${extra ? `<span class="project-extra">${extra}</span>` : ''}${arrow}</div></a>`;
}

function home() {
  return `<section class="home-hero" aria-labelledby="home-title"><div class="hero-heading"><h1 id="home-title" class="gothic">Storm Nijhuis</h1></div><div class="hero-info"><p>Fashion design · Styling · Creative direction</p><p>Amsterdam, NL <span class="small-separator">/</span> Lichting finalist</p><a href="#introduction">Discover ↓</a></div><a class="hero-stage" href="/design/hellion/" aria-label="Explore the Hellion collection"><div>${picture('editorial-v2-07', { eager: true, sizes: '(max-width: 700px) 0px, 28vw' })}</div><div class="hero-center">${picture('editorial-v2-28', { eager: true, sizes: '(max-width: 700px) 90vw, 34vw' })}</div><div>${picture('editorial-v2-19', { eager: true, sizes: '(max-width: 700px) 0px, 28vw' })}</div></a><div class="hero-caption"><span>Selected from <span class="gothic">Hellion</span></span><span>Collection, 2026</span><a href="/design/hellion/">Explore the collection ↗</a></div></section>
    <section id="introduction" class="home-introduction section-pad reveal"><p class="eyebrow">The person behind the work</p><div class="intro-copy"><h2>I’m Storm. I work with<br />fashion, material and image.</h2><p>I’m a fashion designer, stylist and creative director based in Amsterdam. My work starts with curiosity: what a material can do, how a silhouette can move, and what clothing can say.</p><a class="text-link" href="/about/">More about me ${arrow}</a></div><a class="intro-portrait" href="/about/" aria-label="Meet Storm">${picture('presentation-8537')}<span>Storm presenting Hellion</span></a></section>
    <section class="selected-work section-pad" aria-labelledby="selected-title"><div class="section-heading reveal"><p class="eyebrow">Selected work</p><h2 id="selected-title">A closer look</h2><a class="text-link" href="/design/">Design archive ${arrow}</a></div><div class="project-pair reveal">${projectLink({ href: '/design/hellion/', image: 'editorial-v2-29', title: 'Hellion', label: 'Fashion design · Collection', index: '01', extra: '2026' })}${projectLink({ href: '/design/anima-obscura/', image: 'anima-08', title: 'Anima Obscura', label: 'Fashion design · Editorial', index: '02' })}</div></section>
    <section class="look-story" aria-label="Hellion in three looks"><div class="look-story-sticky"><div class="look-story-note"><span class="eyebrow">In the details</span><h2 class="gothic">Hellion</h2><p>Material, silhouette,<br />a different point of view.</p><a class="text-link" href="/design/hellion/#lookbook">View the lookbook ${arrow}</a></div><div class="look-story-images" data-story>${['lookbook-01', 'lookbook-17', 'lookbook-33'].map((id, i) => `<figure class="story-frame ${i === 0 ? 'is-active' : ''}" data-story-frame="${i}" aria-hidden="${i !== 0}">${picture(id, { sizes: '(max-width: 700px) 70vw, 45vw' })}</figure>`).join('')}</div><span class="story-counter" aria-hidden="true"><span data-story-counter>01</span> / 03</span></div></section>
    <section class="styling-preview section-pad reveal"><div class="section-heading"><p class="eyebrow">Styling</p><h2>Another perspective</h2><a class="text-link" href="/styling/">Explore styling ${arrow}</a></div><a class="styling-strip" href="/styling/" aria-label="Explore styling assistance work with Annet Veerbeek">${['styling-9338', 'styling-9403', 'styling-9414'].map((id) => `<div>${picture(id, { sizes: '(max-width: 700px) 50vw, 30vw' })}</div>`).join('')}</a><div class="strip-caption"><span>Selected styling assistance</span><span>With Annet Veerbeek</span></div></section>
    <section class="film-preview section-pad reveal"><div class="section-heading"><p class="eyebrow"><span class="status-dot" aria-hidden="true"></span> Upcoming next</p><h2 class="gothic">Hellion</h2><a class="text-link" href="/creative-direction/">Discover the film ${arrow}</a></div><a class="film-image" href="/creative-direction/">${picture('film-13', { sizes: '100vw' })}<span class="film-image-label">A fashion film <span>Premiere forthcoming ↗</span></span></a></section>`;
}

function design() {
  return `${pageHeading({ eyebrow: '01 / Design', title: 'Design', intro: 'Clothing as a way to explore identity. Material as a starting point.' })}<section class="design-projects section-pad"><div class="project-pair reveal">${projectLink({ href: '/design/hellion/', image: 'editorial-v2-29', title: 'Hellion', label: 'Collection · Lookbook · Editorial', index: '01', extra: '2026' })}${projectLink({ href: '/design/anima-obscura/', image: 'anima-08', title: 'Anima Obscura', label: 'Fashion editorial · With Denise Bakker', index: '02' })}</div></section>`;
}

export function renderLook(index = 0) {
  const look = looks[index];
  return `<div class="look-angle-grid" data-gallery="${look.images.join(',')}">${look.images.map((id, i) => `<figure>${photo(id, { sizes: '(max-width: 700px) 72vw, 24vw', eager: i === 0 })}<figcaption><span>Look ${look.number}</span><span>${['Front', 'Side', 'Back', 'Alternate view'][i]}</span></figcaption></figure>`).join('')}</div>`;
}

function gallery(ids, className = '', { eager = false } = {}) {
  return `<div class="photo-gallery ${className}" data-gallery="${ids.join(',')}">${ids.map((id, i) => `<figure class="reveal">${photo(id, { eager: eager && i < 2 })}</figure>`).join('')}</div>`;
}

function archive(ids, heading, featuredIds = []) {
  const remaining = ids.filter((id) => !featuredIds.includes(id));
  const portraits = remaining.filter((id) => assets.get(id).width <= assets.get(id).height);
  const landscapes = remaining.filter((id) => assets.get(id).width > assets.get(id).height);
  return `<details class="archive-details"><summary><span>${heading}</span><span class="archive-count">${ids.length} photographs</span><span class="archive-icon" aria-hidden="true">+</span></summary><div class="archive-body">${portraits.length ? gallery(portraits, 'archive-grid') : ''}${landscapes.length ? gallery(landscapes, 'landscape-grid') : ''}</div></details>`;
}

function hellion() {
  const featured = ['editorial-v1-01', 'editorial-v2-07', 'editorial-v1-07', 'editorial-v2-19', 'editorial-v2-26', 'editorial-v2-28'];
  return `${pageHeading({ eyebrow: 'Design / Collection / 2026', title: 'Hellion', gothic: true })}<section class="project-opening section-pad"><div class="project-opening-photo">${photo('editorial-v2-29', { eager: true })}</div><div class="project-opening-copy"><p class="eyebrow">Identity, reclaimed</p><h2>They called me a sinner,<br />so I became their hellion.</h2><p>Hellion is a fashion protest and a persona. Growing up queer in a small town, I learned what it meant to be seen as different. This collection turns that judgment into a way to claim space.</p><p>Historical silhouettes, sculptural materials and religious symbolism question the line between purity and sin, softness and aggression.</p><div class="project-facts"><span>Fashion & material design</span><span>Storm Nijhuis</span><span>Presented at Lichting</span><span>2026</span></div><a class="text-link" href="#lookbook">Explore every look ↓</a></div></section>
    <section id="lookbook" class="lookbook section-pad"><div class="section-heading"><p class="eyebrow">The collection</p><h2>Lookbook</h2><span class="muted">Four views of every look</span></div><div class="lookbook-navigation"><div class="look-tabs" role="tablist" aria-label="Choose a look">${looks.map((look, i) => `<button type="button" role="tab" id="look-tab-${i}" aria-controls="look-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? '0' : '-1'}" data-look="${i}">Look ${look.number}</button>`).join('')}</div><div class="look-arrows"><button type="button" data-look-step="-1" aria-label="Previous look">←</button><button type="button" data-look-step="1" aria-label="Next look">→</button></div></div><div id="look-panel" role="tabpanel" aria-labelledby="look-tab-0">${renderLook()}</div><p class="gallery-hint">Select a look. Open a photograph to see it full screen.</p></section>
    <section class="editorial-section section-pad"><div class="section-heading"><p class="eyebrow">A different point of view</p><h2>Editorial</h2><span class="muted">Hellion, in detail</span></div>${gallery(featured)}${archive(editorial, 'Explore the complete editorial', featured)}</section>
    <section class="presentation-section section-pad reveal"><div class="section-heading"><p class="eyebrow">Lichting / Presentation</p><h2>Behind the collection</h2></div><div class="presentation-layout"><div data-gallery="presentation-8536,presentation-8537">${photo('presentation-8536')}</div><div class="presentation-copy"><p>From the studio to the presentation. A look at the garments, the research and the person behind them.</p><a class="text-link" href="/about/">Meet Storm ${arrow}</a><div data-gallery="presentation-8535,presentation-8540,presentation-8538,presentation-8539,presentation-8537">${photo('presentation-8535')}</div></div></div><div class="presentation-wide" data-gallery="presentation-8539">${photo('presentation-8539', { sizes: '100vw' })}</div>${archive(['presentation-8536', 'presentation-8537', 'presentation-8535', 'presentation-8540', 'presentation-8538', 'presentation-8539'], 'More from the presentation', ['presentation-8536', 'presentation-8535', 'presentation-8539'])}</section><div class="next-project section-pad"><span class="eyebrow">Next project</span><a href="/design/anima-obscura/">Anima Obscura ${arrow}</a></div>`;
}

function animaPage() {
  const featured = ['anima-08', 'anima-18', 'anima-03', 'anima-13', 'anima-28', 'anima-09'];
  return `${pageHeading({ eyebrow: 'Design / Fashion editorial', title: 'Anima<br />Obscura' })}<section class="anima-opening section-pad"><div class="anima-opening-image" data-gallery="${anima.join(',')}">${photo('anima-08', { eager: true })}</div><div class="anima-opening-copy reveal"><p class="eyebrow">With Denise Bakker</p><h2>Between a dream<br />and a nightmare.</h2><p>A fashion editorial exploring the hidden self. Inspired by Jung’s idea of the dark anima, the series moves between intimacy and estrangement, light and shadow.</p><p>Fashion design and styling by Storm Nijhuis. Concept and creative direction with Denise Bakker.</p><div class="project-facts"><span>Photography</span><span>Denise Bakker</span><span>Models</span><span>Luanda Schuster & Jakob Weissbarth</span></div><a class="text-link" href="#anima-editorial">See the editorial ↓</a></div></section><section id="anima-editorial" class="anima-story section-pad">${gallery(featured.slice(1, 3), 'anima-pair')}<div class="editorial-line reveal"><span class="eyebrow">Anima Obscura</span><p>A performance of the hidden self.</p></div>${gallery(featured.slice(3), 'anima-sequence')}${archive(anima, 'Explore the complete series', featured)}</section><details class="credits section-pad"><summary>Project credits <span aria-hidden="true">+</span></summary><dl><dt>Concept & creative direction</dt><dd>Storm Nijhuis & Denise Bakker</dd><dt>Fashion design & styling</dt><dd>Storm Nijhuis</dd><dt>Photography</dt><dd>Denise Bakker</dd><dt>Models</dt><dd>Luanda Schuster (UNS Models)<br />Jakob Weissbarth (IZAIO Models)</dd><dt>Make-up</dt><dd>Milena Lazija</dd><dt>Hair</dt><dd>Alina Tupalova</dd><dt>Set & styling assistance</dt><dd>Nora Gustafsson</dd></dl></details><div class="next-project section-pad"><span class="eyebrow">Explore more</span><a href="/styling/">Styling ${arrow}</a></div>`;
}

function styling() {
  return `${pageHeading({ eyebrow: '02 / Styling', title: 'Styling', intro: 'A different brief, a different visual language. Selected work assisting Annet Veerbeek.' })}<div class="styling-index section-pad"><p class="eyebrow">Internship / Styling assistance</p><nav aria-label="Styling projects">${stylingProjects.map((project, i) => `<a href="#styling-${i}">${project.title} <span>↓</span></a>`).join('')}</nav></div>${stylingProjects.map((project, i) => `<section id="styling-${i}" class="styling-project section-pad"><div class="section-heading reveal"><p class="eyebrow">${String(i + 1).padStart(2, '0')} / ${project.label}</p><h2>${project.title}</h2><span class="muted">With Annet Veerbeek</span></div>${gallery(project.images.slice(0, 3), 'styling-gallery', { eager: i === 0 })}${project.images.length > 3 ? archive(project.images, 'See the rest of the shoot', project.images.slice(0, 3)) : ''}</section>`).join('')}`;
}

function creativeDirection() {
  return `${pageHeading({ eyebrow: '03 / Creative direction', title: 'Creative<br />direction', intro: 'The concept, the clothing and the image belong to the same world.' })}<section class="film-project section-pad"><div class="film-project-heading"><h2 class="gothic">Hellion</h2><p class="eyebrow"><span class="status-dot" aria-hidden="true"></span> ${film.status} / Fashion film</p></div>${film.embedUrl ? `<div class="film-player"><iframe src="${escape(film.embedUrl)}" title="Hellion fashion film" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>` : `<div class="film-still" data-gallery="${film.stills.join(',')}">${photo(film.stills[0], { eager: true, sizes: '100vw' })}</div>`}<div class="film-project-description reveal"><span class="eyebrow">Creative direction / Storm Nijhuis</span><div><h3>A collection brought<br />into moving image.</h3><p>A short fashion film extending the world of Hellion. Storm developed the garments, concept and visual identity as one connected project.</p><p class="muted">${film.embedUrl ? 'The film is now available to watch.' : 'Selected stills ahead of the premiere. The full film will be shared after its public release.'}</p></div></div>${gallery(film.stills.slice(1, 3), 'film-stills-pair')}<div class="film-wide-secondary" data-gallery="${film.stills.join(',')}">${photo('film-02', { sizes: '100vw' })}</div></section><section class="creative-process section-pad reveal"><p class="eyebrow">From concept to image</p><div><h2>Building the world<br />around the work.</h2><p>The creative direction began with material research, historical dress and the collection’s personal story. That thinking shaped the silhouettes, casting and atmosphere.</p><a class="text-link" href="/design/hellion/">Explore the collection ${arrow}</a></div><div data-gallery="about-02,about-03,about-04,about-05,about-06">${photo('about-02')}</div></section>`;
}

function about() {
  return `${pageHeading({ eyebrow: '04 / About', title: 'Storm Nijhuis', gothic: true })}<section class="about-opening section-pad"><div class="about-portrait" data-gallery="presentation-8537,about-01">${photo('presentation-8537', { eager: true })}</div><div class="about-biography reveal"><p class="eyebrow">Fashion designer / Amsterdam</p><h2>I make things<br />to understand them.</h2><p>I grew up in Zutphen, a small town where I never quite felt like I belonged. Creativity became a way of looking at the world differently, and eventually a way of building something of my own.</p><p>At a Rudolf Steiner school, I learned to trust instinct and work with my hands. I went on to study product and textile design at CIBAP, then fashion design at AMFI. An exchange at the Swedish School of Textiles took me deeper into designing from materials.</p><p>My practice moves between fashion design, styling, material research and creative direction. I’m drawn to contrast: softness against aggression, beauty against discomfort, control against vulnerability.</p><p>Hellion is the most personal part of that practice. It’s a space for the things that once made me feel different.</p><a class="text-link" href="/assets/storm-nijhuis-cv.pdf" target="_blank" rel="noopener">View my CV ${arrow}</a></div></section><section class="experience section-pad"><div class="section-heading"><p class="eyebrow">Experience & education</p><h2>Always making</h2></div><div class="experience-grid"><div><h3>Education</h3><dl class="experience-list"><dt>2022–2026</dt><dd>AMFI<span>Fashion Design</span></dd><dt>Exchange</dt><dd>Swedish School of Textiles<span>Material research</span></dd><dt>2018–2022</dt><dd>CIBAP<span>Product Design · Textiles</span></dd></dl></div><div><h3>Studio & styling internships</h3><ul class="studio-list"><li>Untitled Rubber<span>Design & fabrication</span></li><li>Annet Veerbeek<span>Styling assistance</span></li><li>Zyanya Keizer<span>Couture & garment construction</span></li><li>House of Useless<span>Atelier & pattern cutting</span></li><li>Liesbeth Sterkenburg<span>Atelier & pattern cutting</span></li></ul></div><div><h3>Work</h3><dl class="experience-list"><dt>2025</dt><dd>Zipper Vintage<span>Styling & visual merchandising</span></dd><dt>2022</dt><dd>H&M<span>Garment alterations & sales</span></dd><dt>2026</dt><dd>Lichting<span>Finalist</span></dd></dl><h3 class="skills-title">Working with</h3><p class="skills-copy">Pattern cutting, latex, draping, textile development, tufting, 3D sculpting and garment construction.</p></div></div></section><section class="studio-section section-pad"><div class="section-heading"><p class="eyebrow">In the studio</p><h2>The work starts here</h2></div>${gallery(['about-02', 'about-04'], 'studio-pair')}${archive(['about-01', 'about-02', 'about-03', 'about-04', 'about-05', 'about-06'], 'More from the studio', ['about-02', 'about-04'])}</section>`;
}

function contactPage() {
  return `${pageHeading({ eyebrow: '05 / Contact', title: 'Let’s talk', intro: 'For fashion design, styling, creative direction and collaborations.' })}<section class="contact-page section-pad"><a class="contact-email" href="mailto:${contact.email}">${contact.email} ${arrow}</a><div class="contact-details"><div><span class="eyebrow">Call</span><a href="tel:${contact.telephone}">${contact.phone} ↗</a></div><div><span class="eyebrow">Instagram</span><a href="${contact.instagram}" target="_blank" rel="noopener noreferrer">@hellion.sin ↗</a></div><div><span class="eyebrow">Based in</span><span>Amsterdam, Netherlands</span></div><div><span class="eyebrow">Portfolio</span><a href="/assets/storm-nijhuis-cv.pdf" target="_blank" rel="noopener">View CV ↗</a></div></div></section>`;
}

function notFound() {
  return `${pageHeading({ eyebrow: '404 / Page not found', title: 'A wrong turn', intro: 'This page isn’t here. The work is just a click away.' })}<div class="section-pad"><a class="text-link" href="/">Back to Storm Nijhuis ${arrow}</a></div>`;
}

const pages = { '/': home, '/design/': design, '/design/hellion/': hellion, '/design/anima-obscura/': animaPage, '/styling/': styling, '/creative-direction/': creativeDirection, '/about/': about, '/contact/': contactPage };

export function renderPage(path) {
  const normalized = normalizePath(path);
  return `${header(normalized)}<main id="main" data-route="${normalized}" tabindex="-1">${(pages[normalized] || notFound)()}</main>${normalized === '/contact/' ? '<div class="contact-footer-spacer"></div>' : ''}${footer()}<dialog class="image-viewer" aria-label="Full screen photograph viewer"><div class="viewer-toolbar"><span data-viewer-title></span><button type="button" data-viewer-close aria-label="Close photograph viewer">Close <span aria-hidden="true">×</span></button></div><div class="viewer-stage"><button type="button" class="viewer-prev" data-viewer-step="-1" aria-label="Previous photograph">←</button><img data-viewer-image alt="" /><button type="button" class="viewer-next" data-viewer-step="1" aria-label="Next photograph">→</button></div><div class="viewer-bottom"><span data-viewer-counter aria-live="polite"></span><span>← → to browse <span class="viewer-desktop-hint">/ Esc to close</span></span></div></dialog>`;
}

export function pageMeta(path) {
  const meta = routes[normalizePath(path)] || { title: 'Page not found', description: 'Explore the portfolio of Storm Nijhuis.' };
  return { ...meta, title: path === '/' ? 'Storm Nijhuis — Fashion Design, Styling & Creative Direction' : `${meta.title} — Storm Nijhuis` };
}
