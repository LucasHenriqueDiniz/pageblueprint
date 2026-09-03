---
status: active
epic: tests
---

# A test harness, and a CI gate that can fail on it

## Problem

There is no test in this repo and no runner to run one.

```
$ git ls-files | grep -iE '\.(test|spec)\.|__tests__'
$ # no output, over 41 tracked files
```

`package.json` has three scripts — `dev`, `build`, `zip` — and no `vitest` or `jest` in
`devDependencies`. There is no `vitest.config.*` or `jest.config.*` at the root.
`.github/workflows/ci.yml` runs `pnpm run build` and nothing else, so **CI catches exactly what
`tsc` catches**: type errors. A function that compiles and returns the wrong value ships.

This matters more here than the file count suggests. Every module worth testing talks to the
`chrome.*` globals, which do not exist in Node — so "we will add tests later" is really "we will
first have to work out how to run anything at all without a browser". That cost is paid once,
and until it is paid the cost of the first test is unbounded and nobody writes it.

## Solution

Vitest, because the repo is already a Vite project: one alias config (`@core`, `@shared`) is
shared rather than re-declared, and there is no second build pipeline to keep in step.

Two slices. The first installs the runner and proves it on a module that needs **no** `chrome`
global at all (`src/core/logger.ts`, whose only dependency is `config.debug`). The second adds
the `test` step to CI, so a red test can actually stop a merge.

Testing the modules that *do* touch `chrome` is deliberately **not** in this pitch: doing it
properly means injecting the dependency rather than stubbing a global, which is the `store-port`
pitch next door. That pitch's last slice is the first real test of extension behaviour, and it
`Needs` slice 01 from here.

## Surface

- `package.json` — `test` script, `vitest` devDependency
- `vitest.config.ts` (new, root)
- `src/**/*.test.ts` (new)
- `.github/workflows/ci.yml` — one step
- `CLAUDE.md` — the Commands table says `test | none. No runner is installed`, which stops being
  true in slice 01

## Scope

**In**
- a runner that resolves the `@core` / `@shared` aliases
- one honest unit test that fails when the code is wrong
- CI running it

**Out**
- coverage thresholds. A ratchet over one test file is theatre
- DOM / React component tests (`@testing-library`, `jsdom`). `FeatureToggle` and `Popup` are
  worth testing, but not before the registry they call is injectable
- a browser or end-to-end harness (Playwright, `chrome-launcher`). The artifact here is an
  unpacked extension and nothing is hosted; that is a separate call
- mocking `chrome.*` with a global stub. If a module needs that to be testable, the fix is the
  `store-port` pitch, not a bigger mock

## Open questions

- Does `vitest` need `environment: 'jsdom'` for slice 01? `logger.ts` only touches `console`, so
  the `node` default should hold — confirm rather than assume, since adding jsdom later is
  cheap and removing it is not.

## Done

`pnpm test` runs green locally and in CI, and a deliberately broken assertion turns the PR check
red. Success is that the next person adding a feature has somewhere to put its test.
