# Skill: generate-store-assets

Generates the checklist and copy needed for Chrome Web Store submission.

## Required assets

1. Short description (max 132 chars)
2. Full description (features, privacy, permissions)
3. 1–5 screenshots (1280x800 or 640x400)
4. Icon set (at least 128x128)
5. Optional promo images/video

## Recommended description template

```
<Extension Name> helps you <main value>.

Key features:
- <feature 1>
- <feature 2>
- <feature 3>

Privacy:
No personal data is collected. Settings are stored locally.

Permissions:
- <permission>: <why it is needed>
```

## Final checklist

- `npm run build` passes
- `npm run zip` generated upload file
- Store copy is written in English
- Permission justifications are explicit
