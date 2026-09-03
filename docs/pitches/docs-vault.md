---
status: active
epic: vault
---

# The template vault and `.mcp.json`: decide, then stop half-owning it

## Problem

The hexagram template ships a `.mcp.json` at the repo root:

```json
{ "mcpServers": { "obsidian": {
    "command": "npx",
    "args": ["-y", "@bitbonsai/mcpvault@0.16.0", "./docs"] } } }
```

It points an MCP server at `./docs`. Until this branch, `docs/` did not exist here — so applying
the template's `.mcp.json` unchanged would have started a server against a missing directory on
**every session open**, which is a failure you see every day and fix never.

That is why `CLAUDE.md` says the vault is deliberately absent:

> "That vault is **not on disk here** - adopting `docs/` and the Obsidian MCP is still an open
> call for the owner, and `.mcp.json` is deliberately absent so the MCP does not start against a
> directory that does not exist."

**This branch makes half of that sentence stale.** `docs/` now exists, with `pitches/` and
`plans/`, because the board reads those two folders and nothing else. The template's other five
folders (`architecture/`, `research/`, `postmortem/`, `roadmap/`, `product/`), its `.obsidian/`
config and `.mcp.json` are still not here.

So the repo is now in the one state nobody chose: a partial vault, described by a `CLAUDE.md`
paragraph that says there is no vault.

## Solution

Two moves, and they are different kinds of thing.

The first is bookkeeping and can be done immediately: make `CLAUDE.md` describe what is actually
on disk.

The second is **the owner's call and nobody else's** — adopt the full template tree plus the
Obsidian MCP, or stay at pitches-and-plans permanently. It is not a technical unknown; it is a
question about how much of a vault a nine-commit boilerplate repo wants to carry. Guessing at it
and writing five empty folders would be exactly the "apply the template because it is there"
move this pitch exists to avoid.

## Surface

- `CLAUDE.md` — the paragraph quoted above, and the `## Structure` tree
- `docs/README.md` — says which half is adopted
- `.mcp.json` (does not exist), `docs/.obsidian/` (does not exist)

## Scope

**In**
- making the repo's own docs match the repo
- putting the adoption decision somewhere it can be picked up, with the two outcomes written down

**Out**
- creating empty folders "for later". An empty `research/` is not a vault, it is five stubs
- pinning or upgrading `@bitbonsai/mcpvault`. The template pins `0.16.0`; whether that is
  current is a question for the day the decision goes the adopt way
- anything under `src/`. Nothing here touches the extension

## Open questions

- **Is `@bitbonsai/mcpvault@0.16.0` happy with a vault holding only `pitches/` and `plans/`, and
  no `.obsidian/`?** Not verified. Verifying it means actually running the server, which is what
  the adopt-path slice does first rather than last.
- Does the owner want the MCP at all, given the board already gives an agent a way in
  (`kanban-mcp` over `.kanban.json`)? Two MCP servers over the same folder is a real cost per
  session.

## Done

`grep "not on disk here" CLAUDE.md` finds nothing, and the vault question is either answered in
the repo or explicitly parked — not left implicit in a stale paragraph.
