---
status: todo
kanban: ef1e5b1a-5862-474f-874a-a1233bccec7d
---

# Slice 01 — Name the `Store` port and make the compiler check the adapter

## Delivers

A `Store` type exists and `src/core/storage.ts` is **declared** to implement it, so drift
between the two becomes a type error instead of a runtime surprise. No consumer changes; no
behaviour changes. This slice ships on its own and is invisible at runtime — that is the point,
because slice 02 is the risky one and it should start from a compiler that already agrees.

## Needs

- nothing. `src/core/storage.ts` today is four methods (`get`, `set`, `remove`, `onChanged`)
  with five `chrome.storage.sync` calls behind them
- one decision, recorded in this file when it is made: does `onChanged` belong in the port?
  `grep -rn "onChanged" src/` finds it **only** in its own definition — two lines in
  `storage.ts`, no caller anywhere. It is also the sole method whose signature leaks a `chrome`
  type (`chrome.storage.StorageChange`). Keeping it in the port means the port is not
  browser-free; dropping it means deleting an unused method
- the second decision, same rule: factory `createFeatureRegistry(store)` or a `store` parameter
  on each function. The registry holds module-level mutable state
  (`const features: Feature[] = []`) that a factory would close over — write down which and why,
  because slice 02 cannot start without it

## Tests

No test file. There is no behaviour here to assert, and a test that only re-states a type
signature is a tautology — `tsc` is the check.

1. `pnpm exec tsc --noEmit` is green with `export const storage: Store = { … }`.
2. Mutation check: rename `get` to `fetch` in `storage.ts` and re-run `tsc`. **It must fail.**
   If it passes, the annotation is missing or `Store` is structurally empty, and the slice
   delivered nothing.

## Done when

```bash
pnpm exec tsc --noEmit && grep -n "Store" src/core/storage.ts
```

Exits 0 and prints at least the `export const storage: Store` line. `tsc` green with no grep
output means the port was written but never bound to the adapter.

## If stuck

- `onChanged` will not fit a browser-free port: leave it **off** the port and on the concrete
  adapter. Nothing calls it, so the port stays honest and no caller breaks. Record the deletion
  question in the pitch rather than deleting the method in this slice.
- Generics fight you: `get<T>(key: string): Promise<T | undefined>` is the existing signature and
  it is fine — do not widen it to `unknown` and push casting onto every caller.
- The type feels like ceremony over four methods: it is, until slice 03, where it becomes the
  only reason a test can run without Chrome. Do not stop here.
