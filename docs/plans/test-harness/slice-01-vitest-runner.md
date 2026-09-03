---
status: todo
kanban: 6a491f64-3a6a-4c7d-8e05-9007a001485a
---

# Slice 01 — Vitest runs, and one test proves it

## Delivers

`pnpm test` exists and executes a real assertion. Today the script is absent
(`package.json` scripts are `dev`, `build`, `zip`, `prepare`) and no runner is installed.

## Needs

- nothing in this repo. This is the first slice of the first feature
- ~10 min reading: does `vitest` need `environment: 'jsdom'` here? `logger.ts` touches only
  `console`, so the `node` default should hold — confirm before adding a dependency nothing uses

## Tests

The list is the definition of done.

1. `logger.error('x')` calls `console.error` with `'[My Extension]'` as its first argument —
   `config.name` is `'My Extension'` and `prefix` is built from it, so a typo in either turns
   this red.
2. `logger.error` fires **regardless** of `config.debug` — it is the one method in
   `src/core/logger.ts` with no `if (config.debug)` guard, and that asymmetry is the module's
   entire reason to exist.
3. Mutation check: change `` const prefix = `[${config.name}]` `` to `` `${config.name}` `` and
   re-run. **Test 1 must fail.** If it still passes, the assertion is checking that
   `console.error` was called and nothing more, and the test is decoration.

The `config.debug === false` branch is **not** tested here. `config.debug` is read at module
evaluation time from `import.meta.env.DEV`, so flipping it needs `vi.resetModules()` plus a
dynamic re-import — real, but not what slice 01 is for.

## Done when

```bash
pnpm test
```

Exits 0 and the summary line reads `Test Files  1 passed (1)`. `No test files found` is a
**fail**, not a pass — it means the runner installed and the include glob is wrong.

## If stuck

- Vitest cannot resolve `@core/…`: it does not read `vite.config.ts` automatically for a
  separate `vitest.config.ts`. Either merge the config into `vite.config.ts` under a `test:` key,
  or re-declare the two aliases (`@core`, `@shared`) — they are four lines, copied is fine here.
- `import.meta.env.DEV` is undefined under the runner: drop tests 1 and 2 down to
  `src/core/config.ts` and assert `config.name` alone. A trivial green test that runs beats a
  clever red one that cannot.
- Vitest 3 fights React 19 or the SWC plugin: the first test imports no React. Set
  `test.include` to `src/core/**/*.test.ts` and leave the UI out until slice 03 of `store-port`.
