---
status: todo
kanban: a1fed342-d77c-4cea-ba11-08553d9bb47e
---

# Slice 01 — Make `CLAUDE.md` describe the `docs/` that now exists

## Delivers

`CLAUDE.md` stops contradicting the repo. It currently says:

> "That vault is **not on disk here** - adopting `docs/` and the Obsidian MCP is still an open
> call for the owner, and `.mcp.json` is deliberately absent so the MCP does not start against a
> directory that does not exist."

Half of that is now false. `docs/` exists with `pitches/` and `plans/`; `.mcp.json` and the
other five template folders still do not. The second half of the sentence is still exactly
right and must survive the edit.

## Needs

- nothing. This is bookkeeping over one paragraph and one tree, and it does **not** wait on the
  adoption decision in slice 02 — describing what is on disk is true regardless of how that goes

## Tests

1. The paragraph says `docs/` holds `pitches/` and `plans/` for the board, and that the full
   template vault plus `.mcp.json` are still an open call.
2. The `## Structure` tree lists `docs/`.
3. The `## Commands` table's `test` row — `none. No runner is installed` — is **left alone**.
   It is still true, and `test-harness` slice 01 owns changing it. Two slices editing the same
   table is how a conflict gets manufactured.
4. Nothing outside `CLAUDE.md` and `docs/` is touched.

## Done when

```bash
! grep -q "not on disk here" CLAUDE.md && grep -n "docs/pitches\|docs/plans\|pitches/" CLAUDE.md
```

Exits 0 and prints at least one `CLAUDE.md` line naming the folders that exist.

## If stuck

- The wording keeps drifting into re-explaining the whole board: it does not belong here.
  `CLAUDE.md` gets two sentences and a pointer to `docs/README.md`.
- Uncertain whether the vault stays partial: that uncertainty is the honest state and should be
  written as such. Do not wait for slice 02 to unblock — a paragraph saying "partial, decision
  open" is accurate today and stays accurate until the decision lands.
