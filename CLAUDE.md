# CLAUDE.md

## Project

pageblueprint. A Manifest V3 Chrome extension boilerplate: single Vite project, React 19, TypeScript, Tailwind. Private repo, no host and nothing deployed - the build exists to produce the unpacked extension and the Web Store zip.

## House style

This repo follows the `hexagram` plugin. **The rules are not copied here**, which is the point: they
live in one place and every repo picks up the same version.

| skill | when it applies |
|---|---|
| `architecture` | where a file goes, whether a dependency needs a port, how a use case gets its dependencies |
| `naming` | what a thing is called, and where it lives |
| `language` | anything that lands in the repo. Everything is English |
| `testing` | what to test at which layer, and whether a test proves what its name claims |
| `clean-code` | naming, function and file size, error handling |
| `diagrams` | architecture diagrams, C4, Excalidraw in the vault |
| `workflow` | pitch → research → decision → plan → implement → postmortem |
| `git` | committing, branching, submodule ordering, rewriting history |
| `pitch` | `/hexagram:pitch` — the document that opens a piece of work |
| `setup-machine` | the plugin set this house installs, and which MCP servers are worth keeping |
| `research` | a decision depends on something you do not know yet |
| `postmortem` | something shipped, or a claim turned out wrong |
| `lint` | format, lint and type checks, stack detected not configured |
| `terraform` | infrastructure, which does **not** use the hexagon |

Canonical architecture spec: <https://imgabriel.dev/architecture/>.

### Two rules that always apply

A skill loads when the task matches it. These two match everything, so they are stated here instead:

- **Everything that lands in this repo is in English.** Code, comments, docstrings, test names, docs,
  commit messages, branch names, resource names. The `language` skill has the exceptions and the
  quote-versus-literal test.
- **No commit carries AI attribution.** No `Co-Authored-By: … Claude`, no "Generated with". The
  `.githooks/commit-msg` hook strips it from every commit written here; this line is why. A human
  co-author is untouched.

  ⚠️ **The hook does not run on replayed commits.** `git cherry-pick`, a plain `git rebase` pick,
  `git am` and `git revert --edit` all bypass `commit-msg` — git's sequencer never consults it. A
  trailer that arrives from a branch, a patch or a PR made before the hook existed lands verbatim.
  Check an imported range by hand:
  `git log --format=%B <range> | grep -iE 'anthropic\.com|Generated with \[Claude'`

**What is true of THIS project** normally goes in `docs/architecture/ARCHITECTURE.md`. That vault is
**not on disk here** - adopting `docs/` and the Obsidian MCP is still an open call for the owner, and
`.mcp.json` is deliberately absent so the MCP does not start against a directory that does not exist.
Until that call is made, project truth lives in this file and in `README.md`.

## Structure

```
.claude/
  settings.json   # hooks and statusline
  statusline.sh
.githooks/
  commit-msg      # strips AI attribution. Wired by `git config core.hooksPath .githooks`
```

The source layout is in `README.md` under Project Structure.

## Commands

pnpm is the package manager, pinned by the `packageManager` field; Node is pinned by `.nvmrc`.

| | |
|---|---|
| dev | `pnpm dev` |
| build | `pnpm build` - `tsc` plus three vite builds (popup/options, background, content) |
| package | `pnpm zip` - writes `dist-zip/extension-<date>.zip`, needs `pnpm build` first |
| test | none. No runner is installed |
| lint | no script and no formatter. The inert `.prettierrc` was removed; prettier was never a dependency |
| deploy | none. Nothing here is hosted; the artifact is the unpacked `dist/` or the zip |

`.github/workflows/ci.yml` runs `pnpm build` and nothing else, so CI catches only what the compiler
catches - no style, language or layer gate.
