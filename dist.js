const execSync = require('child_process').execSync
const spawnSync = require('child_process').spawnSync
const fs = require('fs-extra')
const AdmZip = require('adm-zip')
const zip = new AdmZip()
const manifestPath = './src/manifest.json'
const manifest = fs.readJSONSync(manifestPath)
const semver = require('semver')

function getReleaseType(args) {
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

execSync(`git add src/manifest.json && git commit -m 'Version-${manifest.version}'`, {
  cwd: process.cwd()
})

const child = spawnSync('yarn', ['build', '--color=always'])
zip.addLocalFolder('./build')

fs.ensureDirSync('./packages')
zip.writeZip(`./packages/Version-${manifest.version}.zip`)

if (child.stdout) console.log(child.stdout.toString())
if (child.stderr) console.log(child.stderr.toString())
