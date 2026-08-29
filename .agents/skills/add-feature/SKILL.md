# Skill: add-feature

Adds a new feature module to an existing extension.

## Structure

```
src/features/<feature-id>/
  index.ts      # registerFeature(...)
  content.ts    # optional DOM/content logic
```

## Steps

1. Create `src/features/<feature-id>/index.ts`
2. Register feature with `registerFeature`
3. Import it in `src/features/index.ts`
4. If needed, initialize content logic from `src/content/index.ts`
5. Run `npm run build`

## Conventions

- Feature id: kebab-case
- Use `@core/logger` for logs
- Use `@core/storage` for settings
- Gate content logic behind `isFeatureEnabled('<feature-id>')`
