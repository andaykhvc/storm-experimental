import manifest from '../public/assets/manifest.json' with { type: 'json' };

export const assets = new Map(manifest.map((asset) => [asset.id, asset]));
export const group = (name) => manifest.filter((asset) => asset.group === name).map((asset) => asset.id);
const suppliedLookbook = group('lookbook');
export const editorial = [...group('editorial-v1'), ...group('editorial-v2')];
export const anima = group('anima');
export const looks = Array.from({ length: 9 }, (_, i) => ({
  sourceNumber: String(i + 1).padStart(2, '0'),
  images: suppliedLookbook.slice(i * 4, i * 4 + 4),
})).filter((look) => !['06', '08'].includes(look.sourceNumber))
  .map((look, i) => ({ ...look, number: String(i + 1).padStart(2, '0') }));
export const lookbook = looks.flatMap((look) => look.images);
export const stylingProjects = [
  { title: 'Annet Veerbeek', label: 'Internship · Styling assistance', images: group('styling') },
];

export const homeBiography = [
  'I’m Storm Nijhuis, a fashion designer, stylist and creative director based in Amsterdam. I grew up in Zutphen, where being queer often meant feeling out of place. Fashion became a way to express myself and explore things I couldn’t always put into words.',
  'I learned to work with my hands at a Rudolf Steiner school, then studied product and textile design at CIBAP and fashion design at AMFI. During an exchange at the Swedish School of Textiles, I explored how materials can shape a garment from the very beginning.',
  'My work includes latex, textile development and historical pattern cutting. I also work in styling, where I enjoy responding to different people and different briefs. Through my brand Hellion, I explore identity and religious symbolism with exaggerated silhouettes, humour and contrast.',
];

// Keep null until the premiere and public release have been confirmed.
// When ready, use the public YouTube embed URL and change status to 'Released'.
export const film = {
  title: 'Hellion',
  format: 'A short fashion film',
  status: 'Upcoming',
  embedUrl: null,
  previewStill: 'film-01',
  logline: 'Made alongside the Hellion collection, the film follows a mischievous outsider into an otherworldly church, where he challenges the religious judgement that made him feel like a sinner.',
  synopsis: [
    'As the church bells ring, Hellion arrives in a place where sacred rules decide what is good and what is sinful. He interrupts its rituals and acts on the desires he was taught to fear. His rebellion brings him into conflict with the Nun, who stands for the rules he is trying to escape.',
    'The film comes from my experience of growing up queer in a small town surrounded by Catholic beliefs. It asks who gets to define purity and sin, and how those ideas affect the way we see ourselves. Hellion approaches these questions through humour, religious symbolism and a character who refuses to behave.',
  ],
  concept: [
    'The film was made alongside my Hellion collection. The garments become the characters’ clothing: oversized collars, horns and sculptural silhouettes exaggerate the authority and expectations associated with religious dress.',
    'I developed the fashion design, concept and creative direction for the project. The treatment brings together the clothing, casting and setting, with distorted perspectives, warm light and the sound of church bells. The film was shot in Pieterskerk in Utrecht.',
  ],
  stills: ['film-13', 'film-12', 'film-08', 'film-02', 'film-04', 'film-05', 'film-03', 'film-06', 'film-07', 'film-01', 'film-09', 'film-10', 'film-11'],
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
  '/creative-direction/': { title: 'Hellion, a short fashion film', description: 'Hellion, an upcoming short fashion film based on Storm Nijhuis’s collection. A rebellious outsider challenges religious judgement in an otherworldly church.' },
  '/about/': { title: 'About', description: 'Meet Storm Nijhuis. Fashion designer, stylist, creative director and Lichting finalist based in Amsterdam.' },
  '/contact/': { title: 'Contact', description: 'Contact Storm Nijhuis for fashion design, styling, creative direction and collaborations.' },
};
