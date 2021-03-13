import path from 'path'
import { spawn } from 'child_process'
import { rmdirSync } from 'fs'
import chokidar from 'chokidar'

const dirOfInterest = path.join(path.resolve(), 'src')

function performBuild () {
  try {
    rmdirSync('./build', { recursive: true })
    console.clear()

    const child = spawn('yarn', ['build', '--color'])
    child.stdout.on('data', function (data) {
      process.stdout.write(data.toString())
    })
    child.stderr.on('data', function (data) {
      process.stdout.write(data.toString())
    })
  } catch (error) {
    console.error(error)
  }
}

function watch () {
  performBuild()

  const watcher = chokidar.watch(dirOfInterest, {
    ignored: '**/*.html',
    ignoreInitial: true,
    persistent: true,
    followSymlinks: true,
    interval: 100,
    awaitWriteFinish: {
      stabilityThreshold: 2000,
      pollInterval: 100
    }
  })

  watcher
    .on('add', function (path) {
      performBuild()
    })
    .on('change', function (path) {
      performBuild()
    })
    .on('unlink', function (path) {
      performBuild()
    })
    .on('error', error => console.log(`Watcher error: ${error}`))

  return watcher
}

watch()
