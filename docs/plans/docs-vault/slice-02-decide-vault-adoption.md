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
cleanly against `docs/`, or `CLAUDE.md` carries a line beginning `**Vault decision:**` that says
the vault stays at `pitches/` + `plans/` and why. Both outcomes are a delivery; only leaving it
unanswered is not.

That marker is not decoration. `CLAUDE.md` already contains the word *vault* twice — the
`diagrams` row of the skills table, and the paragraph that says the vault is **not** on disk — so
any gate that greps for `vault` passes today, before anything has been decided. The decision needs
a string that only a decision can produce.

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
1. `CLAUDE.md` states the decision and its reason in one or two sentences, on a line that
   **starts** with `**Vault decision:**`. Prose elsewhere in the file about a vault is not the
   decision and must not be mistaken for it.
2. `.mcp.json` is still absent, and that absence is now deliberate and documented rather than
   pending.

## Done when

```bash
claude mcp list 2>&1 | grep -E '^obsidian: .*Connected' \
  || grep -n '^\*\*Vault decision:\*\*' CLAUDE.md
```

Exits 0, printing **either** the `obsidian: … - ✔ Connected` line (adopted) **or** the
`CLAUDE.md` line recording the refusal (declined). Two blank outputs and a non-zero exit means
the decision still has not landed anywhere a reader can find it.

Both halves are anchored on purpose:

- `^obsidian: .*Connected` and not `-i obsidian`, so a server that is listed but reports
  `✘ failed to connect` does not count as adopted — a startup failure is the exact outcome test 2
  exists to catch.
- `^\*\*Vault decision:\*\*` and not `-in vault`, because a bare `vault` grep matches the two
  lines that were already in `CLAUDE.md` before this slice existed and would pass on an untouched
  repo.

Run today, on a repo where nothing has been decided, it prints nothing and exits 1.

## If stuck

- `claude mcp list` cannot be run non-interactively: run
  `npx -y @bitbonsai/mcpvault@0.16.0 ./docs` directly and check it stays up instead of exiting
  immediately, then record the adopt outcome in `CLAUDE.md` under the same
  `**Vault decision:**` marker so the second half of the gate still closes the card.
- `0.16.0` is stale or the package moved: that is a research question, not a decision one — do
  not silently bump the pin inside this slice. Park it and say so.
- The owner does not want to decide right now: that is a legitimate answer, and it still has to
  be written on a `**Vault decision:**` line in `CLAUDE.md` — "parked, no vault beyond pitches
  and plans, revisit when `docs/` outgrows two folders" — before the block comes off. An explicit
  park is done; an implicit one is this card.
