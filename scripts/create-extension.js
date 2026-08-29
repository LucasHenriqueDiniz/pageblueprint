#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import readline from 'readline'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function parseArgs() {
  const args = process.argv.slice(2)
  const result = {
    name: '',
    description: '',
    version: '1.0.0',
    popup: true,
    options: false,
    content: true,
    background: true,
    changelog: true,
    out: '',
    feature: '',
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const next = args[i + 1]
      if (next && !next.startsWith('--')) {
        result[key] = next
        i++
      } else if (key.startsWith('no-')) {
        result[key.slice(3)] = false
      } else {
        result[key] = true
      }
    } else if (!result.name) {
      result.name = arg
    }
  }

  return result
}

function resolveOutputRoot(outArg) {
  if (outArg && String(outArg).trim()) {
    return path.resolve(String(outArg).trim())
  }

  return process.cwd()
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()))
  })
}

function askYesNo(question, defaultValue = false) {
  const suffix = defaultValue ? ' (Y/n)' : ' (y/N)'
  return new Promise((resolve) => {
    rl.question(question + suffix + ' ', (answer) => {
      const a = answer.trim().toLowerCase()
      if (!a) return resolve(defaultValue)
      resolve(a === 'y' || a === 'yes')
    })
  })
}

function kebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

function pascalCase(str) {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^./, (c) => c.toUpperCase())
}

async function main() {
  console.log('\n🧩 Chrome Extension Boilerplate — Create Extension\n')

  const args = parseArgs()
  let extensionName = args.name

  if (!extensionName) {
    extensionName = await ask('Extension name (e.g. youtube-ad-skipper): ')
  }

  if (!extensionName) {
    console.error('❌ Extension name is required')
    process.exit(1)
  }

  const kebabName = kebabCase(extensionName)
  const pascalName = pascalCase(kebabName)
  const outputRoot = resolveOutputRoot(args.out)
  const targetDir = path.join(outputRoot, kebabName)

  if (!args.out) {
    console.log('ℹ️  No --out provided. Using current directory as output root:')
    console.log(`   ${outputRoot}\n`)
  }

  if (!fs.existsSync(outputRoot)) {
    console.error(`❌ Output root does not exist: ${outputRoot}`)
    console.error('Use --out "<path>" to set a valid output directory.')
    process.exit(1)
  }

  if (fs.existsSync(targetDir)) {
    console.error(`❌ Directory "${kebabName}" already exists`)
    process.exit(1)
  }

  const description = args.description || (await ask('Description: '))
  const version = args.version || (await ask('Version (1.0.0): ')) || '1.0.0'

  console.log('\n📦 Select surfaces (pages/scripts):')
  const hasPopup = args.popup ?? (await askYesNo('  Include popup?', true))
  const hasOptions = args.options ?? (await askYesNo('  Include options page?', false))
  const hasContent = args.content ?? (await askYesNo('  Include content script?', true))
  const hasBackground = args.background ?? (await askYesNo('  Include background script?', true))

  console.log('\n📜 Include changelog page?')
  const hasChangelog = args.changelog ?? (await askYesNo('  Include changelog?', true))

  console.log('\n✨ Create initial feature?')
  const createFeature = args.feature
    ? true
    : await askYesNo('  Create a starter feature?', true)
  let featureName = args.feature
  if (createFeature && !featureName) {
    featureName = await ask('  Feature name (e.g. auto-skip): ')
    if (!featureName) featureName = 'starter-feature'
  }

  console.log('\n🔨 Generating extension...\n')

  // 1. Copy boilerplate
  const boilerplateDir = path.resolve(__dirname, '..')
  copyDir(boilerplateDir, targetDir, ['node_modules', 'dist', 'dist-zip', '.git', kebabName])

  // 2. Replace placeholders in key files
  const replacements = {
    'chrome-extension-boilerplate-react-vite': kebabName,
    'My Extension': pascalName,
    'A simple Chrome extension boilerplate': description || `A Chrome extension: ${pascalName}`,
    '1.0.0': version,
  }

  replaceInFile(path.join(targetDir, 'package.json'), replacements)
  replaceInFile(path.join(targetDir, 'src', 'core', 'config.ts'), replacements)
  replaceInFile(path.join(targetDir, 'public', '_locales', 'en', 'messages.json'), replacements)
  replaceInFile(path.join(targetDir, 'public', '_locales', 'pt', 'messages.json'), {
    'My Extension': pascalName,
    'A simple Chrome extension boilerplate': description || `Uma extensão Chrome: ${pascalName}`,
  })

  // 3. Adjust surfaces
  adjustSurfaces(targetDir, { hasPopup, hasOptions, hasContent, hasBackground, hasChangelog })

  // 4. Create feature
  if (createFeature && featureName) {
    createFeatureFiles(targetDir, featureName)
  }

  console.log(`✅ Extension "${kebabName}" created successfully!\n`)
  console.log(`Location: ${targetDir}\n`)
  console.log(`Next steps:`)
  console.log(`  cd "${targetDir}"`)
  console.log(`  npm install`)
  console.log(`  npm run dev`)
  console.log(`\nLoad "dist/" folder in chrome://extensions/ (Developer mode)`)

  rl.close()
}

function copyDir(src, dest, exclude = []) {
  fs.mkdirSync(dest, { recursive: true })
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (exclude.some((ex) => srcPath.includes(ex))) continue
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, exclude)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return
  let content = fs.readFileSync(filePath, 'utf-8')
  for (const [oldStr, newStr] of Object.entries(replacements)) {
    content = content.split(oldStr).join(newStr)
  }
  fs.writeFileSync(filePath, content, 'utf-8')
}

function adjustSurfaces(targetDir, surfaces) {
  const manifestPath = path.join(targetDir, 'public', 'manifest.json')
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))

  if (!surfaces.hasPopup) {
    delete manifest.action
  }
  if (!surfaces.hasBackground) {
    delete manifest.background
  }
  if (!surfaces.hasContent) {
    delete manifest.content_scripts
  } else {
    manifest.content_scripts = [
      {
        matches: ['<all_urls>'],
        js: ['content/content.js'],
      },
    ]
  }
  if (!surfaces.hasOptions) {
    delete manifest.options_page
  }
  if (!surfaces.hasChangelog) {
    delete manifest.web_accessible_resources
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8')

  // Adjust vite.config.ts
  const vitePath = path.join(targetDir, 'vite.config.ts')
  if (!surfaces.hasChangelog && fs.existsSync(vitePath)) {
    let content = fs.readFileSync(vitePath, 'utf-8')
    content = content.replace("changelog: resolve(__dirname, 'changelog.html'),\n", '')
    fs.writeFileSync(vitePath, content, 'utf-8')
  }

  // Remove changelog files
  if (!surfaces.hasChangelog) {
    const filesToRemove = [
      path.join(targetDir, 'changelog.html'),
      path.join(targetDir, 'src', 'changelog', 'App.tsx'),
      path.join(targetDir, 'src', 'changelog', 'main.tsx'),
      path.join(targetDir, 'src', 'changelog', 'index.css'),
    ]
    for (const f of filesToRemove) {
      if (fs.existsSync(f)) fs.unlinkSync(f)
    }
    const changelogDir = path.join(targetDir, 'src', 'changelog')
    if (fs.existsSync(changelogDir)) fs.rmdirSync(changelogDir)

    // Remove changelog link from popup
    const popupPath = path.join(targetDir, 'src', 'popup', 'App.tsx')
    if (fs.existsSync(popupPath)) {
      let popupContent = fs.readFileSync(popupPath, 'utf-8')
      popupContent = popupContent.replace(
        /\n      <div className="mt-4[^]*?<\/div>\n/,
        '\n'
      )
      fs.writeFileSync(popupPath, popupContent, 'utf-8')
    }
  }
}

function createFeatureFiles(targetDir, featureName) {
  const featuresDir = path.join(targetDir, 'src', 'features', featureName)
  fs.mkdirSync(featuresDir, { recursive: true })

  const pascalFeature = pascalCase(featureName)

  fs.writeFileSync(
    path.join(featuresDir, 'index.ts'),
    `import { registerFeature } from '@core/feature-registry'
import { logger } from '@core/logger'

registerFeature({
  id: '${featureName}',
  name: '${pascalFeature}',
  description: 'Feature description here',
  defaultEnabled: false,
  run: () => {
    logger.log('${pascalFeature} is running')
  },
  cleanup: () => {
    logger.log('${pascalFeature} is cleaning up')
  },
})
`,
    'utf-8'
  )

  fs.writeFileSync(
    path.join(featuresDir, 'content.ts'),
    `import { logger } from '@core/logger'

export function init${pascalFeature}() {
  logger.log('${pascalFeature} content script initialized')

  // Your DOM manipulation logic here
}
`,
    'utf-8'
  )

  // Update features/index.ts
  const featuresIndex = path.join(targetDir, 'src', 'features', 'index.ts')
  fs.writeFileSync(
    featuresIndex,
    `// Import all features to register them\nimport './example-feature'\nimport './${featureName}'\n`,
    'utf-8'
  )

  // Update content/index.ts to init the feature
  const contentIndex = path.join(targetDir, 'src', 'content', 'index.ts')
  fs.writeFileSync(
    contentIndex,
    `import '../features'
import { init${pascalFeature} } from '../features/${featureName}/content'
import { isFeatureEnabled } from '@core/feature-registry'

const run = async () => {
  const enabled = await isFeatureEnabled('${featureName}')
  if (enabled) {
    init${pascalFeature}()
  }
}

run()
`,
    'utf-8'
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
