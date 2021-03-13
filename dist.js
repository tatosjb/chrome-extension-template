import { execSync, spawnSync } from 'child_process'

import fs from 'fs-extra'
import AdmZip from 'adm-zip'
import semver from 'semver'
const zip = new AdmZip()
const manifestPath = './src/manifest.json'
const manifest = fs.readJSONSync(manifestPath)

function getReleaseType (args) {
  if (args.includes('patch')) return 'patch'
  if (args.includes('minor')) return 'minor'
  if (args.includes('major')) return 'major'
}

if (!process.argv.some(arg => ['patch', 'minor', 'major'].includes(arg))) {
  throw new Error('You must inform patch, minor or major to generate the version')
}

const releaseType = getReleaseType(process.argv)
manifest.version = semver.inc(manifest.version, releaseType)

console.log('Generating version', manifest.version)
fs.writeFileSync(manifestPath, Buffer.from(JSON.stringify(manifest, null, 2)))

if(process.env.BUILD_ENV !== 'CI'){
  execSync(`git add src/manifest.json && git commit -m 'Version-${manifest.version}'`, {
    cwd: process.cwd()
  })
}

const child = spawnSync('yarn', ['build', '--color'])
zip.addLocalFolder('./build')

fs.ensureDirSync('./packages')
zip.writeZip(`./packages/Version-${manifest.version}.zip`)

if (child.stdout) console.log(child.stdout.toString())
if (child.stderr) console.log(child.stderr.toString())
