---
status: blocked
kanban: bbb0836a-a38d-4e09-9444-77be47daf029
---

# Slice 02 — Decide: full template vault and Obsidian MCP, or stay partial

**BLOCKED — this is the owner's call, not a technical unknown.** Nobody but the repo owner can
decide whether a nine-commit boilerplate carries the full seven-folder hexagram vault and a
second MCP server per session. `CLAUDE.md` already records it as "an open call for the owner".
Guessing would mean either writing five empty folders nobody asked for, or quietly closing a
question the owner deliberately left open. The board does **not** carry this reason — a blocked
card stays in whatever column it sits in — which is why it is on the first line here.

## Delivers

The question stops being implicit. Either `.mcp.json` is in the repo and the Obsidian MCP starts
cleanly against `docs/`, or `CLAUDE.md` records that the vault stays at `pitches/` + `plans/`
and why. Both outcomes are a delivery; only leaving it unanswered is not.

## Needs

- **the owner's decision.** That is the block
- `docs-vault` slice 01, so the paragraph being edited already matches the repo
- if the answer is adopt: ~15 min verifying `@bitbonsai/mcpvault@0.16.0` actually starts against
  a `docs/` that has no `.obsidian/` folder. **Not verified today** — the template ships that
  pin and this repo has never run it
- if the answer is adopt: a second look at whether two MCP servers over the same folder is
  wanted, since `kanban-mcp` over `.kanban.json` already gives an agent a way in

## Tests

**If adopted:**
1. `.mcp.json` is at the repo root with the template's server definition.
2. Open a fresh session in this repo; the `obsidian` server reports Connected, not a startup
   error. A server that fails on open is the exact failure this slice exists to prevent.
3. A `[[wiki-link]]` between two files in `docs/` resolves through the server.
4. Whichever template folders are adopted have a `README.md` — an empty folder is a stub, not a
   vault.

**If declined:**
1. `CLAUDE.md` states the decision and its reason in one or two sentences.
2. `.mcp.json` is still absent, and that absence is now deliberate and documented rather than
   pending.

## Done when

```bash
claude mcp list 2>&1 | grep -i obsidian || grep -in "vault" CLAUDE.md
```

Exits 0, printing **either** an `obsidian: … - Connected` line (adopted) **or** the `CLAUDE.md`
line recording the refusal (declined). Two blank outputs and a non-zero exit means the decision
still has not landed anywhere a reader can find it.

## If stuck

- `claude mcp list` cannot be run non-interactively: run
  `npx -y @bitbonsai/mcpvault@0.16.0 ./docs` directly and check it stays up instead of exiting
  immediately, then fall back to the `grep` half of the command for the record.
- `0.16.0` is stale or the package moved: that is a research question, not a decision one — do
  not silently bump the pin inside this slice. Park it and say so.
- The owner does not want to decide right now: that is a legitimate answer. Record "parked, no
  vault beyond pitches and plans, revisit when `docs/` outgrows two folders" in `CLAUDE.md` and
  take the block off. An explicit park is done; an implicit one is this card.
