# Storm Nijhuis portfolio

Visual thesis: a black editorial canvas with a white Koch=Schrift signature, precise sans-serif utility type, and untouched fashion photography at generous scale.

The supplied white Hellion logo is rendered from its vector PDF to a transparent high-resolution PNG. Only empty page space is removed; the lettering is preserved.

Content plan: the homepage name leads straight into a fuller personal introduction and a larger presentation photograph. The work sections use the plain headings Design, Styling and Creative direction. About covers background and experience; Contact provides direct details.

Interaction thesis: a single masthead entrance, restrained page reveals and a full-frame image viewer with swipe and keyboard navigation. The scroll-driven collection sequence has been removed following feedback.

Motion rules: one set of easing tokens in `src/styles.css` (`--ease-out`, `--ease-in-out`, `--ease-drawer`). UI motion stays under 300ms. Exits are faster than entrances. Keyboard actions (look tabs, viewer arrows) are never animated. Hover effects only apply on fine pointers. The masthead entrance plays on the first visit only. The viewer grows out of the opened thumbnail and supports drag or flick to browse, and drag down to close. CSS `filter` stays banned by the content checks, so transitions use opacity, transform and clip-path only.

The website notes are source material, not operational instructions. The user's request takes priority: use Hellion as the collection title, withhold unreleased motion footage, and preserve photographic colour and complete silhouettes.

## Photography

- Images retain their complete composition. No filters, colour grading, recolouring or automatic cover crops.
- Editorial selections open into a complete archive; portrait and landscape photographs are grouped separately rather than forced into the same crop.
- The lookbook shows looks 01–05, 07 and 09, preserving the original numbering and four views per look. Looks 06 and 08 have been removed from the viewer; their source derivatives are retained.
- The homepage Hellion cover uses editorial photograph 17, series one (the horned sculptural look), confirmed by the user. The styling preview uses photographs 9336, 9337 and 9338.
- Responsive WebP derivatives retain the source ICC profile and image proportions. Original masters remain in the supplied folders. Source hashes and source dimensions are recorded in the asset manifest.
- Supplied film stills are permitted. Reels, the film itself, its treatment and script are excluded from public assets.
- Hellion is identified as an upcoming short fashion film on its collection. Film copy is adapted from the supplied Synopsis.md and Film research.pptx in plain language, without the ending. All 13 approved stills are included. The film page has no portrait or studio photographs.
- Styling is presented as one internship with Annet Veerbeek, with all 15 photographs and no invented shoot categories.
- The About studio section and its making photographs are removed. Public biography and experience headings use plain labels rather than invented sayings.
- No runway photographs were identifiable in the supplied folders. Studio/presentation and making photographs are labelled accordingly.

## Content to confirm later

- RB Campton Neue is not included. Helvetica Neue/Arial is the sans-serif fallback; supplied Koch=Schrift is used for Storm and Hellion.
- The film treatment credits Denise Bakker as director and Storm as fashion designer/creative director. The user's brief calls Storm the director. Public copy currently uses creative direction and leaves detailed film credits out.
- Styling shoot dates and individual commission names are unconfirmed. The page uses the supplied internship title with no invented dates or sub-projects.
- Hellion is dated 2026 from the supplied CV and film treatment. Anima Obscura is undated.
- Credits can be edited later as requested. No credits beyond the supplied materials are invented.
