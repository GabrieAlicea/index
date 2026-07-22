# Raíz Labs

**Crea tu marca. Representa tu cultura.**

Raíz Labs is the operating system for Hispanic entrepreneurs to launch, manage, and
scale private-label and white-label brands — starting in Puerto Rico, expanding to the
U.S. mainland and Latin America. We are not a manufacturer: we are the trusted
orchestration layer connecting entrepreneurs with verified manufacturers, packaging
suppliers, designers, compliance specialists, and logistics partners.

## Documentation

The master product & architecture specification lives in
[`docs/RAIZ_LABS_PLATFORM_SPEC.md`](./docs/RAIZ_LABS_PLATFORM_SPEC.md). Read it first —
it covers:

- The **"Crea tu Marca"** 8-step brand-creation workflow (the core product)
- Personas and the end-to-end entrepreneur journey
- The design system (tokens, typography, motion, accessibility standards)
- Business logic: pricing engine, project/order/production state machines, compliance rulepacks
- Operational workflows for the four-sided platform (entrepreneurs, manufacturers, designers, internal ops)
- Full database design, API surface, and security model
- Automation & AI roadmap, KPI framework, risks, and the phased implementation plan

## Status

**Pre-implementation.** The spec is the source of truth; application scaffolding begins
with Sprint 0 as defined in spec §16 (Next.js App Router + TypeScript + Tailwind v4 on
Vercel, Supabase as system of record, Stripe payments, Resend email).

## Planned structure

```
app/            Next.js App Router — (marketing), (auth), (crear), dashboard/, portal/, admin/
components/     UI primitives, marketing sections, dashboard & studio components
lib/            Supabase clients, pricing engine, validation schemas, utilities
supabase/       SQL migrations + seed data
docs/           Product & architecture documentation
```
