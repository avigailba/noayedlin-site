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
- **Fonts:** Fraunces (serif headlines) + Roboto (sans body), via Google Fonts

## Warnings — always flag before acting

The site owner is not a developer. Before taking any of the following actions, **stop and explain what could go wrong first**:

- **DNS / domain changes** — warn that old URLs (images, pages, admin panels) will break once the domain points elsewhere. Ask if all assets have been backed up.
- **Deleting or overwriting files** — confirm before replacing images or content that can't be recovered.
- **Pushing to production** — note what will change on the live site.
- **Changing hosting or infrastructure** — explain what will become inaccessible.
- **Any action that is hard to reverse** — flag it explicitly before proceeding.

Format: one short plain-English sentence explaining the risk, then ask "Want to proceed?"

---

## Hosting and publishing

- **Live site:** https://www.noayedlin.com, built and served by **Vercel** from the `main` branch. Pushing a branch makes a private Vercel **preview** only; merging to `main` is what changes the live site.
- **`.github/workflows/deploy.yml`** publishes to GitHub Pages on every push to `main`. It looks like a leftover and is not the live site. Don't rely on it, and don't remove it unless the owner asks.
- The cloud session can't reach external sites (including noayedlin.com, Vercel and the event ticket pages), so live pages can't be checked from here — ask the owner to look and describe or screenshot them.
- Work on the feature branch named in the session. After a pull request is merged, restart the branch from the latest `main` before new work.

## Working with the owner

The owner is not technical. Learned across sessions:

- **Local first.** Make changes in the working tree only. Don't commit or push until the owner says "commit and push" or "push" (each push approval covers that batch only). Merging to `main` needs a clear yes after explaining what changes on the live site. Ignore the stop-hook reminders about uncommitted changes until then.
- **Show, don't describe.** After a visual change, send screenshots (desktop and mobile when relevant) and measure alignment in the browser (Playwright is installed; the dev server stops now and then, so restart it).
- **Plain language, short answers.** No jargon. Ask one clear question when a request is ambiguous or conflicts with an earlier decision. Don't ask the owner to do manual steps (settings, deploy hooks) when the site can handle it itself.
- **Design decisions already made:** English only; no event detail pages (all event info lives on the card); no event type shown; every linked event shows one **Event details** button; real data only — don't invent event descriptions. When a spec conflicts with these or with the type scale, ask before building.

## Adding an event

1. Create `src/content/events/<name>-<year>.md` with: `title`, `date_start` (`"YYYY-MM-DD"`), optional `date_end`, optional `time` (e.g. `"6–9 p.m."`), `city`, optional `region`, `country`, optional `venue`, `description` (can be `""`), optional `note` (shown in place of the button when there's no link), optional `url`, `status` (`scheduled`, `ticketed`, `details_coming_soon` or `past`), `type` (required, not shown), `order`.
2. Online events: `city: Online`, no `region`.
3. Keep the time out of the description. Keep descriptions to about 110 characters and venues to 1 line.
4. Commit and merge as usual. Events move to "Past events" by themselves once their last day has passed (see `<EventCard>`); no rebuild is needed.

---

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
- `--font-body`: `'Roboto', system-ui, -apple-system, sans-serif`

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

### `<EventCard>`

**Path:** `src/components/EventCard.astro` (styles: `.ev-card` / `.ev-grid` in `global.css`; date and location helpers: `src/lib/events.ts`)

Tinted square card for one event, used on `/events` and the homepage inside a `.ev-grid` (3 / 2 / 1 columns at desktop / ≤900px / ≤560px; 32px gap at every width). There are no event detail pages — all details live on the card.

**Props:**
- `event: CollectionEntry<'events'>`
- `variant?: 'upcoming' | 'past'` — default `upcoming`. `past` uses `--bg-past` (`#ECECEA`, the only token added for it).

**Markup:** one `<article class="ev-card">` with these children in order: `.ev-card__meta` (the `<time datetime>` date, then the optional `time` field after a `·`; the event `type` is not shown) · `.ev-card__body` (`<h3>` title + description) · `.ev-card__where` (`city, region` or `Online`; optional venue clamped to 1 line, full venue in a `title` attribute) · `.ev-card__action`.

**Where it's used:** `/events` shows every event (upcoming grid, then a "Past events" heading with a count and a grid; the first 6 past events show and the rest sit behind a **Show all past events** `<details>` toggle). The homepage "Upcoming Events" block renders every upcoming event and shows the next 3 that haven't ended.

**Past events move on their own:** the site is built ahead of time, so an inline script on `/events` and the homepage compares each card's `data-end` (its last day) with the visitor's date. On `/events`, ended cards move into the "Past events" grid (newest first), get the year in the date, and the count updates. On the homepage, ended cards are hidden and the next ones take their place; the block disappears if none are left. No rebuild is needed. Without JavaScript the page shows the state from the last build. Don't add a rebuild job for this.

**Event content** (`src/content/events/*.md`, schema in `content.config.ts`): `title`, `date_start`, optional `date_end`, optional `time` (shown next to the date), `city`, optional `region`, `country`, optional `venue`, `description` (may be empty), optional `note`, optional `online` (true if the event also takes place online: the location block shows the place and "Online" as bullets), optional `url`, `status`, `type` (required by the schema, not shown on the card), `order`.

**Dates:** `Nov 4`, `Nov 12–13`; past events and dates outside the current year include the year (`Mar 18, 2025`).

**Action rules:**
| Case | Action |
|---|---|
| has `url` | `.btn-primary` **Event details →** (new window, "(opens in new window)" in the aria-label); the whole card is clickable via a stretched link on the button (one `<a>`, no nested links) |
| no `url`, has `note` | the `note` lines under the location (muted, 14px), e.g. "Free admission — Open to the public" and the address; no button |
| no `url`, no `note`, `details_coming_soon`, upcoming | muted text **Details coming soon** (not a button) |
| anything else | no action |

On mobile the label shortens to **Details →** (the full label stays for screen readers).

**Hover:** the card has no hover state (no invert, lift, shadow or scale). The whole card is still clickable when it has a link, and the button keeps the standard `.btn-primary` hover. Touch gets `.ev-card:active` feedback.

**Fixed slots (desktop and tablet):** every card is the same height and the divider and button sit at the same height on every card, in every row. Body slot is 122px (title clamped to 2 lines, description to 3), or 96px with the title clamped to 1 line on screens 1000px and wider; location slot is 50px (the place plus one more line, e.g. a venue or "Online"). Keep titles short — on wide screens a title longer than one line is cut off with an ellipsis. Do not turn these into `min-height`. Keep the time out of the description (use the `time` field) and descriptions to about 110 characters, titles to 2 lines and venues to 1 line — anything longer is cut off. A `note` (use `\n` for extra lines) goes under the location in the same muted style, e.g. "Free admission — Open to the public" and the address; use it for events with no link — with no button on the card, the location block grows into the button's space, so the row height doesn't change.

**Mobile (≤560px):** one column; fixed heights and clamps removed; location and button share one row with the divider above it; button min-height 44px; past cards hide the description.

**Type:** date/time meta 12px, description, location and button 14px (all standard tokens). Deliberate exceptions to the type scale, from the event-card spec: title 24px at weight 600 (22px on mobile) and the past-events heading 32px (26px on mobile). No other component should use them.

**Rules:** no accent color in the card, no border-radius. The location block's hairline is the one divider allowed inside a card. Line-heights 1.15 (title), 1.45 (description) and 1.5 (location) are exceptions from the event-card spec.

### Buttons

`.btn-primary` (black) and `.btn-secondary` (outlined) are the only button styles. **Labels are sentence case, written as they should appear** (`Event details →`, `All events →`) — no automatic capitalizing. Hover: black buttons fade to 75% (dark grey, no movement); outlined buttons fill solid black with white text. External links use `↗`, internal navigation uses `→`.

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

### Event row pattern (legacy)

Events no longer use rows — `/events` and the homepage use `<EventCard>`. The `.event-row` / `.event-meta` styles still exist in `global.css` and are shown on the internal `design` page, but nothing on the live pages uses them. The media list still uses the same row pattern (`.press-row`).

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

Use hairlines only in these places:
1. Header bottom border (sticky boundary)
2. Between rows in a list (media) — only between, not above first or below last
3. Above the footer
4. Inside an `EventCard` (above the location) and under the "Past events" heading on `/events`

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
│   ├── EventCard.astro  # event card (upcoming / past)
│   ├── MobileNav.astro  # mobile drawer
│   └── ...              # header + footer are inline in layouts/Layout.astro
├── content/
│   ├── books/en/      # one .json per book (4 books); collection: booksEn
│   ├── events/        # one .md per event (collection: events)
│   ├── media/         # one .md per press item
│   └── adaptations/   # one .md per adaptation
├── content.config.ts  # collection schemas
├── lib/
│   └── events.ts      # event date + location helpers
├── layouts/
│   └── Layout.astro   # root layout (contains header + footer inline)
├── pages/
│   ├── index.astro
│   ├── books/[slug].astro
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
