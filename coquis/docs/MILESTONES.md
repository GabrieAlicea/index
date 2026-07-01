# Coquis — Milestone Tracker

Tracked, checkable version of the milestone table in `ARCHITECTURE.md` §16.
Implementation proceeds one milestone at a time; each is reviewed before the
next begins.

## M0 — Scaffold & design system foundation ✅
- [x] Next.js app boots at `/coquis` (isolated from repo-root site)
- [x] Tailwind tokens from ARCHITECTURE.md §8 wired into `tailwind.config.ts`
- [x] Fredoka + Nunito loaded via `next/font/google`
- [x] `ui/` primitives built on Radix: Button, Modal, Tabs, Slider, Toggle, Tooltip
- [x] Dark mode toggle functional

## M1 — Landing page ✅
- [x] Animated hero with `RainforestScene` (fog + leaf sway)
- [x] Headline, primary CTA → `/creator`
- [x] Ambience toggle present (audio can be placeholder)
- [x] Responsive down to 375px
- [x] Lighthouse Performance ≥ 90 (100 desktop, 97 mobile-throttled; accessibility/best-practices/SEO also 100)

## M2 — Frog Renderer core ✅
- [x] `FrogRenderer` assembles layered SVG parts from a static `FrogConfig`
- [x] Idle breathing + blink animation at 60fps
- [x] `React.memo`'d, unit test asserts all layers render

## M3 — Creator: customization panel ✅
- [x] All customization axes wired live via `builderStore` (body/pattern/eyes/eye color/belly/toe color/size/smile/accessories)
- [x] Keyboard-accessible swatches (WCAG §12) — verified roving-focus arrow-key nav, Enter-to-select, and visible focus rings
- [x] Mobile bottom-sheet layout (desktop: inline aside; mobile: trigger + Radix-dialog-based bottom sheet)

## M4 — Name, personality & rarity ✅
- [x] Name generator + manual rename (editable text field + dice reroll)
- [x] Personality generator (trait, favorite food/weather/activity/place/time-of-day/flower, energy/curiosity/friendliness/bravery meters, voice pitch)
- [x] Golden/albino/rare-skin logic with defined odds (90/7/3%), user-selectable via a Rare Skins tab, visually overrides body/belly/toe colors with a shimmer (golden) or glow (albino) VFX
- [x] Single Randomize button rolls config (incl. rarity), name, and personality together coherently

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
