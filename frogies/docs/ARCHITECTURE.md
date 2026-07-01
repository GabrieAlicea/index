# Frogies — Software Architecture Document

**Status:** Draft for approval — no application code has been written yet.
**Scope:** Everything needed to scaffold, build, and ship Frogies from zero.

> Frogies is an original interactive experience where visitors design, name, and
> release animated Puerto Rican Coquí frogs into a living rainforest scene. It is
> inspired by the *interaction model* of drawafish.com (draw → customize → release
> → collect) but every visual, sound, mechanic, and piece of content is original
> and centered on Puerto Rico's coquí and El Yunque-style rainforest ecology.

---

## 0. A note on this repository

This repo (`gabriealicea/index`) currently hosts a **live, unrelated production
site** at the root — a static "Handled" home-services landing page, deployed via
GitHub Pages (`CNAME` → `handledcf.com`). That site must not be modified or
deleted as part of this work.

**Decision:** Frogies will live entirely under `/frogies` as a self-contained
Next.js application with its own `package.json`, deployed independently (see
§13 Deployment). Nothing under `/frogies` affects the GitHub Pages build at the
repo root, and nothing at the repo root affects Frogies.

---

## 1. Tech Stack & Rationale

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | File-system routing, RSC for fast first paint on the landing page, built-in image/font optimization, easy SEO primitives (`sitemap.ts`, `robots.ts`, `metadata`). Originally scoped as "14+"; scaffolded directly against the latest stable release (16.2.9) at M0 since 14.x's final patch still carried several unresolved high/critical advisories, and no version-specific APIs were in play yet to make upgrading costly. Lint runs via a flat `eslint.config.mjs` (`next lint` was removed in this version) — `npm run lint` calls `eslint .` directly. |
| Language | TypeScript (strict) | Frog configs, trait tables, and animation state machines are exactly the kind of structured data that benefits from exhaustive typing. |
| Styling | Tailwind CSS | Fast iteration on a large, consistent design-token set; pairs well with a component library that needs many small visual variants (swatches, panels, badges). |
| Motion | Framer Motion | Declarative variants/orchestration for UI transitions and layered SVG frog animation (breathing, blinking, jumping) with built-in `prefers-reduced-motion` support via `MotionConfig`. |
| Ambient FX | Hand-rolled Canvas 2D engine | Rain, fireflies, fog, and ripples are many-particle effects — cheaper on a single `<canvas>` with `requestAnimationFrame` than as hundreds of animated DOM/SVG nodes. No heavy dependency (no three.js) — keeps bundle small and matches the 2D, illustrative art style. |
| State | Zustand (+ `persist` middleware) | Minimal boilerplate, selector-based subscriptions avoid re-render storms in a frequently-updating creator UI, first-class localStorage persistence for the collection. |
| Accessible primitives | Radix UI (unstyled) | Tabs, Slider, Dialog, Toggle, Tooltip, Popover — WAI-ARIA-correct behavior out of the box, styled with Tailwind. Avoids reinventing keyboard/focus handling for the customization panel. |
| Audio | Native `Audio`/`WebAudio` wrapped in a small `SoundManager` | Avoids a heavy audio library; we only need layered loops + one-shots with fades and a master mute/volume. |
| Testing | Vitest + React Testing Library (unit/component), Playwright (e2e) | Standard, fast, works well with Next.js App Router. |
| Deployment | Vercel | Native Next.js support, image optimization, preview deployments per PR, edge network for global load speed. |

---

## 2. Folder Structure

```
frogies/
├── app/
│   ├── layout.tsx                 # Root layout: providers, fonts, <html>/<body>
│   ├── page.tsx                   # Landing page
│   ├── globals.css                # Tailwind directives + CSS custom properties
│   ├── manifest.ts                # PWA manifest
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── creator/
│   │   └── page.tsx                # Frog Creator experience
│   ├── gallery/
│   │   └── page.tsx                # Collection gallery
│   ├── frog/
│   │   └── [id]/page.tsx           # Single frog detail / share / export view
│   └── learn/
│       └── page.tsx                # Educational fact browser
│
├── components/
│   ├── landing/                    # HeroSection, FeatureHighlights, LandingCTA
│   ├── creator/                    # CustomizationPanel, ColorSwatchGrid, RarityBadge, RandomizeButton
│   ├── frog/                       # FrogRenderer + its layered SVG part components (the core visual system)
│   ├── environment/                # RainforestScene, canvas layers (Fog, Rain, Fireflies, Leaves), DayNightCycle
│   ├── gallery/                    # FrogGrid, FrogCard, EmptyState, ExportDialog
│   ├── learn/                      # FactBrowser, FactCard, CategoryTabs
│   ├── audio/                      # AmbiencePlayer, SoundToggle, VolumeSlider
│   ├── ui/                         # Design-system primitives: Button, IconButton, Modal, Slider, Tabs, Tooltip, Toggle, Badge
│   └── layout/                     # Header, Footer, PageShell, SkipToContent
│
├── hooks/
│   ├── useFrogAnimationState.ts    # State machine driving idle/blink/jump/croak/sleep
│   ├── useCanvasLoop.ts            # rAF loop with visibility + reduced-motion pausing
│   ├── useReducedMotion.ts
│   ├── usePrefersDarkMode.ts
│   └── useLocalCollection.ts       # thin wrapper over collectionStore selectors
│
├── stores/                         # Zustand
│   ├── builderStore.ts             # In-progress frog being customized (ephemeral/draft)
│   ├── collectionStore.ts          # Saved frogs — persisted
│   ├── settingsStore.ts            # Sound/volume/reduced-motion/time-of-day override — persisted
│   └── audioStore.ts               # Runtime playback state — not persisted
│
├── lib/
│   ├── frog/
│   │   ├── nameGenerator.ts
│   │   ├── personalityGenerator.ts
│   │   ├── rarity.ts               # Golden/albino/rare-skin odds & rules
│   │   └── frogConfig.ts           # FrogConfig type + default/random factory
│   ├── canvas/
│   │   ├── rainEngine.ts
│   │   ├── fireflyEngine.ts
│   │   ├── fogEngine.ts
│   │   └── rippleEngine.ts
│   ├── audio/
│   │   └── soundManager.ts
│   ├── export/
│   │   ├── exportPng.ts
│   │   └── exportSvg.ts
│   ├── storage/
│   │   └── persist.ts              # localStorage guard (quota/private-mode safe) + schema versioning/migration
│   └── seo/
│       └── metadata.ts
│
├── data/
│   ├── names.ts                    # Curated Puerto Rican name pool
│   ├── personalityTraits.ts
│   ├── accessories.ts              # Catalog: hats, flowers, PR-flag items, backpack, etc.
│   ├── colorPalettes.ts
│   └── facts.ts                    # Educational content, tagged by category
│
├── types/
│   ├── frog.ts                     # FrogConfig, Personality, Rarity
│   ├── environment.ts
│   └── index.ts
│
├── assets/
│   └── svg/
│       ├── frog-parts/
│       │   ├── bodies/
│       │   ├── eyes/
│       │   ├── patterns/
│       │   ├── bellies/
│       │   └── accessories/
│       └── environment/
│           ├── leaves/ flowers/ rocks/ clouds/
│
├── public/
│   ├── audio/
│   │   ├── coqui/                  # Original/licensed coquí call recordings
│   │   ├── ambience/                # rain, wind, birds, stream loops
│   │   └── ui/                      # short UI feedback sounds
│   └── images/                     # favicons, OG image, PWA icons
│
├── docs/
│   ├── ARCHITECTURE.md             # This document
│   └── MILESTONES.md
│
├── tests/
│   ├── unit/
│   └── e2e/
│
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 3. Naming Conventions

- **Components:** `PascalCase.tsx`, one component per file, file name = component name (`FrogRenderer.tsx`).
- **Hooks:** `camelCase.ts`, always prefixed `use` (`useFrogAnimationState.ts`).
- **Stores:** `camelCase` + `Store` suffix (`collectionStore.ts`), exported hook named `useCollectionStore`.
- **Types:** singular nouns, `PascalCase` (`FrogConfig`, not `FrogConfigs`).
- **Route segments (App Router folders):** `kebab-case` where multi-word (none currently multi-word, but future routes follow this).
- **CSS/Tailwind tokens:** `kebab-case` (`coqui-brown-500`, `radius-pill`).
- **Data/constants files:** `camelCase.ts` exporting `SCREAMING_SNAKE_CASE` only for true constants (`MAX_COLLECTION_SIZE`), otherwise `camelCase` exports (`names`, `personalityTraits`).
- **Canvas engines:** verb-free nouns + `Engine` suffix (`rainEngine.ts`), each exporting a factory function `createRainEngine(ctx, options)` returning `{ start, stop, resize }`.
- Barrel files (`index.ts`) only at the top of `components/*` subfolders to keep public API of each domain explicit — never deep-barrel the whole `components/` tree (keeps bundles splittable).

---

## 4. Component Hierarchy

```
RootLayout  (fonts via next/font, <ThemeProvider>, <MotionConfig reducedMotion="user">, <AudioProvider>)
│
├─ LandingPage  (app/page.tsx)
│   ├─ Header
│   ├─ HeroSection
│   │   ├─ RainforestScene (canvas: fog, leaf sway, ambient particles — low intensity)
│   │   ├─ HeroHeadline / HeroSubcopy
│   │   └─ PrimaryCTA ("Meet your Coquí")
│   ├─ AmbienceToggle (rain sound on/off)
│   ├─ FeatureHighlights (3–4 cards: Customize / Name / Release / Learn)
│   └─ Footer
│
├─ CreatorPage  (app/creator/page.tsx)
│   ├─ FrogCanvasStage
│   │   ├─ RainforestScene (mid intensity, reacts to selected time-of-day)
│   │   └─ FrogRenderer  (live preview, reads builderStore)
│   ├─ CustomizationPanel  (Radix Tabs: Body · Eyes · Pattern · Belly · Accessories · Rare Skins)
│   │   ├─ ColorSwatchGrid
│   │   ├─ StyleOptionGrid (eye style, pattern, toe color)
│   │   ├─ SizeSlider
│   │   └─ AccessoryPicker
│   ├─ NamePersonalityPanel
│   │   ├─ NameGeneratorField
│   │   └─ PersonalityCard (traits, favorite food/weather/activity, energy/curiosity/friendliness/bravery meters)
│   ├─ RandomizeButton
│   └─ SaveToCollectionButton
│
├─ GalleryPage  (app/gallery/page.tsx)
│   ├─ FrogGrid
│   │   └─ FrogCard × N (thumbnail, name, favorite/delete/rename/export menu)
│   └─ EmptyState ("Your pond is empty — create your first Coquí")
│
├─ FrogDetailPage  (app/frog/[id]/page.tsx)
│   ├─ FrogRenderer  (large, full animation state machine active)
│   ├─ RainforestScene (full intensity — day/night cycle, weather)
│   ├─ FrogFactCard  (educational content tied to frog's traits/rarity)
│   └─ ShareExportPanel (Download PNG / Download SVG / Copy link)
│
└─ LearnPage  (app/learn/page.tsx)
    └─ FactBrowser
        ├─ CategoryTabs (Coquí · Rainforest · Wildlife · Conservation · Culture)
        └─ FactCard × N
```

### `FrogRenderer` internals (the core visual system)

`FrogRenderer` takes a single `FrogConfig` prop and composes it from layered SVG
part components, each independently themeable via `currentColor` / CSS custom
properties so we never need pre-baked color image variants:

```
<FrogRenderer config={frogConfig} animationState="idle">
  <FrogBody />       fill driven by config.bodyColor + config.pattern overlay
  <FrogBelly />       fill driven by config.bellyColor
  <FrogEyes />        style variant (round/sleepy/wide) + config.eyeColor, blink via Framer Motion scaleY
  <FrogToes />        config.toeColor
  <FrogAccessories/>  0..n items from config.accessories, each its own SVG component
  <RaritySheen />     conditional: golden shimmer / albino glow overlay
</FrogRenderer>
```

Animation is orchestrated by `useFrogAnimationState`, a small state machine
(idle → blink → lookAround → stretch → croak → jump → sleep) driven by weighted
random timers plus explicit triggers (e.g., tap-to-croak). Each state maps to a
Framer Motion `variants` object applied per layer, so e.g. `jump` animates the
whole `<FrogRenderer>` transform while `blink` only animates `<FrogEyes>`.

---

## 5. State Management Plan

Four Zustand stores, each with a single responsibility. Components subscribe via
selectors (`useCollectionStore(s => s.frogs)`) to avoid unnecessary re-renders.

| Store | Persisted? | Responsibility |
|---|---|---|
| `builderStore` | Draft only (`localStorage` key `frogies:draft:v1`, restored on reload so users don't lose in-progress work) | Current in-progress `FrogConfig`, undo/redo stack for the creator, randomize action. |
| `collectionStore` | Yes — `frogies:collection:v1` | Array of saved frogs, CRUD (`add`, `rename`, `toggleFavorite`, `remove`), enforces a sane max collection size with a friendly warning before hitting localStorage limits. |
| `settingsStore` | Yes — `frogies:settings:v1` | Sound on/off, volume, reduced-motion opt-in override, time-of-day override, dark mode preference. |
| `audioStore` | No | Live `SoundManager` instance handle and current playback state; intentionally not persisted since audio nodes can't survive reload. |

**Persistence layer:** `lib/storage/persist.ts` wraps `zustand/middleware`'s
`persist` with:
- A `version` + `migrate()` function per store so future `FrogConfig` shape
  changes don't corrupt existing users' saved frogs.
- A `try/catch` guard around `localStorage` access (private browsing / quota
  exceeded / SSR) that falls back to an in-memory store and surfaces a
  non-blocking toast ("Your frogs won't be saved in this browser session").

**No prop drilling, no global React Context for app state.** Context is
reserved for cross-cutting singletons only: `ThemeProvider` (dark mode) and
`AudioProvider` (holds the one `SoundManager` instance and exposes it via a
hook, `useSound()`).

---

## 6. Animation System

Two complementary systems, chosen per what they're best at:

1. **Framer Motion — the frog itself and all UI.** Declarative, works with
   React's render cycle, has first-class `prefers-reduced-motion` support via
   `<MotionConfig reducedMotion="user">` at the root layout. Used for:
   idle breathing loop, blinking, jump arcs, croak pulse, stretch, tongue-flick,
   panel/modal transitions, gallery card hover/tap feedback.

2. **Canvas 2D particle engines — ambient environment effects.** Each engine
   (`rainEngine`, `fireflyEngine`, `fogEngine`, `rippleEngine`) is a plain
   TypeScript factory (no React re-renders per frame) driven by a single shared
   `useCanvasLoop` hook that:
   - Wraps `requestAnimationFrame`.
   - **Pauses automatically** on `document.visibilitychange` (tab hidden) and
     when `prefers-reduced-motion: reduce` is set (falls back to a static
     illustrative frame).
   - Exposes a **quality tier** (`low` / `medium` / `high`) derived from
     viewport size and `navigator.hardwareConcurrency`, which scales particle
     counts (e.g., 40 raindrops on low-end mobile vs. 200 on desktop).

Water ripple effects on frog jump/landing and leaves reacting to wind are the
seam between the two systems: the trigger (jump landed) comes from the Framer
Motion `onAnimationComplete` callback on `FrogRenderer`, which calls into the
canvas `rippleEngine.emit(x, y)`.

---

## 7. Asset Organization

- **Frog parts are SVG React components, not raster images**, so color
  customization is just prop/CSS-variable driven — no need to pre-render every
  color × pattern × accessory combination as separate files.
- Structure mirrors the customization taxonomy: `assets/svg/frog-parts/{bodies,eyes,patterns,bellies,accessories}`.
- Environment decorations (leaves, flowers, rocks, clouds) live under
  `assets/svg/environment/`, imported directly into canvas/SVG environment
  components — kept separate from frog parts since they're never
  user-customized, only art-directed.
- **Audio** lives in `public/audio/{coqui,ambience,ui}` and is lazy-loaded on
  first user interaction (never autoplayed on page load, per browser autoplay
  policy and to respect user attention).
- All original artwork and audio — nothing sourced from or resembling
  drawafish.com's assets.

---

## 8. Tailwind Design Tokens

Extend `tailwind.config.ts` `theme.extend` with a Puerto Rican rainforest
palette, a friendly rounded radius scale, and motion keyframes shared by the
canvas/SVG systems:

```ts
// tailwind.config.ts (excerpt)
colors: {
  canopy:  { 900: '#0B3D24', 700: '#145C34', 500: '#1E7A45' },
  moss:    { 500: '#3F7D4E', 300: '#7FAE7E' },
  fern:    { 400: '#6FA96B' },
  leaf:    { 300: '#A8D5A2', 100: '#DCEFD8' },
  bark:    { 800: '#3E2C23', 600: '#5A3F30' },
  soil:    { 600: '#6B4A34' },
  coqui:   { 700: '#5C3B22', 500: '#8B5E3C', 300: '#C9A57A' }, // the frog's own earth tones
  flamboyan: { 500: '#E8542B' }, // flame tree accent
  orchid:    { 500: '#B565A7' },
  hibiscus:  { 500: '#E23E57' },
  dawn:      { 100: '#FCE8C6' },
  dusk:      { 700: '#2B2A5C' },
  midnight:  { 900: '#10122B' },
  stream:    { 400: '#4FB3BF' },
  mist:      { 100: '#EAF6EF' },
  firefly:   { 400: '#FFD873' },
  sungold:   { 500: '#F4B942' },
  cream:     { 50: '#FBF8F1' },
  stone:     { 200: '#E4DED0' },
  charcoal:  { 800: '#24261F' },
  // rare skins
  golden:    { DEFAULT: '#F4B942', shimmer: '#FFE9A8' },
  albino:    { DEFAULT: '#FDFBF7', blush: '#F6D9D2' },
},
fontFamily: {
  display: ['var(--font-fredoka)', 'sans-serif'],  // headings, CTA, mascot voice
  body:    ['var(--font-nunito)', 'sans-serif'],   // body copy, UI labels
},
borderRadius: {
  sm: '0.375rem', md: '0.75rem', lg: '1.25rem', xl: '2rem', pill: '999px',
},
boxShadow: {
  soft: '0 4px 20px -4px rgba(11,61,36,0.15)',
  lifted: '0 12px 32px -8px rgba(11,61,36,0.25)',
},
keyframes: {
  breathe: { '0%,100%': { transform: 'scaleY(1)' }, '50%': { transform: 'scaleY(1.03)' } },
  blink: { '0%,90%,100%': { transform: 'scaleY(1)' }, '95%': { transform: 'scaleY(0.1)' } },
  fireflyFloat: { '0%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' }, '100%': { transform: 'translateY(0)' } },
  leafSway: { '0%,100%': { transform: 'rotate(-3deg)' }, '50%': { transform: 'rotate(3deg)' } },
},
```

Design tokens are also mirrored as plain TS constants in `lib/theme/tokens.ts`
so non-Tailwind consumers (Canvas 2D `fillStyle` calls, which can't read
Tailwind classes) draw from the *same* source of truth instead of hardcoded
hex strings scattered through the canvas engines.

---

## 9. Typography System

- **Display / headings / mascot voice:** [Fredoka](https://fonts.google.com/specimen/Fredoka) — rounded, friendly, playful without being childish; carries the "Nintendo-level charm" brief well for a mascot brand.
- **Body / UI copy:** [Nunito](https://fonts.google.com/specimen/Nunito) — rounded sans that pairs cleanly with Fredoka, excellent legibility at small sizes for panel labels and fact text.
- Loaded via `next/font/google` (self-hosted, zero layout shift, no external
  request at runtime) with CSS variables (`--font-fredoka`, `--font-nunito`)
  wired into the Tailwind `fontFamily` tokens above.
- **Scale** (Tailwind defaults, used consistently):
  `text-xs` (12px, captions) → `text-sm` (14px, UI labels) → `text-base` (16px,
  body) → `text-lg`/`text-xl` (subheads) → `text-3xl`/`text-5xl` (section
  headings) → `text-6xl`/`text-7xl` (hero headline, clamped with
  `clamp()`/Tailwind arbitrary values for fluid sizing on mobile).
- Minimum body size never below 16px to avoid iOS auto-zoom on form inputs
  and to keep long-form Learn Mode content comfortable to read.

---

## 10. Color Palette — Puerto Rico Rainforest

The palette is built from four families so any screen (hero, creator, night
scene, rare-skin frog) stays cohesive:

1. **Canopy greens** (`canopy`, `moss`, `fern`, `leaf`) — the dominant
   rainforest register, used for backgrounds, environment art, primary buttons.
2. **Earth tones** (`bark`, `soil`, `coqui`) — the coquí's natural coloring and
   ground/rock textures; also doubles as a warm neutral for text on light
   backgrounds.
3. **Tropical accent flowers** (`flamboyan` red-orange, `orchid` purple,
   `hibiscus` pink-red) — used sparingly for CTAs, rare accessory items, and
   accent highlights so the palette doesn't read as monochrome green.
4. **Sky & water** (`dawn`, `dusk`, `midnight`, `stream`, `mist`) — drives the
   day/night/sunset environment cycle and water/ripple effects.
5. **Firefly gold** (`firefly`, `sungold`) — the "magic" accent: fireflies,
   golden-frog rarity, subtle glow effects, achievement/rare-unlock moments.

All text/background pairings are checked against WCAG AA contrast (see §12)
before being used for body copy — the saturated accent colors (`flamboyan`,
`hibiscus`) are reserved for large text, icons, and decorative fills, never
small body text on a light background.

---

## 11. Mobile Responsiveness Strategy

- **Mobile-first** Tailwind usage throughout (`base → sm → md → lg → xl`),
  designed at 375px width first, then enhanced upward.
- **Creator layout adapts structurally, not just via scaling:**
  - Desktop (`lg+`): `FrogCanvasStage` and `CustomizationPanel` side-by-side.
  - Mobile: `CustomizationPanel` becomes a swipeable bottom sheet (Radix
    `Dialog`/`Drawer` pattern) over a full-width stage, so the frog preview
    stays the visual focus.
- **Touch targets** ≥ 44×44px for all swatches, buttons, and sliders (a
  known drawafish.com-style pain point on mobile color grids).
- **Canvas particle density scales down** on small/low-power devices via the
  quality-tier system in §6, keeping 60fps a realistic target on mid-range
  phones rather than only on desktop.
- **Gallery grid**: 2 columns on mobile → 3 on tablet → 4–5 on desktop, using
  CSS grid with `auto-fit`/`minmax` rather than fixed breakpython column counts,
  so it degrades gracefully at in-between widths.
- Sound/ambience controls collapse into a single icon button with a popover on
  mobile instead of an inline volume slider, to save header space.

---

## 12. Accessibility Checklist (WCAG 2.1 AA)

- [ ] All color pairings used for text meet AA contrast (4.5:1 body, 3:1 large
      text) — verified against the palette in §10 before shipping any screen.
- [ ] Every interactive control is keyboard operable with a visible
      `focus-visible` ring (custom Tailwind `ring` styles, never `outline-none`
      without a replacement).
- [ ] Customization controls (color swatches, style pickers) built on Radix
      `RadioGroup`/`ToggleGroup` primitives — correct roving tabindex and ARIA
      out of the box — each swatch has an accessible name (e.g. `aria-label="Set
      body color to Moss Green"`), not just a colored div.
- [ ] Live region (`aria-live="polite"`) announces generated name/personality
      changes so screen-reader users get the same "reveal" moment as sighted
      users.
- [ ] `prefers-reduced-motion` respected globally: Framer Motion via
      `<MotionConfig reducedMotion="user">`, canvas engines via the shared
      `useCanvasLoop` reduced-motion branch (§6).
- [ ] All ambient/UI sound has a clearly labeled, keyboard-reachable
      mute/volume control — never autoplays without explicit user action.
- [ ] Exported PNG/OG images have meaningful `alt` text generated from the
      frog's name and traits (e.g. "Luna, a golden Coquí who loves rain").
- [ ] Semantic landmarks (`header`, `nav`, `main`, `footer`) on every page,
      plus a "skip to content" link.
- [ ] Every generator/randomize button has a real text label (icon + text),
      not an icon-only affordance.
- [ ] Manual pass with VoiceOver and NVDA before each milestone ships
      (tracked as an explicit acceptance-criterion item, not an afterthought).

---

## 13. Performance Optimization Plan

- **Code splitting:** `CreatorPage`'s customization panel and all canvas
  engines are loaded via `next/dynamic(() => import(...), { ssr: false })`
  since they touch `window`/`canvas` and aren't needed for the landing page's
  first paint.
- **Audio** is fetched lazily on first interaction, never bundled or
  preloaded eagerly.
- **SVG-as-components** instead of raster images for all frog parts — no
  network requests, tree-shakeable, and trivially recolorable, which also
  keeps the customization system fast (no image swapping/repaints).
- **`next/image`** for the few raster assets we do have (OG images, favicons).
- **rAF loops pause** when the tab is hidden or reduced-motion is active
  (§6), so idle background tabs cost ~0 CPU.
- **Adaptive quality tiers** (§6) scale particle counts to device capability
  instead of shipping one fixed-cost effect budget for all devices.
- **Memoized frog layers:** `FrogRenderer`'s sub-parts are `React.memo`'d and
  read from store selectors with stable references, so changing one swatch in
  the creator doesn't re-render the whole SVG tree.
- **Gallery virtualization** planned once collections regularly exceed ~60
  frogs (see Roadmap) — not needed for MVP scale but the `FrogGrid` component
  boundary is designed so swapping in `react-virtuoso` later doesn't touch
  `FrogCard` or the store.
- **Budgets:** landing route ≤ 200KB gzip JS, Lighthouse Performance ≥ 90 on
  mobile, target 60fps for all continuous animation on mid-tier mobile
  hardware (quality-tier `medium`).

---

## 14. Deployment Strategy

- **Frogies deploys as its own Vercel project**, with the Vercel "Root
  Directory" setting pointed at `/frogies` in this repo. This keeps it fully
  isolated from the GitHub Pages build serving the existing site at the repo
  root (§0) — the two deployments never touch the same files or build
  pipeline.
- **Environments:** every PR gets a Vercel preview deployment; `main` branch
  auto-deploys to production once the architecture and each milestone are
  approved.
- **CI (future milestone, tracked in roadmap):** GitHub Actions workflow
  scoped to `frogies/**` changes only, running typecheck, lint, unit tests,
  and Playwright smoke tests before merge.
- **Custom domain:** to be decided by the user (a `frogies.<domain>` subdomain
  or standalone domain) — intentionally not assumed here since it doesn't
  affect the architecture.

---

## 15. Future Feature Roadmap (post-MVP)

Not part of the initial milestones (§16) — captured here so later decisions
stay consistent with this architecture rather than bolted on:

- **Shareable frog links** — `/frog/[id]` already designed to support a
  shareable, read-only view; add OG-image generation per frog.
- **Seasonal events** — hurricane-season rain intensifier, Three Kings Day
  accessory drops, coquí mating-season chorus ambience.
- **Achievements/badges** — "found a golden frog," "collected 10 frogs,"
  surfaced via a lightweight, non-persisted-store `achievementsStore`
  following the same pattern as §5.
- **Real recorded coquí calls** — replace/augment synthesized placeholders
  with licensed field recordings; track licensing in `public/audio/coqui/CREDITS.md`.
- **Gallery virtualization** — swap in `react-virtuoso` behind the existing
  `FrogGrid` boundary once typical collections grow large.
- **Accounts/cloud sync** — optional account layer so a collection isn't
  bound to one browser's localStorage; `collectionStore` was designed with a
  versioned schema specifically to make this migration low-risk later.
- **Classroom/education mode** — bulk fact browsing and printable frog
  fact-sheets for Puerto Rican schools, extending `LearnPage`.
- **AR "release" mode** — view your frog in your room via WebXR, as a bigger,
  separate experiment gated behind feature detection.

---

## 16. Milestones

Each milestone is small, independently shippable/reviewable, and has explicit
acceptance criteria. See `frogies/docs/MILESTONES.md` for the tracked version
of this list.

| # | Milestone | Acceptance criteria |
|---|---|---|
| M0 | **Scaffold & design system foundation** | Next.js app boots at `/frogies`; Tailwind tokens (§8) wired in; Fredoka/Nunito loaded; `ui/` primitives (Button, Modal, Tabs, Slider, Toggle, Tooltip) built on Radix and themed; dark mode toggle works. |
| M1 | **Landing page** | Animated hero with `RainforestScene` (fog + leaf sway only, no rain/fireflies yet), headline, primary CTA to `/creator`, ambience toggle (silent placeholder audio ok), responsive down to 375px, Lighthouse Perf ≥ 90. |
| M2 | **Frog Renderer core** | `FrogRenderer` assembles from layered SVG parts given a static `FrogConfig`; idle breathing + blink animation running at 60fps; component is `React.memo`'d and covered by a unit test asserting it renders all layers. |
| M3 | **Creator: customization panel** | All customization axes (body/pattern/eyes/eye color/belly/toe color/size/smile/accessories) wired live to `FrogRenderer` via `builderStore`; keyboard-accessible swatches per §12; mobile bottom-sheet layout works. |
| M4 | **Name, personality & rarity** | Name generator + manual rename; personality generator populates all listed trait fields; golden/albino/rare-skin logic implemented with defined odds in `lib/frog/rarity.ts`; single Randomize button rolls all of the above coherently. |
| M5 | **Full animation state machine** | `useFrogAnimationState` implements idle/blink/lookAround/stretch/croak/jump/sleep/tongue-flick with weighted random transitions + tap-to-croak trigger; reduced-motion fallback verified. |
| M6 | **Environment system** | Canvas engines for fog, leaves, fireflies, rain, and water ripples; day/night/sunset cycle with matching sky palette from §10; wind affects leaf sway; quality tiers verified on a low-end device profile. |
| M7 | **Collection system** | `collectionStore` persists to localStorage with schema versioning; gallery grid with rename/favorite/delete; PNG and SVG export both produce correct, alt-texted output; private-browsing fallback verified. |
| M8 | **Educational mode** | `data/facts.ts` populated across all listed categories; `LearnPage` FactBrowser with category tabs; each saved frog links to at least one relevant fact on its detail page. |
| M9 | **Sound system** | Layered ambience (rain/forest/birds/water/wind) with independent-feeling mix, coquí call one-shots, global mute + volume in `settingsStore`, lazy-loaded per §13, autoplay-policy compliant. |
| M10 | **Accessibility & performance pass** | Full WCAG checklist (§12) verified with VoiceOver + NVDA; Lighthouse Perf/Accessibility both ≥ 90 on mobile; 60fps confirmed on mid-tier device for all animated screens. |
| M11 | **SEO, deploy & launch polish** | Metadata/OG images per route, `sitemap.ts`/`robots.ts`, Vercel production deploy live at agreed domain, analytics wired, final content/copy pass. |

---

## 17. Open Decisions for the User

A few choices are intentionally left for explicit confirmation before or
during implementation, since they affect scope/cost more than architecture:

1. **Domain** — where should Frogies live in production (subdomain of an
   existing domain, or a new one)?
2. **Coquí audio** — synthesize/commission original sound effects, or license
   real field recordings? (Affects M9 scope and `public/audio/coqui/CREDITS.md`.)
3. **Accounts/cloud sync** — confirmed as post-MVP (§15) unless priorities
   change.

---

**Next step:** review this document. Once approved, implementation begins at
**M0 (Scaffold & design system foundation)**, one milestone at a time, each
delivered and reviewed before moving to the next.
