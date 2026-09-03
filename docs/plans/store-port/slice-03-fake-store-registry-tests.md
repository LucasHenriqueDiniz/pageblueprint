---
status: todo
kanban: a08cfc91-0aa8-45c6-a769-87fe396832a8
---

# Slice 03 — A fake `Store`, and the registry's first real tests

## Delivers

`isFeatureEnabled` tested through **both** sides of its default-fallback branch, in a file that
never mentions `chrome`. This is what the two slices before it were for.

Today that logic —

```ts
return stored !== undefined ? stored : (feature?.defaultEnabled ?? false)
```

— is only reachable by loading the unpacked extension in a browser.

## Needs

- `test-harness` slice 01: `pnpm test` runs
- `store-port` slice 02: the registry takes a `Store`
- an in-memory `Store` over a `Map`. It is a **fake**, not a mock: it stores and returns values,
  so a test asserts on behaviour rather than on which method was called

## Tests

Each of these fails for a different reason, which is how you know they are not one test written
four times.

1. Key not in the store, `defaultEnabled: true` → `true`. Covers the fallback arm.
2. Key not in the store, `defaultEnabled` absent → `false`. Covers `?? false`.
3. Store holds `false`, `defaultEnabled: true` → `false`. **The one that matters**: an explicit
   opt-out must beat the default, and `stored !== undefined` is the only thing making that work.
   Written as `stored ?? default` it would still pass tests 1 and 2 and fail this one.
4. `setFeatureEnabled('x', true)` then `isFeatureEnabled('x')` → `true`, through the same fake.
   Also pins the key format: the fake's `Map` must hold `feature:x`, not `x`.
5. `runFeatures()` calls `run()` on an enabled feature and not on a disabled one.
6. Mutation check for test 3: change the ternary to `stored ?? (feature?.defaultEnabled ?? false)`
   and re-run. **Test 3 must fail and tests 1, 2, 4 must still pass.** If test 3 survives, the
   fake is returning `undefined` where the real store would return `false` and the test is
   proving nothing.

## Done when

```bash
! grep -qi "chrome" src/core/feature-registry.test.ts && pnpm test
```

Exits 0 and the summary reads `Test Files  2 passed (2)`. The `grep` guard is not decoration: a
registry test that reaches for a `chrome` global has re-created the coupling slice 02 removed,
and it would still be green.

## If stuck

- The registry's module-level `features` array leaks between tests (feature registered in test 1
  is still there in test 5): call `registerFeature` inside each test and reset in a
  `beforeEach` — or, if there is no reset, that is a genuine finding about the registry, so write
  it down before adding a workaround.
- `runFeatures` swallows an async error and test 5 hangs: give the fake's `get` a synchronous
  resolved promise and assert with `await`, not a timer.
- The fake starts growing options (throw on this key, delay on that one): stop. That is a mock
  wearing a fake's name. Six tests need a `Map` and nothing else.
