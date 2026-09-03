---
status: todo
kanban: 7be7e187-2d5b-42d0-b037-2a93fb093c04
---

# Slice 02 — CI can go red on a test

## Delivers

A failing test blocks a pull request. Today `.github/workflows/ci.yml` has one job with one
gate — `pnpm run build` — and its own comment says so:

> "This repo is a Chrome extension boilerplate and exposes no lint or standalone typecheck
> script - the build (vite + tsc per bundle) is the only gate there is. If either script is
> added, it goes here."

Slice 01 adds the script. This slice honours that comment.

## Needs

- `test-harness` slice 01: `pnpm test` exists and passes locally
- `gh` authenticated against `LucasHenriqueDiniz/pageblueprint`, to read the run conclusion

## Tests

1. The workflow file has a `Test` step running `pnpm run test`, after `Build`.
2. **The gate actually gates.** Push a commit that breaks one assertion on purpose and confirm
   the run conclusion is `failure`. A step that is present but never observed failing is not a
   gate, it is a decoration — this is the only test in this slice that proves anything.
3. Revert the break; the next run is `success`.
4. The step runs on `pull_request` as well as `push`, since that is where a merge is stopped.

## Done when

```bash
gh run list --workflow ci.yml --branch "$(git rev-parse --abbrev-ref HEAD)" --limit 1 --json conclusion --jq '.[0].conclusion'
```

Prints `success`, and the same command run on the deliberately-broken commit from test 2 printed
`failure`. One of those two outputs alone proves nothing.

## If stuck

- `gh` is not authenticated or the repo is private in a way that blocks the API: read the
  conclusion from the PR checks in the browser instead, and record both observed conclusions in
  the PR description. The evidence is the point, not the command.
- The test step passes because there are no tests: add `--passWithNoTests=false` (it is the
  Vitest default, but making it explicit costs nothing and documents the intent).
- CI is slow enough to be annoying: do **not** solve it by dropping the step. `pnpm build` is
  already three vite builds plus `tsc`; one vitest run over one file is not the cost.
