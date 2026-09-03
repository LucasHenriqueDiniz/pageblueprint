---
status: active
epic: store
---

# A `Store` port, so the core stops importing its own infrastructure

## Problem

`src/core/feature-registry.ts` line 1:

```ts
import { storage } from './storage'
```

`src/core/storage.ts` is a module-level singleton object with five direct calls to
`chrome.storage.sync`. The registry does not receive it — it reaches for it. Every consumer
inherits that transitively:

```
src/background/index.ts:3       import { runFeatures } from '@core/feature-registry'
src/shared/ui/FeatureToggle.tsx:2  import { isFeatureEnabled, setFeatureEnabled } from '@core/feature-registry'
src/popup/App.tsx:2             import { getFeatures } from '@core/feature-registry'
```

Three entrypoints, three separate vite builds (`vite.config.ts`, `vite.background.config.ts`,
`vite.content.config.ts`), and **nobody injects anything**. The consequences, in order of how
much they hurt:

1. `isFeatureEnabled` cannot be tested off a browser. Its default-fallback branch —
   `stored !== undefined ? stored : (feature?.defaultEnabled ?? false)` — is real logic with a
   real bug surface, and today the only way to exercise it is to load the unpacked extension.
2. There is no seam to swap `chrome.storage.sync` for `chrome.storage.local` (quota is 100KB
   vs 10MB, and `sync` throttles writes) without editing the registry.
3. The architecture audit put this repo at **`longe`** from the hexagon, and named this as the
   one step that is not a refactor.

## Solution

A seam, not a rewrite. `src/core/storage.ts` is already **almost** the shape of a port: four
methods, primitive types in and out, no `chrome` type in any signature except `onChanged`'s
`chrome.storage.StorageChange`. So:

- name the shape: a `Store` type
- keep the existing object as the adapter that implements it
- change `feature-registry` from importing the adapter to **receiving a `Store`**
- let each of the three entrypoints pass the real adapter in, at the edge where knowing about
  `chrome` is fine

Then, and only then, a `FakeStore` — a `Map` — makes the registry testable with no `chrome`
global in the file at all. That last slice is the whole point; the two before it are plumbing
that earns it.

## Surface

- `src/core/store.ts` (new) — the port
- `src/core/storage.ts` — declared as implementing it; the `onChanged` signature is the one
  place `chrome` types leak
- `src/core/feature-registry.ts` — stops importing `./storage`
- `src/background/index.ts`, `src/popup/App.tsx`, `src/shared/ui/FeatureToggle.tsx` — the three
  call sites that must now supply the adapter

## Scope

**In**
- the `Store` type and the adapter that satisfies it
- injection into `feature-registry` only
- an in-memory fake, and the registry's first real tests

**Out**
- a `domain/` or `application/` folder. The `testing` skill asks for a test per layer and names
  those two; **this repo has neither**, and inventing them to satisfy the wording would be
  cargo cult. The layer here is `src/core/`
- porting `messaging.ts` or `i18n.ts`. They wrap `chrome.runtime` and `chrome.i18n` the same
  way, and the same argument applies to them — but one port at a time, and the registry is the
  one with branching logic behind it
- changing `sync` to `local`. This makes that choice *possible*, it does not make it
- React context or a DI container. Three call sites do not need a framework

## Open questions

- Does `onChanged`'s `chrome.storage.StorageChange` belong in the port at all? Nobody calls
  `onChanged` today (`grep -rn "onChanged" src/` finds only the definition). Dropping it from
  the port is the cleaner answer and the cheaper one — but it is a deletion, so it wants a
  moment's thought rather than a reflex.
- Factory (`createFeatureRegistry(store)`) or per-call parameter? The registry also holds
  module-level mutable state (`const features: Feature[] = []`), which a factory would close
  over and a per-call parameter would leave dangling. Slice 01 decides, and says so in writing.

## Done

`src/core/feature-registry.ts` contains no `import … from './storage'`, `pnpm build` is green
across all three bundles, and a test file that never mentions `chrome` drives
`isFeatureEnabled` through both sides of its default-fallback branch.
