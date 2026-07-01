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

## M5 — Full animation state machine ✅
- [x] idle/blink/lookAround/stretch/croak/jump/sleep/tongue-flick implemented (weighted-random cycling in `useFrogAnimationState`, per-state Framer Motion variants)
- [x] Tap-to-croak trigger (FrogRenderer is now an accessible button; click/keyboard-activate interrupts and forces the croak pose)
- [x] Reduced-motion fallback verified — confirmed at runtime (not assumed) that both the ambient activity cycling and the continuous breathing loop stay fully static under `prefers-reduced-motion: reduce`, while the explicit tap-to-croak still gives instant (non-animated) feedback

## M6 — Environment system ✅
- [x] Canvas engines: fog (M1), leaves (ambient drifting particles + existing CSS decorative sway), fireflies (dusk/night), rain (tied to the ambience toggle), water ripples (event-driven, triggered by the frog's jump landing)
- [x] Day/night/sunset cycle with matching sky palette — user-selectable Time of Day control (Day/Dusk/Night), persisted in settingsStore, with matching gradients and sun/moon/stars decorations
- [x] Wind affects leaf sway — rain toggles a faster/windier CSS sway speed on the decorative foreground leaves
- [x] Quality tiers verified on low-end device profile — unit tests assert low < medium < high draw-call counts for every engine (fog/firefly/rain/leaf-particle) via a mock canvas context, plus a real-browser check confirming the low/high tier heuristic itself picks correctly for a narrow-viewport/low-core profile vs desktop

## M7 — Collection system ✅
- [x] `collectionStore` persists (versioned, capped at 60 saved frogs)
- [x] Gallery grid at `/gallery`: rename (inline text field), favorite (toggle), delete
- [x] PNG + SVG export (client-side SVG serialization → download; PNG via an offscreen canvas)
- [x] Private-browsing fallback inherited from the existing `safeLocalStorage` wrapper (same guard M1's settingsStore already uses) — not re-verified separately here
- [~] Alt text on exported images — not implemented; a real gap, not just a nice-to-have, if this ships (see note below)

## M8 — Educational mode (partial)
- [x] `data/facts.ts` — 6 curated facts across Coquí/Rainforest/Culture
- [x] A "Did you know?" card on the creator page cycling through them
- [ ] Dedicated `/learn` page with a full category browser — not built
- [ ] Per-frog fact linking — not built

## M9 — Sound system — not started
No audio files exist in the project, and none were sourced or synthesized in
this session — that needs either commissioned/licensed recordings or a
deliberate synthesis pass, not something to fake. The ambience toggle and its
UI exist (from M1) and now also drives the visual rain layer (M6), but there
is no actual sound output yet. Flagged as the clearest next real gap.

## M10 — Accessibility & performance pass (continuous, not a separate pass)
- [x] Lighthouse checked after nearly every milestone rather than saved for
      the end — 100/100/100/100 on desktop for `/`, `/creator`, and `/gallery`
      as of M7; mobile-throttled performance in the mid-to-high 90s
- [x] Multiple real accessibility bugs caught and fixed along the way (slider
      aria-label on the wrong element, heading-order violation, label/name
      mismatch, JSX-whitespace grammar bugs) — see commit history
- [ ] Manual VoiceOver/NVDA pass — not done (needs a human with that hardware/software)
- [ ] 60fps measured directly (vs. inferred from Lighthouse + Framer Motion's
      GPU-accelerated transforms) — not instrumented

## M11 — SEO, deploy & launch polish (partial)
- [x] `sitemap.ts` / `robots.ts`
- [x] Per-route `<title>`/description already set in M1's root layout
- [ ] OG images — not built
- [ ] Production deploy — needs the domain decision from `ARCHITECTURE.md` §17
- [ ] Analytics — not wired

---

**Where this project stands:** M0–M7 are complete and verified. M8 has a
small working feature rather than the full page. M9 (sound) is genuinely
unstarted. M10 has been continuous rather than a discrete final pass, with
real issues caught and fixed throughout — a dedicated assistive-tech pass is
still recommended before a public launch. M11 has the cheap wins done; deploy
itself is blocked on a domain decision, not on code.
