import './styles.css';
import { assets, looks } from './content.js';
import { renderPage, renderLook, normalizePath, pageMeta, description } from './templates.js';

const app = document.querySelector('#app');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const easeOut = 'cubic-bezier(0.23, 1, 0.32, 1)';
const easeDrawer = 'cubic-bezier(0.32, 0.72, 0, 1)';
let dispose = () => {};
let firstBind = true;

function setMetadata(path) {
  const meta = pageMeta(path);
  document.title = meta.title;
  document.querySelector('meta[name="description"]').content = meta.description;
  document.querySelector('meta[property="og:title"]').content = meta.title;
  document.querySelector('meta[property="og:description"]').content = meta.description;
}

// The visible box of an object-fit: contain image, which is smaller than the element itself.
function containedRect(element, asset) {
  const box = element.getBoundingClientRect();
  const ratio = asset.width / asset.height;
  let width = box.width;
  let height = width / ratio;
  if (height > box.height) { height = box.height; width = height * ratio; }
  return { left: box.left + (box.width - width) / 2, top: box.top + (box.height - height) / 2, width, height };
}

function bindPage() {
  dispose();
  const controller = new AbortController();
  const { signal } = controller;
  const listen = (target, event, handler, options = {}) => target.addEventListener(event, handler, { ...options, signal });
  const motion = () => !reducedMotion.matches;
  let revealObserver;
  let headerFrame;
  let activeLook = 0;
  let viewerIds = [];
  let viewerIndex = 0;
  let viewerTrigger;
  let drag = null;
  const dialog = app.querySelector('.image-viewer');
  const viewerImage = dialog.querySelector('[data-viewer-image]');
  const header = app.querySelector('.site-header');
  const menuButton = app.querySelector('.menu-button');
  const nav = app.querySelector('#main-nav');

  if ('IntersectionObserver' in window && motion()) {
    document.documentElement.classList.add('js-motion');
    revealObserver = new IntersectionObserver((entries) => {
      // Elements that enter together cascade in, a beat apart.
      let order = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.style.transitionDelay = `${Math.min(order++, 5) * 70}ms`;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -6% 0px' });
    // Pre-rendered content already on screen at first load stays put; only what is below the fold reveals.
    const onScreen = (element) => firstBind && element.getBoundingClientRect().top < innerHeight;
    app.querySelectorAll('.reveal').forEach((element) => {
      if (onScreen(element)) element.classList.add('is-visible');
      else revealObserver.observe(element);
    });
    app.querySelectorAll('main img').forEach((img) => { if (!onScreen(img)) fadeInWhenLoaded(img); });
  } else {
    document.documentElement.classList.remove('js-motion');
  }
  firstBind = false;

  function fadeInWhenLoaded(img) {
    if (img.complete) return;
    img.classList.add('is-loading');
    const done = () => img.classList.remove('is-loading');
    img.addEventListener('load', done, { once: true, signal });
    img.addEventListener('error', done, { once: true, signal });
  }

  function setMenu(open, { focus = false } = {}) {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? 'Close' : 'Menu';
    nav.classList.toggle('is-open', open);
    if (open) header.classList.remove('is-hidden');
    if (focus) menuButton.focus();
  }

  // Header steps aside while reading down the page and returns on the way back up.
  let lastScroll = scrollY;
  function updateHeader() {
    const y = scrollY;
    const delta = y - lastScroll;
    if (y < 160 || menuButton.getAttribute('aria-expanded') === 'true' || header.querySelector(':focus-visible')) {
      header.classList.remove('is-hidden');
      lastScroll = y;
    } else if (Math.abs(delta) > 8) {
      header.classList.toggle('is-hidden', delta > 0);
      lastScroll = y;
    }
  }
  listen(window, 'scroll', () => { cancelAnimationFrame(headerFrame); headerFrame = requestAnimationFrame(updateHeader); }, { passive: true });
  listen(header, 'focusin', () => header.classList.remove('is-hidden'));

  const tabList = app.querySelector('.look-tabs');
  const indicator = tabList?.querySelector('.look-indicator');
  function moveIndicator(instant) {
    if (!indicator) return;
    const tab = tabList.querySelectorAll('[data-look]')[activeLook];
    indicator.classList.toggle('is-instant', instant);
    indicator.style.transform = `translateX(${tab.offsetLeft}px) scaleX(${tab.offsetWidth / 100})`;
  }
  if (indicator) {
    tabList.classList.add('has-indicator');
    moveIndicator(true);
    listen(window, 'resize', () => moveIndicator(true), { passive: true });
  }

  // Keyboard changes are instant; pointer changes get a short, staggered settle.
  function selectLook(index, { focus = false, keyboard = false } = {}) {
    activeLook = (index + looks.length) % looks.length;
    const tabs = app.querySelectorAll('[data-look]');
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === activeLook));
      tab.tabIndex = i === activeLook ? 0 : -1;
    });
    const selected = tabs[activeLook];
    const panel = app.querySelector('#look-panel');
    panel.innerHTML = renderLook(activeLook);
    panel.setAttribute('aria-labelledby', selected.id);
    selected.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
    if (focus) selected.focus({ preventScroll: true });
    const animate = !keyboard && motion();
    moveIndicator(!animate);
    if (!motion()) return;
    panel.querySelectorAll('img').forEach(fadeInWhenLoaded);
    if (animate) {
      panel.querySelectorAll('figure').forEach((figure, i) => figure.animate(
        [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }],
        { duration: 320, delay: i * 40, easing: easeOut, fill: 'backwards' },
      ));
    }
  }

  function showViewerImage(placeholder) {
    const id = viewerIds[viewerIndex];
    const asset = assets.get(id);
    viewerImage.src = asset.large.src;
    // Show the already-loaded thumbnail until the large file is ready.
    if (placeholder && placeholder !== asset.large.src) {
      const full = new Image();
      full.src = asset.large.src;
      if (!full.complete) {
        viewerImage.src = placeholder;
        full.decode().catch(() => {}).then(() => { if (viewerIds[viewerIndex] === id && dialog.open) swapToFull(asset.large.src); });
      }
    }
    viewerImage.alt = description(id);
    viewerImage.width = asset.width;
    viewerImage.height = asset.height;
    dialog.querySelector('[data-viewer-title]').textContent = description(id);
    dialog.querySelector('[data-viewer-counter]').textContent = `${String(viewerIndex + 1).padStart(2, '0')} / ${String(viewerIds.length).padStart(2, '0')}`;
    dialog.querySelector('[data-viewer-step="-1"]').disabled = viewerIds.length < 2;
    dialog.querySelector('[data-viewer-step="1"]').disabled = viewerIds.length < 2;
    // Preload only the next photograph, never the entire archive.
    if (viewerIds.length > 1) {
      const next = new Image();
      next.src = assets.get(viewerIds[(viewerIndex + 1) % viewerIds.length]).large.src;
    }
  }

  function swapToFull(src) {
    // Skip the crossfade while the photograph is still moving; the layer would not follow it.
    if (!motion() || drag || viewerImage.getAnimations().length) { viewerImage.src = src; return; }
    const rect = viewerImage.getBoundingClientRect();
    const layer = viewerImage.cloneNode();
    layer.removeAttribute('data-viewer-image');
    layer.className = 'viewer-swap';
    layer.alt = '';
    Object.assign(layer.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, transform: '' });
    dialog.append(layer);
    viewerImage.src = src;
    layer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: 'ease' }).finished.then(() => layer.remove(), () => layer.remove());
  }

  function openViewer(photo) {
    const id = photo.dataset.viewer;
    const scope = photo.closest('[data-gallery]');
    const thumbnail = photo.querySelector('img');
    viewerIds = scope ? scope.dataset.gallery.split(',') : [id];
    viewerIndex = viewerIds.indexOf(id);
    viewerTrigger = photo;
    viewerImage.style.transform = '';
    showViewerImage(thumbnail?.currentSrc);
    dialog.showModal();
    document.body.classList.add('viewer-open');
    dialog.querySelector('[data-viewer-close]').focus();
    if (!motion() || !thumbnail) return;
    // Grow the photograph out of the thumbnail that was opened.
    const from = thumbnail.getBoundingClientRect();
    const to = containedRect(viewerImage, assets.get(id));
    if (!from.width || !to.width) return;
    const x = from.left + from.width / 2 - (to.left + to.width / 2);
    const y = from.top + from.height / 2 - (to.top + to.height / 2);
    viewerImage.animate(
      [{ transform: `translate(${x}px, ${y}px) scale(${from.width / to.width})` }, { transform: 'none' }],
      { duration: 480, easing: easeDrawer },
    );
  }

  function closeViewer() {
    dialog.close();
  }

  function stepViewer(step, { animate = false } = {}) {
    viewerIndex = (viewerIndex + step + viewerIds.length) % viewerIds.length;
    showViewerImage();
    if (!animate) return;
    viewerImage.animate(
      motion() ? [{ opacity: 0, transform: `translateX(${step * 36}px)` }, { opacity: 1, transform: 'none' }] : [{ opacity: 0 }, { opacity: 1 }],
      { duration: motion() ? 280 : 160, easing: easeOut },
    );
  }

  listen(app, 'click', (event) => {
    const element = event.target instanceof Element ? event.target : null;
    if (!element) return;
    if (element.closest('.menu-button')) return setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
    const photo = element.closest('[data-viewer]');
    if (photo) return openViewer(photo);
    if (element.closest('[data-viewer-close]')) return closeViewer();
    const viewerStep = element.closest('[data-viewer-step]');
    if (viewerStep) return stepViewer(Number(viewerStep.dataset.viewerStep), { animate: event.detail > 0 });
    const lookTab = element.closest('[data-look]');
    if (lookTab) return selectLook(Number(lookTab.dataset.look), { keyboard: event.detail === 0 });
    const lookStep = element.closest('[data-look-step]');
    if (lookStep) return selectLook(activeLook + Number(lookStep.dataset.lookStep), { keyboard: event.detail === 0 });
    if (element.closest('.top-button')) return window.scrollTo({ top: 0, behavior: motion() ? 'smooth' : 'instant' });
    const link = element.closest('a[href]');
    if (!link || link.target || link.hasAttribute('download') || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname.startsWith('/assets/')) return;
    const path = normalizePath(url.pathname);
    if (path === normalizePath(location.pathname) && url.hash) {
      setMenu(false);
      return;
    }
    event.preventDefault();
    navigate(url.pathname + url.hash);
  });

  listen(document, 'keydown', (event) => {
    if (dialog.open) {
      if (event.key === 'ArrowRight') { event.preventDefault(); stepViewer(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); stepViewer(-1); }
      return;
    }
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') setMenu(false, { focus: true });
    const tab = event.target.closest?.('[data-look]');
    if (!tab) return;
    const index = Number(tab.dataset.look);
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      selectLook(event.key === 'Home' ? 0 : event.key === 'End' ? looks.length - 1 : index + (event.key === 'ArrowRight' ? 1 : -1), { focus: true, keyboard: true });
    }
  });

  listen(dialog, 'close', () => {
    document.body.classList.remove('viewer-open');
    drag = null;
    viewerImage.classList.remove('is-dragging');
    dialog.querySelectorAll('.viewer-swap').forEach((layer) => layer.remove());
    // Let a dragged photograph finish leaving before it returns to the centre.
    setTimeout(() => { if (!dialog.open) viewerImage.style.transform = ''; }, 200);
    if (viewerTrigger?.isConnected) viewerTrigger.focus({ preventScroll: true });
  });
  listen(dialog, 'click', (event) => { if (event.target === dialog) closeViewer(); });

  // Drag sideways to browse, drag down to close. A quick flick counts as much as a long drag.
  listen(viewerImage, 'pointerdown', (event) => {
    if (drag || (event.pointerType === 'mouse' && event.button !== 0)) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, time: performance.now(), axis: null, dx: 0, dy: 0 };
    viewerImage.setPointerCapture(event.pointerId);
  });
  listen(viewerImage, 'pointermove', (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    drag.dx = event.clientX - drag.x;
    drag.dy = event.clientY - drag.y;
    if (!drag.axis && Math.hypot(drag.dx, drag.dy) > 8) {
      drag.axis = Math.abs(drag.dx) > Math.abs(drag.dy) ? 'x' : 'y';
      viewerImage.classList.add('is-dragging');
    }
    if (drag.axis === 'x') viewerImage.style.transform = `translateX(${viewerIds.length > 1 ? drag.dx : drag.dx * 0.2}px)`;
    if (drag.axis === 'y') {
      const dy = drag.dy > 0 ? drag.dy : drag.dy * 0.2;
      viewerImage.style.transform = `translateY(${dy}px) scale(${1 - Math.min(Math.max(dy, 0) / 1500, 0.12)})`;
    }
  });
  function endDrag(event) {
    if (!drag || event.pointerId !== drag.id) return;
    const { dx, dy, axis, time } = drag;
    drag = null;
    viewerImage.classList.remove('is-dragging');
    const elapsed = Math.max(performance.now() - time, 1);
    const flick = (distance) => Math.abs(distance) > 20 && Math.abs(distance) / elapsed > 0.11;
    if (axis === 'x' && viewerIds.length > 1 && (Math.abs(dx) > 80 || flick(dx))) {
      viewerImage.style.transform = '';
      return stepViewer(dx < 0 ? 1 : -1, { animate: true });
    }
    if (axis === 'y' && dy > 0 && (dy > 120 || flick(dy))) {
      viewerImage.style.transform = `translateY(${dy + 80}px) scale(0.88)`;
      return closeViewer();
    }
    viewerImage.style.transform = '';
  }
  listen(viewerImage, 'pointerup', endDrag);
  listen(viewerImage, 'pointercancel', endDrag);

  dispose = () => {
    if (dialog.open) dialog.close();
    document.body.classList.remove('viewer-open');
    controller.abort();
    revealObserver?.disconnect();
    cancelAnimationFrame(headerFrame);
  };
}

function navigate(href, { historyMode = 'push', focus = true } = {}) {
  const url = new URL(href, location.href);
  if (historyMode === 'push') history.pushState(null, '', url.pathname + url.hash);
  // The home masthead entrance belongs to the first visit only.
  document.documentElement.classList.add('is-navigated');
  const update = () => {
    dispose();
    app.innerHTML = renderPage(url.pathname);
    setMetadata(url.pathname);
    bindPage();
    if (focus) app.querySelector('main').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (url.hash) document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView({ behavior: 'instant' });
  };
  // A skipped transition (e.g. in a background tab) still runs the update; only its animation promise rejects.
  if (document.startViewTransition && !reducedMotion.matches) document.startViewTransition(update).ready.catch(() => {});
  else update();
}

if (app.querySelector('main')?.dataset.route !== normalizePath(location.pathname)) app.innerHTML = renderPage(location.pathname);
setMetadata(location.pathname);
bindPage();
window.addEventListener('popstate', () => navigate(location.href, { historyMode: 'none' }));
if (location.hash) requestAnimationFrame(() => document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({ behavior: 'instant' }));
