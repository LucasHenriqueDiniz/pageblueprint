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
- `gh` authenticated against `LucasHenriqueDiniz/pageblueprint`, to read the conclusion of the
  `Test` step per commit

## Tests

1. The workflow file has a `Test` step running `pnpm run test`, after `Build`.
2. **The gate actually gates.** Push a commit that breaks one assertion on purpose and confirm
   the `Test` step's own conclusion is `failure`. A step present but never observed failing is
   not a gate, it is a decoration — this is the only test in this slice that proves anything.
3. Revert the break; on the next run the `Test` step is `success`.
4. The step runs on `pull_request` as well as `push`, since that is where a merge is stopped.

## Done when

```bash
BROKEN=<sha of the deliberately-broken commit from test 2>

run_step() { gh run view "$(gh run list --workflow ci.yml --commit "$1" --limit 1 \
  --json databaseId --jq '.[0].databaseId')" --json jobs \
  --jq '[.jobs[].steps[] | select(.name == "Test") | .conclusion] | .[0] // "STEP ABSENT"'; }

red=$(run_step "$BROKEN"); green=$(run_step "$(git rev-parse HEAD)")
grep -nE 'run: pnpm run test' .github/workflows/ci.yml
echo "broken ${BROKEN:0:7} Test -> $red"
echo "fixed  $(git rev-parse --short HEAD) Test -> $green"
[ "$red" = failure ] && [ "$green" = success ]
```

Exits 0, having printed the workflow line that runs the tests plus both conclusions — the one
test 2 asks for and the one test 3 asks for:

```
NN:        run: pnpm run test
broken 1a2b3c4 Test -> failure
fixed  5d6e7f8 Test -> success
```

Both observations come out of a single run of the block on purpose. The claim is a step that goes
red on a bad assertion and green on a good one; neither half alone is that claim.

Every anchor here is load-bearing:

- `--commit "$sha"`, not `--branch … --limit 1`. The branch form reads whichever run happened
  last, so its output is **identical before and after the test step exists**: today, against a
  `ci.yml` whose only step is `pnpm run build`, it already prints `success` and exits 0. A gate
  that cannot tell the finished slice from the untouched repo measures nothing.
- the conclusion of the step named `Test`, not the conclusion of the run. A run-level `failure` is
  equally what a broken build, a stale lockfile or a runner timeout look like. Test 2 is about the
  assertion, so the gate reads the step that ran the assertion.
- `// "STEP ABSENT"`. With no `Test` step the jq array comes back empty, and an empty result would
  print a blank line and still exit 0 — silence reading as success. `STEP ABSENT` is a **fail**.
- `grep -nE`, not `grep -q`. Printing the matched line and its number shows the step actually
  invokes `pnpm run test`, rather than only that the file mentions `Test` somewhere.

Run today, the `grep` prints nothing, both conclusions come back `STEP ABSENT`, and the block
exits 1.

## If stuck

- `gh` is not authenticated or the repo is private in a way that blocks the API: open each run
  in the PR checks and read the `Test` step's own conclusion there instead, then record both
  observed conclusions in the PR description. The evidence is the point, not the command.
- The test step passes because there are no tests: add `--passWithNoTests=false` (it is the
  Vitest default, but making it explicit costs nothing and documents the intent).
- CI is slow enough to be annoying: do **not** solve it by dropping the step. `pnpm build` is
  already three vite builds plus `tsc`; one vitest run over one file is not the cost.
