# Chrome Extension Boilerplate

A simple, fast, and scalable boilerplate for Chrome extensions using Manifest V3.

## Stack

- [Vite](https://vitejs.dev/)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Features

- ⚡ **Single Vite project** — no monorepo, no Turborepo complexity
- 🧩 **Feature registry system** — toggle features on/off from popup
- 🌍 **i18n ready** — English & Portuguese included
- 📦 **One-command build** — popup, options, background, content

## Quick Start

```bash
git clone <this-repo> my-extension
cd my-extension
npm install
npm run dev
```

### Build

```bash
npm run build    # production build
npm run zip      # generate Chrome Web Store zip
```

### Load in Chrome

1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `dist/` folder

## Project Structure

```
src/
  background/     → service worker
  content/        → content script
  popup/          → popup (React)
  options/        → options page (React)
  core/
    config.ts
    storage.ts
    messaging.ts
    logger.ts
    feature-registry.ts
  features/       → your features
  shared/         → hooks, UI components, utils
```

## Adding a Feature

```ts
// src/features/my-feature/index.ts
import { registerFeature } from '@core/feature-registry'

registerFeature({
  id: 'my-feature',
  name: 'My Feature',
  defaultEnabled: false,
  run: () => { /* logic */ },
  cleanup: () => { /* cleanup */ },
})
```

Features automatically appear in the popup with toggle switches.

## License

MIT
