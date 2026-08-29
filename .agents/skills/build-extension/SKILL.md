# Skill: build-extension

Builds and packages the extension for local testing or Chrome Web Store upload.

## Commands

```bash
npm run dev
npm run build
npm run zip
```

## Output

- `dist/` → load unpacked in Chrome
- `dist-zip/extension-YYYYMMDD.zip` → upload artifact

## Local test

1. Open `chrome://extensions/`
2. Enable Developer mode
3. Click Load unpacked
4. Select `dist/`
