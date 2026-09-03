# Docs

**Partial adoption of the hexagram template vault.** Only `pitches/` and `plans/` are on disk,
because those are the two folders the board reads. The rest of the template tree
(`architecture/`, `research/`, `postmortem/`, `roadmap/`, `product/`), the `.obsidian/` config
and the `.mcp.json` Obsidian MCP server are still an open call for the owner — see
`pitches/docs-vault.md`.

| folder | |
|---|---|
| `pitches/` | what a piece of work is for, written before it is researched or built. A pitch is an **epic**: it never becomes a card, it becomes a `[label]` on its slices |
| `plans/` | one directory per feature, numbered vertical slices. **Each slice is a card** |

## The board

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/board/sync.py" docs .kanban.json Work
python3 "${CLAUDE_PLUGIN_ROOT}/skills/board/show.py" .kanban.json Work
```

The markdown decides; the board follows. `.kanban.json` is derived and gitignored — losing it
costs one command.

`status: blocked` does **not** move a card to another column; a blocked card sits where it is.
So every blocked slice here states its reason on the **first line of its body**, because that
reason does not travel to the board.

## Convention

Everything that lands in this repo is in English — docs included. See the `language` skill.
