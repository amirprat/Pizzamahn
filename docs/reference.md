## pizzamahn.com Reference Snapshot

### Brand & Typography
- Primary typeface: `WixMadeforText` (weights 400–800, normal and italic variants).
- Secondary typeface: Tailwind default sans stack for fallbacks.
- Global base font-size ~16px with responsive scaling via Tailwind utilities.

### Color Palette (derived from `main.8e59e1be.css`)
- Deep navy: `#1b2852`
- Charcoal: `#1a1a1a`
- Accents: `#FF983B` (orange), `#20B2AA` (teal), `#00A184` (green)
- Grays: `#E4E4E7`, `#E5E5E5`, `#E9E9E9`
- Status colors: `#1877F2` (info), `#DC2626` (error), `#229954` (success)

### Key Layout Notes
- Global layout centers content within a max-width container (~960px) and applies 24–32px horizontal padding on mobile, expanding to 80px gutters on desktop.
- Hero features centered logomark image followed by stacked headline “Pizza Under / the Trees”, status badge, pizza count progress indicator, and event metadata.
- Promo badge for reservation status (`🔴 Reservations Are Now Closed`) uses bold text, uppercase label, and accent color background with rounded-full pill.
- Progress indicator shows “Pizzas Ordered 100 / 100” accompanied by a visual bar and success check icon.
- Sections include event description, mailing list call-to-action with button, FAQ-style information for existing reservations and group bookings, and brand statement block.
- Mobile-first layout stacks content vertically with generous spacing (32–48px). Tablet breakpoint introduces two-column alignment for descriptive text vs. supporting imagery. Desktop adds horizontal arrangement for CTA panels.
- Buttons use pill/rounded styles with high-contrast text, 16px padding, and focus outlines; hover states darken background by ~10%.
- Footer area includes contact/social callouts with centered alignment and consistent typographic scale.

### Responsive Behavior
- Tailwind default breakpoints observed in CSS: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px).
- On mobile: navigation condenses into stacked blocks; hero illustration scales to 80% width; text remains center aligned.
- On tablet (`md`): layout introduces side-by-side alignment of hero image and textual content; badges align left while CTAs align right within flex containers.
- On desktop (`lg`+): call-to-action cards align in a three-column grid; progress indicator expands to full width with inline labels; typography scale increases by ~12%.
- Interactive elements maintain 44px minimum tap targets; focus states visible with 2px outline (`#FF983B` on dark backgrounds, `#1b2852` on light).

### Content Snapshot (11 Nov 2025)
- Headline: “Pizza Under the Trees – A night of wood fire, island flavor…”
- Event details: “Sunday, November 9 – Pangea USVI”.
- Status messaging: Event at capacity, encouragement to join mailing list.
- Brand statement: “Wood-fired pizza with island soul”.
- Mailing list CTA: button labelled “Join Our Mailing List” linking to signup flow (currently disabled due to capacity).
- Question prompt: “Questions or Group Bookings? We’re here to help make your night perfect.”

### Interaction & Navigation
- Primary navigation limited to anchor jumps within single page; background is solid and static (no transparency on scroll).
- Reservation CTA currently replaced with “Event Full” messaging but retains same structure as active booking state.
- Forms utilize single-column layout with accessible labels and helper text; error states highlighted with `#DC2626`.
- Buttons and links include `aria-label`s for screen readers (verified in HTML attributes).

### Data & Dynamic Content
- Content served via React bundle fetching structured data (likely from headless CMS). Key fields: event name, date, location, capacity count, mailing list link, contact info.
- Progress counts (100/100) render dynamically; ensure backend API exposes similar fields for future updates.
- Area tags not surfaced on public UI but should be represented in admin-managed metadata for SEO and filtering.

### Accessibility Considerations Observed
- Semantic heading hierarchy present (`h1` hero, supporting `h2`/`h3` for subsections); landmarks for main content and footer.
- Alt text on logo imagery (e.g., “PIZZAMAHN Logo”) plus descriptive captions for event imagery.
- Color combinations maintain contrast (dark navy text on light backgrounds, bright accents on dark surfaces).
- Focus-visible outlines provided via Tailwind defaults; keyboard navigation cycles through CTAs in logical order.
- Live regions not currently used; capacity badge updates are static. Ensure ARIA `role="status"` for dynamic states in rebuild.

### Assets Catalogued
- Favicon/logo: `281ec9b8a_beb6394f-4979-4a1b-99f0-f3ff823f3107.png`
- Hero graphic: `75ea35116_beb6394f-4979-4a1b-99f0-f3ff823f3107.png`
- Background texture (subtle noise) embedded via CSS data URI in hero section.

### Open Questions for Implementation
- Mailing list integration currently references external service (not captured); plan to integrate with placeholder or environment-based endpoint.
- Confirm any additional pages (menu, about) through further exploration once backend build begins; replicate if discovered.

This document will guide the recreation of the site’s visual, textual, and interaction patterns within the new Next.js implementation.

