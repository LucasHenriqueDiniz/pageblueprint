import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { zipSync } from 'fflate'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const distPath = path.resolve(__dirname, '../dist')
const zipPath = path.resolve(__dirname, '../dist-zip')

if (!fs.existsSync(distPath)) {
  console.error('Dist folder not found. Run npm run build first.')
  process.exit(1)
}

const files = {}

function readDir(dir, basePath = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    const relativePath = path.join(basePath, entry.name)
    if (entry.isDirectory()) {
      readDir(fullPath, relativePath)
    } else {
      files[relativePath] = fs.readFileSync(fullPath)
    }
  }
}

readDir(distPath)

const zipped = zipSync(files, { level: 9 })

if (!fs.existsSync(zipPath)) {
  fs.mkdirSync(zipPath, { recursive: true })
}

const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
const outputFile = path.join(zipPath, `extension-${date}.zip`)
fs.writeFileSync(outputFile, zipped)

console.log(`Zipped to ${outputFile}`)
