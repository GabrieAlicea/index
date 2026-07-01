# Frogies — Milestone Tracker

Tracked, checkable version of the milestone table in `ARCHITECTURE.md` §16.
Implementation proceeds one milestone at a time; each is reviewed before the
next begins.

## M0 — Scaffold & design system foundation ✅
- [x] Next.js app boots at `/frogies` (isolated from repo-root site)
- [x] Tailwind tokens from ARCHITECTURE.md §8 wired into `tailwind.config.ts`
- [x] Fredoka + Nunito loaded via `next/font/google`
- [x] `ui/` primitives built on Radix: Button, Modal, Tabs, Slider, Toggle, Tooltip
- [x] Dark mode toggle functional

## M1 — Landing page
- [ ] Animated hero with `RainforestScene` (fog + leaf sway)
- [ ] Headline, primary CTA → `/creator`
- [ ] Ambience toggle present (audio can be placeholder)
- [ ] Responsive down to 375px
- [ ] Lighthouse Performance ≥ 90

## M2 — Frog Renderer core
- [ ] `FrogRenderer` assembles layered SVG parts from a static `FrogConfig`
- [ ] Idle breathing + blink animation at 60fps
- [ ] `React.memo`'d, unit test asserts all layers render

## M3 — Creator: customization panel
- [ ] All customization axes wired live via `builderStore`
- [ ] Keyboard-accessible swatches (WCAG §12)
- [ ] Mobile bottom-sheet layout

## M4 — Name, personality & rarity
- [ ] Name generator + manual rename
- [ ] Personality generator (all listed trait fields)
- [ ] Golden/albino/rare-skin logic with defined odds
- [ ] Single Randomize button rolls all of the above coherently

## M5 — Full animation state machine
- [ ] idle/blink/lookAround/stretch/croak/jump/sleep/tongue-flick implemented
- [ ] Tap-to-croak trigger
- [ ] Reduced-motion fallback verified

## M6 — Environment system
- [ ] Canvas engines: fog, leaves, fireflies, rain, water ripples
- [ ] Day/night/sunset cycle with matching sky palette
- [ ] Wind affects leaf sway
- [ ] Quality tiers verified on low-end device profile

## M7 — Collection system
- [ ] `collectionStore` persists with schema versioning
- [ ] Gallery grid: rename/favorite/delete
- [ ] PNG + SVG export with alt text
- [ ] Private-browsing fallback verified

## M8 — Educational mode
- [ ] `data/facts.ts` populated across all categories
- [ ] `LearnPage` FactBrowser with category tabs
- [ ] Each saved frog links to a relevant fact

## M9 — Sound system
- [ ] Layered ambience (rain/forest/birds/water/wind)
- [ ] Coquí call one-shots
- [ ] Global mute + volume in `settingsStore`
- [ ] Lazy-loaded, autoplay-policy compliant

## M10 — Accessibility & performance pass
- [ ] Full WCAG checklist verified (VoiceOver + NVDA)
- [ ] Lighthouse Perf/Accessibility ≥ 90 on mobile
- [ ] 60fps confirmed on mid-tier device

## M11 — SEO, deploy & launch polish
- [ ] Metadata/OG images per route
- [ ] `sitemap.ts` / `robots.ts`
- [ ] Vercel production deploy live
- [ ] Analytics wired, final content pass
