---
status: todo
kanban: 45577ea9-e530-46df-8384-a6bd17d44aac
---

# Slice 02 — `feature-registry` receives a `Store` instead of importing one

## Delivers

`src/core/feature-registry.ts` line 1 — `import { storage } from './storage'` — is gone, and
the three entrypoints supply the adapter at the edge. This is the seam the architecture audit
called the one step that is not a refactor.

## Needs

- `store-port` slice 01: the `Store` type, and the two decisions it records (whether `onChanged`
  is in the port; factory versus per-call parameter)
- the three call sites, which are all of them:
  - `src/background/index.ts:3` — `runFeatures`
  - `src/shared/ui/FeatureToggle.tsx:2` — `isFeatureEnabled`, `setFeatureEnabled`
  - `src/popup/App.tsx:2` — `getFeatures` (needs no store; do not give it one)
- ~15 min: `src/shared/ui/FeatureToggle.tsx` is a React component that calls the registry from a
  `useEffect`. Decide how the store reaches it — prop, or a module-level composition root the
  component imports — before editing it

## Tests

Still no automated test; that is slice 03. The gates here are the compiler and the three
bundles, and one of them is manual on purpose:

1. `pnpm build` green — `tsc` plus all three vite configs (`vite.config.ts`,
   `vite.background.config.ts`, `vite.content.config.ts`). A change that compiles in the popup
   bundle and breaks the background one is exactly the failure three separate builds exist to
   catch.
2. **Load `dist/` unpacked in Chrome and toggle a feature.** There is no feature registered
   (`src/features/index.ts` is one comment line), so register a throwaway one for the check and
   remove it after. Confirm the toggle survives a popup close-and-reopen — that round trip is
   the whole behaviour being rewired, and nothing automated covers it until slice 03.
3. `grep -rn "core/storage" src/` names only the composition roots, not `feature-registry.ts`.

## Done when

```bash
! grep -q "\./storage" src/core/feature-registry.ts && pnpm build && echo INJECTED
```

Prints `INJECTED` on the last line, after the three `✓ built in` lines. A non-zero exit before
`INJECTED` means either the import is still there or a bundle broke.

## If stuck

- `FeatureToggle` turns ugly threading a store through props: stop and give the popup and
  options entrypoints a tiny composition root (`src/popup/main.tsx` already exists) that builds
  the registry once with the real adapter. A React context is the wrong size for three call
  sites.
- The module-level `features` array makes a factory awkward: split it. `registerFeature` /
  `getFeatures` keep the module-level list and need no store; only `isFeatureEnabled`,
  `setFeatureEnabled` and `runFeatures` take one. That is the smaller change and it is honest
  about which functions actually persist anything.
- The build breaks in the background bundle only: it is the entrypoint with no DOM and no React.
  Check that nothing you moved pulled a `.tsx` import into `src/background/index.ts`.
- It grows past an afternoon: revert and do the per-call-parameter version. Uglier signature,
  same seam, and slice 03 works either way.
