# Skill: create-extension

Creates a new extension from this boilerplate using the local CLI.

## Usage

```bash
npm run create-extension -- <name> --description "..." --feature <feature-id>
```

Default output directory:

- `<current-working-directory>\<name>`

If `--out` is not provided, the CLI prints a notice and creates the project in the current directory.

Override output directory:

```bash
npm run create-extension -- <name> --out "E:\Some\Folder"
```

Useful flags:

- `--version 1.0.0`
- `--no-popup`
- `--options`
- `--no-content`
- `--no-background`
- `--no-changelog`

## What the CLI does

1. Copies the boilerplate to the target folder
2. Replaces project placeholders (name, description, version)
3. Adjusts manifest/surfaces from selected flags
4. Creates an initial feature module if requested

## Post-create checklist

```bash
cd "E:\Repositories\<name>"
npm install
npm run build
```

Then load `dist/` in `chrome://extensions`.
