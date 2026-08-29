# Chrome Extension Boilerplate

Global context for OpenCode when working in this repository.

## Stack

- Vite
- React 19 (popup/options/changelog UI)
- TypeScript
- Tailwind CSS
- Chrome Manifest V3

## Architecture

Single project layout (no monorepo):

```
src/
  background/      # service worker
  content/         # content script entry
  popup/           # popup React app
  options/         # options React app
  changelog/       # changelog React app (optional)
  core/            # shared extension primitives
    config.ts
    storage.ts
    messaging.ts
    logger.ts
    feature-registry.ts
  features/        # each feature is isolated
  shared/          # reusable hooks/ui/utils
```

## Feature System

Every extension behavior should be a registered feature:

```ts
import { registerFeature } from '@core/feature-registry'

registerFeature({
  id: 'my-feature',
  name: 'My Feature',
  description: 'What it does',
  defaultEnabled: false,
  run: () => {},
  cleanup: () => {},
})
```

- Feature flags are stored in `chrome.storage.sync`
- Popup reads registered features and renders toggles automatically
- Content scripts should check `isFeatureEnabled(id)` before running logic

## Aliases

- `@core/*` -> `src/core/*`
- `@shared/*` -> `src/shared/*`

## CLI

Create extension projects from this boilerplate:

```bash
npm run create-extension -- <name> --description "..." --feature <feature-id>
```

Default output directory is:

- `<current-working-directory>\<name>`

Optional override:

```bash
npm run create-extension -- <name> --out "E:\Some\Other\Folder"
```

Useful flags:

- `--no-popup`
- `--options`
- `--no-content`
- `--no-background`
- `--no-changelog`

## Build

- `npm run dev`
- `npm run build`
- `npm run zip`

Build configs:

- `vite.config.ts` (popup/options/changelog)
- `vite.background.config.ts`
- `vite.content.config.ts`

## OpenCode Rules

- Use aliases (`@core`, `@shared`) instead of deep relative paths
- Prefer `registerFeature` over adding ad-hoc logic in entries
- Use `@core/logger` instead of raw `console.log`
- Use `@core/storage` instead of raw `chrome.storage`
- Keep user-facing text in `_locales/*/messages.json`
- Validate with `npm run build` after meaningful changes
