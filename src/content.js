import manifest from '../public/assets/manifest.json' with { type: 'json' };

export const assets = new Map(manifest.map((asset) => [asset.id, asset]));
export const group = (name) => manifest.filter((asset) => asset.group === name).map((asset) => asset.id);
export const lookbook = group('lookbook');
export const editorial = [...group('editorial-v1'), ...group('editorial-v2')];
export const anima = group('anima');
export const looks = Array.from({ length: 9 }, (_, i) => ({
  number: String(i + 1).padStart(2, '0'),
  images: lookbook.slice(i * 4, i * 4 + 4),
}));
export const stylingProjects = [
  { title: 'Portraits', label: 'Styling assistance', images: ['styling-9336', 'styling-9337', 'styling-9338'] },
  { title: 'Colour studies', label: 'Styling assistance', images: ['styling-9400', 'styling-9402', 'styling-9403'] },
  { title: 'One Shot Hair Awards', label: 'Styling assistance', images: ['styling-9404', 'styling-9405', 'styling-9406', 'styling-9407', 'styling-9409', 'styling-9410', 'styling-9411', 'styling-9413', 'styling-9414'] },
];

// Keep null until the premiere and public release have been confirmed.
// When ready, use the public YouTube embed URL and change status to 'Released'.
export const film = {
  title: 'Hellion',
  status: 'Upcoming',
  embedUrl: null,
  stills: ['film-13', 'film-12', 'film-10', 'film-02', 'film-09', 'film-08'],
};

export const contact = {
  email: 'storm.nijhuis@gmail.com',
  phone: '+31 6 4001 1837',
  telephone: '+31640011837',
  instagram: 'https://www.instagram.com/hellion.sin/',
};

export const routes = {
  '/': { title: 'Storm Nijhuis', description: 'Amsterdam-based fashion designer, stylist and creative director. Selected work, collections and film by Storm Nijhuis.' },
  '/design/': { title: 'Design', description: 'Hellion and Anima Obscura. Fashion and material design by Storm Nijhuis.' },
  '/design/hellion/': { title: 'Hellion', description: 'Hellion, a 2026 collection by Storm Nijhuis. The complete lookbook, editorial photography and presentation.' },
  '/design/anima-obscura/': { title: 'Anima Obscura', description: 'A fashion editorial by Storm Nijhuis and Denise Bakker. Explore the complete photographic series.' },
  '/styling/': { title: 'Styling', description: 'Selected styling assistance work by Storm Nijhuis, during his internship with Annet Veerbeek.' },
  '/creative-direction/': { title: 'Creative Direction', description: 'Hellion, an upcoming fashion film. Creative direction by Storm Nijhuis. Selected film stills.' },
  '/about/': { title: 'About', description: 'Meet Storm Nijhuis. Fashion designer, stylist, creative director and Lichting finalist based in Amsterdam.' },
  '/contact/': { title: 'Contact', description: 'Contact Storm Nijhuis for fashion design, styling, creative direction and collaborations.' },
};
