import './styles.css';
import { assets, looks } from './content.js';
import { renderPage, renderLook, normalizePath, pageMeta, description } from './templates.js';

const app = document.querySelector('#app');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let dispose = () => {};

function setMetadata(path) {
  const meta = pageMeta(path);
  document.title = meta.title;
  document.querySelector('meta[name="description"]').content = meta.description;
  document.querySelector('meta[property="og:title"]').content = meta.title;
  document.querySelector('meta[property="og:description"]').content = meta.description;
}

function bindPage() {
  dispose();
  const controller = new AbortController();
  const { signal } = controller;
  const listen = (target, event, handler, options = {}) => target.addEventListener(event, handler, { ...options, signal });
  let revealObserver;
  let frameId;
  let activeLook = 0;
  let viewerIds = [];
  let viewerIndex = 0;
  let viewerTrigger;
  const dialog = app.querySelector('.image-viewer');

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    document.documentElement.classList.add('js-motion');
    revealObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      }
    }, { threshold: 0.06 });
    app.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
  } else {
    document.documentElement.classList.remove('js-motion');
  }

  function selectLook(index, focus = false) {
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
  }

  function showViewerImage() {
    const id = viewerIds[viewerIndex];
    const asset = assets.get(id);
    const img = dialog.querySelector('[data-viewer-image]');
    img.src = asset.large.src;
    img.alt = description(id);
    img.width = asset.width;
    img.height = asset.height;
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

  function closeViewer() {
    dialog.close();
  }

  function stepViewer(step) {
    viewerIndex = (viewerIndex + step + viewerIds.length) % viewerIds.length;
    showViewerImage();
  }

  listen(app, 'click', (event) => {
    const element = event.target instanceof Element ? event.target : null;
    if (!element) return;
    const menu = element.closest('.menu-button');
    if (menu) {
      const expanded = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(expanded));
      app.querySelector('#main-nav').classList.toggle('is-open', expanded);
      return;
    }
    const photo = element.closest('[data-viewer]');
    if (photo) {
      const id = photo.dataset.viewer;
      const scope = photo.closest('[data-gallery]');
      viewerIds = scope ? scope.dataset.gallery.split(',') : [id];
      viewerIndex = viewerIds.indexOf(id);
      viewerTrigger = photo;
      showViewerImage();
      dialog.showModal();
      document.body.classList.add('viewer-open');
      dialog.querySelector('[data-viewer-close]').focus();
      return;
    }
    if (element.closest('[data-viewer-close]')) return closeViewer();
    const viewerStep = element.closest('[data-viewer-step]');
    if (viewerStep) return stepViewer(Number(viewerStep.dataset.viewerStep));
    const lookTab = element.closest('[data-look]');
    if (lookTab) return selectLook(Number(lookTab.dataset.look));
    const lookStep = element.closest('[data-look-step]');
    if (lookStep) return selectLook(activeLook + Number(lookStep.dataset.lookStep));
    if (element.closest('.top-button')) return window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    const link = element.closest('a[href]');
    if (!link || link.target || link.hasAttribute('download') || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname.startsWith('/assets/')) return;
    const path = normalizePath(url.pathname);
    if (path === normalizePath(location.pathname) && url.hash) return;
    event.preventDefault();
    navigate(url.pathname + url.hash);
  });

  listen(document, 'keydown', (event) => {
    if (dialog.open) {
      if (event.key === 'ArrowRight') { event.preventDefault(); stepViewer(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); stepViewer(-1); }
      return;
    }
    if (event.key === 'Escape') {
      const menu = app.querySelector('.menu-button');
      if (menu.getAttribute('aria-expanded') === 'true') {
        menu.setAttribute('aria-expanded', 'false');
        app.querySelector('#main-nav').classList.remove('is-open');
        menu.focus();
      }
    }
    const tab = event.target.closest?.('[data-look]');
    if (!tab) return;
    const index = Number(tab.dataset.look);
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      selectLook(event.key === 'Home' ? 0 : event.key === 'End' ? looks.length - 1 : index + (event.key === 'ArrowRight' ? 1 : -1), true);
    }
  });

  listen(dialog, 'close', () => {
    document.body.classList.remove('viewer-open');
    if (viewerTrigger?.isConnected) viewerTrigger.focus({ preventScroll: true });
  });
  listen(dialog, 'click', (event) => { if (event.target === dialog) closeViewer(); });
  let touchStart;
  listen(dialog, 'touchstart', (event) => {
    if (event.touches.length === 1) touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  listen(dialog, 'touchend', (event) => {
    if (!touchStart || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) stepViewer(dx < 0 ? 1 : -1);
    touchStart = null;
  }, { passive: true });

  const story = app.querySelector('.look-story');
  if (story && reducedMotion.matches) story.querySelectorAll('[data-story-frame]').forEach((element) => element.setAttribute('aria-hidden', 'false'));
  function updateStory() {
    if (!story || reducedMotion.matches) return;
    const bounds = story.getBoundingClientRect();
    const progress = Math.max(0, Math.min(0.999, -bounds.top / (bounds.height - innerHeight)));
    const index = Math.min(2, Math.floor(progress * 3));
    story.querySelectorAll('[data-story-frame]').forEach((element, i) => {
      element.classList.toggle('is-active', i === index);
      element.setAttribute('aria-hidden', String(i !== index));
    });
    story.querySelector('[data-story-counter]').textContent = String(index + 1).padStart(2, '0');
  }
  if (story) {
    const schedule = () => { cancelAnimationFrame(frameId); frameId = requestAnimationFrame(updateStory); };
    listen(window, 'scroll', schedule, { passive: true });
    listen(window, 'resize', schedule, { passive: true });
    updateStory();
  }
  dispose = () => {
    if (dialog.open) dialog.close();
    document.body.classList.remove('viewer-open');
    controller.abort();
    revealObserver?.disconnect();
    cancelAnimationFrame(frameId);
  };
}

function navigate(href, { historyMode = 'push', focus = true } = {}) {
  const url = new URL(href, location.href);
  dispose();
  if (historyMode === 'push') history.pushState(null, '', url.pathname + url.hash);
  app.innerHTML = renderPage(url.pathname);
  setMetadata(url.pathname);
  bindPage();
  if (focus) app.querySelector('main').focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (url.hash) requestAnimationFrame(() => document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView({ behavior: 'instant' }));
}

if (app.querySelector('main')?.dataset.route !== normalizePath(location.pathname)) app.innerHTML = renderPage(location.pathname);
setMetadata(location.pathname);
bindPage();
window.addEventListener('popstate', () => navigate(location.href, { historyMode: 'none' }));
if (location.hash) requestAnimationFrame(() => document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({ behavior: 'instant' }));
