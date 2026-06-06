# noayedlin-site — Working notes for Claude Code

This file is your persistent context. Read it on every session. It captures the design system, conventions, and house rules so prompts can stay short.

## Project

Personal author website for **Noa Yedlin** — Israeli novelist and screenwriter. Single-language (English). Editorial / literary tone. Restrained, contemporary, magazine-influenced design.

**Books:** Four novels. *House Arrest* (forthcoming October 13, 2026), *Stockholm* (2023), *People Like Us* (2018), *The Wrong Book* (2015).

## Tech stack

- **Framework:** Astro v6.x, deployed on Vercel
- **Styling:** Plain CSS with custom properties (no Tailwind, no UnoCSS)
- **Content:** Astro content collections (markdown) for `books`, `events`, `media`, `adaptations`
- **Routing:** File-based (`src/pages/`)
- **Components:** Astro components in `src/components/`
- **Fonts:** Fraunces (serif headlines) + Inter (sans body), via Google Fonts

## Working principles

1. **Small atomic changes over big batches.** One concept per commit. Visual changes ship in narrow PRs that are easy to revert if they look wrong.
2. **Read before writing.** Before editing a component, read it and surrounding code. Understand the existing patterns before introducing new ones.
3. **Propose diffs before applying.** When the change touches multiple files or non-obvious patterns, show the diff first and wait for approval.
4. **Self-check against acceptance criteria.** Every prompt should end with "after this, X, Y, Z should be true." Verify each before pushing.

---

## Design tokens

Defined in `src/styles/global.css` as CSS custom properties.

### Colors

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FAFAF8` | Page background, sticky header bg |
| `--bg-alt` | `#F2F1EA` | Tinted section bands (rare) |
| `--text` | `#1A1A1A` | Primary text, near-black |
| `--text-muted` | `#3D3D3B` | Secondary text, captions, eyebrows, type labels |
| `--text-faint` | `#5C5C5A` | Tertiary text, micro-labels, fine print |
| `--accent` | `#E5512C` | **Clickable elements only** (see Accent rule below) |
| `--rule` | `#C5C4BC` | Hairline dividers (0.5px) |

### Type scale (only these sizes)

| Token | Value | Use |
|---|---|---|
| `--text-xs` | `12px` | Eyebrows, labels, button text, breadcrumbs, status indicators, fine print |
| `--text-sm` | `14px` | Retailer text, attribution, dates, network lines, captions |
| `--text-md` | `16px` | Body prose, descriptions, italic taglines |
| `--text-lg` | `28px` | All headings below H1 (H2, H3, large italic intros) |
| `--text-xl` | `48px` | Section H1s where smaller — most page H1s use the 96px inline value via PageHeading |

**Page heading H1** uses `96px` inline (with `clamp(48px, 12vw, 96px)` on mobile) — defined in the PageHeading component, not in the token table.

### Letter-spacing (only these values)

| Token | Value | Use |
|---|---|---|
| `--track-tight` | `-0.02em` | Display H1, hero numbers, H2/H3 headings |
| `--track-none` | `0` | Body, italic intros |
| `--track-wide` | `0.1em` | Uppercase eyebrows, labels, button text |

### Line-heights (only these values)

| Token | Value | Use |
|---|---|---|
| `--lh-tight` | `1.1` | All headings, display numbers |
| `--lh-snug` | `1.4` | Italic taglines, intro lines, small pull quotes |
| `--lh-loose` | `1.6` | Body prose |

### Fonts

- `--font-serif`: `'Fraunces', 'Iowan Old Style', Georgia, serif`
- `--font-body`: `'Inter', system-ui, sans-serif`

---

## Components

### `<PageHeading>`

**Path:** `src/components/PageHeading.astro`

**Use on every inner page.** Single source of truth for the Option D page heading pattern (left-aligned 96px serif H1 with period, sans-serif subtitle).

**Props:**
- `eyebrow: string` — small caps page label (`Books`, `Press`, `Events`, etc.)
- `title: string` — the H1 text. Add a period when natural (`The novels.`, `In the press.`); skip period for proper names (`Noa Yedlin`).
- `subtitle?: string` — optional sans-serif subtitle, max-width 460px
- `variant?: 'default' | 'with-aside'` — `with-aside` enables a right column for portraits/imagery via a named slot

**Usage:**

```astro
<PageHeading eyebrow="Press" title="In the press." subtitle="Selected interviews, essays, and critical coverage." />
```

With aside (e.g., About page):

```astro
<PageHeading eyebrow="About" title="Noa Yedlin" subtitle="Israeli novelist and screenwriter." variant="with-aside">
  <img slot="aside" src="/portraits/noa.jpg" alt="Noa Yedlin" class="about-portrait" />
</PageHeading>
```

### `<BooksRail>`

Used at the bottom of every page except `/books` (which IS the books listing). Renders all four book covers + italic title + year.

**Props:**
- `currentSlug?: string` — if provided, that book gets a 2px accent border + "Reading now" label

**Cover size:** 150px wide, `aspect-ratio: 2/3`, soft drop shadow. Grid is 4 columns centered.

**Wrapping:** Always wrap usage in `<section class="books-rail-section">` for top padding (80px desktop, 56px mobile).

### `<Header>`

Sticky desktop header with wordmark on left, nav on right. Active nav item gets accent color + 1px accent underline. Active state is computed from `Astro.url.pathname`.

**Mobile drawer** (in `src/components/MobileNav.astro`) opens from a hamburger button. Full-screen overlay, large serif nav items, social icons at the bottom. **No newsletter link** — newsletter doesn't exist.

### `<Footer>`

[Not yet finalized — placeholder. When working on the footer, no newsletter band.]

---

## Patterns

### Section eyebrows

Sections are headed by an eyebrow only. No Fraunces H2, no italic subtitle. The eyebrow gives the section its label and the content does the work.

```html
<p class="eyebrow">Praise</p>
<!-- section content -->
```

**Style:** `var(--text-xs)`, `var(--track-wide)`, `uppercase`, `color: var(--text-muted)`, 24px bottom margin, `text-align: center`.

**Use on:** Praise, Books rail, Upcoming events, Press, Adaptations preview, About preview, Synopsis, Prizes, Adaptations (book detail), Other books, Representation.

### Section padding

Between top-level sections: **56px top/bottom on desktop, 40px on mobile.** No in-between values. For dense pages where multiple short sections stack (book detail with Synopsis, Praise, Prizes, Adaptations, Other Books), bump to 64–80px so the rhythm is clear.

### Reading column

Body prose on book detail, About bio, future policy pages: `max-width: 620px; margin: 0 auto;`. Centered on the page.

### Buy / retailer pattern

Retailers render as inline editorial text links, never as buttons.

```html
<div class="retailers">
  <span class="retailers-label">Order:</span>
  <a class="retailer-link" href="...">Amazon</a>
  <span class="retailer-sep">·</span>
  <a class="retailer-link" href="...">B&amp;N</a>
</div>
```

`white-space: nowrap` on `.retailers`. Stockholm uses abbreviated retailer names (`B&N`, `BAM`) to fit on one line.

### Quote attribution

Used everywhere quotes appear (homepage hero, homepage Praise, book detail Praise).

```html
<footer class="quote-attribution">
  <div class="quote-author">— Avraham Balaban</div>
  <div class="quote-outlet">Haaretz Books</div>
  <div class="quote-book"><em>House Arrest</em></div>
</footer>
```

- `.quote-author` always present. Em-dash inline.
- `.quote-outlet` renders only if outlet exists.
- `.quote-book` renders **only on homepage Praise** (where books mix). Omit on book detail Praise.

### Praise quote treatment

**Homepage Praise:** Each quote has a 2px accent left border + 18px left padding. Italic Fraunces.

**Book detail Praise:** **No left border.** Italic Fraunces. Multi-column grid (3 columns desktop, 2 tablet, 1 mobile).

### Status indicators

Dot prefix + uppercase text. Used for book release status, event status, etc.

```html
<div class="status">
  <span class="status-dot"></span>
  <span>Forthcoming · October 13, 2026</span>
</div>
```

**Colors:** dot in `var(--text-muted)`, text in `var(--text)`. No accent.

For award/review badges like "Kirkus Starred Review": star icon + uppercase text, all in `var(--text)`.

### Event row pattern

Mirrors the media list. 160px left meta column (uppercase date, location, type), right column with serif headline + italic description + status indicator. Used on both `/events` listing and the homepage events block.

### Hover state on clickable serif titles

Single class everywhere: `.headline-link`. Hover produces color shift to accent + 1px accent underline + an inline `→` arrow that fades in and slides to the right.

```css
.headline-link {
  color: var(--text);
  text-decoration: none;
  transition: color 0.15s, text-decoration-color 0.15s;
}

.headline-link::after {
  content: ' →';
  display: inline-block;
  margin-left: 4px;
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.15s ease-out, transform 0.15s ease-out;
}

.headline-link:hover,
.headline-link:focus-visible {
  color: var(--accent);
  text-decoration: underline;
  text-decoration-color: var(--accent);
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
}

.headline-link:hover::after,
.headline-link:focus-visible::after {
  opacity: 1;
  transform: translateX(0);
}
```

### Adaptation book group headings

On `/adaptations`, each book group header is `eyebrow` ("From the novel") + italic Fraunces book title (plain text, not a link, no arrow) + a `.btn-secondary` "View book" button below. The button is the only path to that book's page from this section.

```html
<div class="adaptation-group">
  <div class="section-eyebrow">From the novel</div>
  <h2 class="group-title"><em>House Arrest</em></h2>
  <a href="/books/house-arrest" class="btn-secondary">View book</a>
  <!-- adaptation cards -->
</div>
```

---

## House rules

### Accent color is reserved for clickable elements

`var(--accent)` only appears on things the user can click:

- Active header nav item
- `.headline-link` hover state
- Inline retailer links (Amazon, B&N, etc.)
- Body prose text links
- Filter chip active state
- Accent text links (`All events →`, `All press →`, `Read more`)
- Email and URL links

**Never accent:** section eyebrows, page eyebrows, type labels, year eyebrows, status indicators (text or dot).

### Italics

- Book titles in prose: always italic (`<em>`)
- Adaptation titles in prose: always italic
- Author / attribution names: never italic
- Outlet / publication names: never italic in body, but always uppercase in attribution/eyebrow contexts

### Punctuation in page H1s

Add a period where natural: `The novels.`, `In the press.`, `On screen and on stage.`, `Lectures & events.`, `Get in touch.`

Skip the period for proper names: `Noa Yedlin`, book titles, event titles.

### Dividers (less is more)

Use hairlines only in three places:
1. Header bottom border (sticky boundary)
2. Between rows in a list (media, events) — only between, not above first or below last
3. Above the footer

**Don't use dividers** between section blocks, below page headings, above rails, or between book detail sub-sections. Section padding does the work.

### Em-dashes and curly quotes

Use real em-dashes (`—`) and curly quotes (`'`, `"`) in prose. Hyphen-minus (`-`) is for code only.

---

## File structure

```
src/
├── components/
│   ├── PageHeading.astro
│   ├── BooksRail.astro
│   ├── MobileNav.astro  # mobile drawer
│   └── ...              # header + footer are inline in layouts/Layout.astro
├── content/
│   ├── books/en/      # one .json per book (4 books); collection: booksEn
│   ├── books/he/      # Hebrew versions; collection: booksHe
│   ├── events/        # one .md per event
│   ├── media/         # one .md per press item
│   └── adaptations/   # one .md per adaptation
├── content.config.ts  # collection schemas
├── layouts/
│   └── Layout.astro   # root layout (contains header + footer inline)
├── pages/
│   ├── index.astro
│   ├── books/[slug].astro
│   ├── events/[slug].astro
│   ├── books.astro
│   ├── events.astro
│   ├── media.astro
│   ├── adaptations.astro
│   ├── about.astro
│   ├── contact.astro
│   └── design.astro   # internal design reference (remove before launch)
└── styles/
    └── global.css     # tokens + global rules
```

---

## How to add a new page

1. Create `src/pages/<name>.astro`
2. Wrap in `<Layout>` layout (import from `../layouts/Layout.astro`)
3. Use `<PageHeading>` for the title
4. Use section eyebrows (small caps) for any sub-sections
5. Wrap `<BooksRail>` in `<section class="books-rail-section">`
6. Verify accent only appears on clickable elements
7. Test at 1440px, 1024px, and 375px viewports

---

## Don't touch

- Wordmark size or styling
- The `<PageHeading>` component's styles unless explicitly asked
- The accent / clickable rule
- Book cover artwork text (typography embedded in cover designs)
- Footer copy unless explicitly asked
- The `design` nav item (kept during development for design reference)

---

## When you're stuck

If a change is ambiguous, propose the smallest reasonable interpretation and flag it. Better to ask one question and ship a clean small change than to guess across many ambiguities.

If a prompt is too big, split it. Apply Part 1, push, then come back for Part 2. The reviewer would rather see 5 small clean PRs than 1 big partially-applied one.
