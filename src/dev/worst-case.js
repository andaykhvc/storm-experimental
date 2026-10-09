// Dev-only stress data. Loaded by main.js under import.meta.env.DEV, never in a production build.
// Values are realistic for this site, not random: an agency-style booking address, a released film,
// a longer logline, a long gallery title and label, extra looks and a single-image gallery.
import { contact, film, stylingProjects, homeBiography, looks } from '../content.js';

const STORAGE_KEY = 'storm-data';
const states = [['demo', 'Demo data'], ['worst', 'Worst case']];

export function currentState() {
  const param = new URLSearchParams(location.search).get('data');
  if (param) {
    try { sessionStorage.setItem(STORAGE_KEY, param); } catch {}
    return param;
  }
  try { return sessionStorage.getItem(STORAGE_KEY) || 'demo'; } catch { return 'demo'; }
}

export function applyWorstCase() {
  Object.assign(contact, {
    email: 'bookings.storm.nijhuis@hellion-studio-amsterdam.example.com',
    phone: '+31 (0)20 794 0183 ext. 204',
    telephone: '+31207940183,204',
  });
  Object.assign(film, {
    status: 'Released',
    embedUrl: 'about:blank',
    format: 'A short fashion film in three chapters, shot on location',
    logline: `${film.logline} Screened at Lichting, the Amsterdam Fashion Week presentation of graduating designers, and selected for the Fashion Film Festival Amsterdam programme.`,
  });
  Object.assign(stylingProjects[0], {
    title: 'Annet Veerbeek Styling & Creative Consultancy',
    label: 'Internship · Styling assistance · Editorial, commercial and campaign shoots',
  });
  homeBiography.push('Kostuumontwerpopleidingsprogramma, the Dutch word for a costume design curriculum, is the kind of long compound word that turns up in a CV.');
  // Twelve looks instead of seven: more tabs than fit on a phone.
  const extra = looks.slice(0, 5).map((look, i) => ({ ...look, number: String(looks.length + i + 1).padStart(2, '0') }));
  looks.push(...extra);
}

export function mountDataToggle(active) {
  const bar = document.createElement('div');
  bar.setAttribute('role', 'group');
  bar.setAttribute('aria-label', 'Dev data set');
  bar.style.cssText = 'position:fixed;left:50%;bottom:12px;transform:translateX(-50%);z-index:2147483647;display:flex;gap:2px;padding:3px;background:#3a3a3a;border-radius:999px;font:500 12px/1 system-ui,sans-serif';
  for (const [value, label] of states) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.setAttribute('aria-pressed', String(value === active));
    button.style.cssText = `border:0;border-radius:999px;padding:7px 12px;cursor:pointer;font:inherit;${value === active ? 'background:#fff;color:#111' : 'background:transparent;color:#ddd'}`;
    button.addEventListener('click', () => {
      try { sessionStorage.setItem(STORAGE_KEY, value); } catch {}
      const url = new URL(location.href);
      url.searchParams.delete('data');
      location.replace(url);
    });
    bar.append(button);
  }
  document.body.append(bar);
}
