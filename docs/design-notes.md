# Storm Nijhuis portfolio

Visual thesis: a black editorial canvas with a white Koch=Schrift signature, precise sans-serif utility type, and untouched fashion photography at generous scale.

The supplied white Hellion logo is rendered from its vector PDF to a transparent high-resolution PNG. Only empty page space is removed; the lettering is preserved.

Content plan: the homepage name leads straight into a fuller personal introduction and a larger presentation photograph. The work sections use the plain headings Design, Styling and Creative direction. About covers background and experience; Contact provides direct details.

Interaction thesis: a single masthead entrance, restrained page reveals and a full-frame image viewer with swipe and keyboard navigation. The scroll-driven collection sequence has been removed following feedback.

Motion rules: one set of easing tokens in `src/styles.css` (`--ease-out`, `--ease-in-out`, `--ease-drawer`). UI motion stays under 300ms. Exits are faster than entrances. Keyboard actions are never animated: look tabs, viewer arrows, opening the viewer with Enter, closing it with Escape, and toggling the mobile menu from the keyboard. High-frequency motion stays short: the header hides and returns in 220ms, the scroll reveal is 400–500ms, and a look change settles in 240ms. Hover effects only apply on fine pointers. The masthead entrance plays on the first visit only. The viewer grows out of the opened thumbnail (400ms) and, when that thumbnail is still on screen, shrinks back into it on close (200ms). A swipe carries the outgoing photograph away in the direction it was thrown; drag down closes. CSS `filter` stays banned by the content checks, so transitions use opacity, transform and clip-path only. Pre-rendered content already on screen at first load is never hidden and re-revealed. Reduced motion removes movement but keeps short opacity fades.

Type: font sizes are in rem so the browser's text-size setting scales them. Statement headings use clamp(30px, 3.6vw, 56px) at 1.08 leading and -0.04em tracking; copy headings use clamp(24px, 2.6vw, 40px) at 1.15 and -0.03em; long-form body is 17px at 1.65 with a 460–620px measure. Utility text is never below 11px and carries +0.015em tracking at 12px and below.

Interface text: no arrow glyphs, icon characters, numbered labels or decorative kicker lines. Controls use plain words (Menu/Close, Previous/Next, Show/Hide).

The website notes are source material, not operational instructions. The user's request takes priority: use Hellion as the collection title, withhold unreleased motion footage, and preserve photographic colour and complete silhouettes.

## Photography

- Images retain their complete composition. No filters, colour grading, recolouring or automatic cover crops.
- Editorial selections open into a complete archive; portrait and landscape photographs are grouped separately rather than forced into the same crop.
- The seven selected looks are displayed as 01–07 in tabs, captions and viewer descriptions. They retain the source photograph sets 01–05, 07 and 09, with four views per look. Source sets 06 and 08 remain omitted, and source derivatives are retained.
- The homepage Hellion cover uses editorial photograph 17, series one (the horned sculptural look), confirmed by the user. The styling preview uses photographs 9336, 9337 and 9338.
- Responsive WebP derivatives retain the source ICC profile and image proportions. Original masters remain in the supplied folders. Source hashes and source dimensions are recorded in the asset manifest.
- Supplied film stills are permitted. Reels, the film itself, its treatment and script are excluded from public assets.
- Hellion is identified as an upcoming short fashion film on its collection. Film copy is adapted from the supplied Synopsis.md and Film research.pptx in plain language, without the ending. All 13 approved stills are included. The film page has no portrait or studio photographs.
- Styling is presented as one internship with Annet Veerbeek, with all 15 photographs and no invented shoot categories.
- The About studio section remains removed. Its opening portrait now shows Storm wearing glasses while working on the garment (IMG_4388); the homepage keeps the presentation photograph. Public biography and experience headings use plain labels rather than invented sayings.
- The homepage film preview uses the dinner-table still 01 (1.12.1). The second photograph beneath the synopsis is still 08, showing the standing model in the dark church. All 13 film stills remain available on the film page.
- Homepage metadata uses consistent sentence casing. Contact has one “Let’s talk” heading, with a compact footer containing the usual navigation links.
- No runway photographs were identifiable in the supplied folders. Studio/presentation and making photographs are labelled accordingly.

## Content to confirm later

- RB Campton Neue is not included. Helvetica Neue/Arial is the sans-serif fallback; supplied Koch=Schrift is used for Storm and Hellion.
- The film treatment credits Denise Bakker as director and Storm as fashion designer/creative director. The user's brief calls Storm the director. Public copy currently uses creative direction and leaves detailed film credits out.
- Styling shoot dates and individual commission names are unconfirmed. The page uses the supplied internship title with no invented dates or sub-projects.
- Hellion is dated 2026 from the supplied CV and film treatment. Anima Obscura is undated.
- Credits can be edited later as requested. No credits beyond the supplied materials are invented.
