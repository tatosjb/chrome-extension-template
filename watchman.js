const watchman = require('fb-watchman')
const path = require('path')
const spawn = require('child_process').spawn
const rmdirSync = require('fs').rmdirSync
const client = new watchman.Client()

const dirOfInterest = path.join(__dirname, 'src')

function makeSubscription(client, watch, relativePath) {
  const sub = {
    expression: ['allof', ['match', '*.*']],
    fields: ['name', 'size', 'mtime_ms', 'exists', 'type'],
  }

  if (relativePath) {
    sub.relative_root = relativePath
  }

  client.command(['subscribe', watch, 'mysubscription', sub], function (error, resp) {
    if (error) {
      console.error('failed to subscribe: ', error)
      return
    }
    console.log('subscription ' + resp.subscribe + ' established')
  })

  client.on('subscription', function (resp) {
    try {
      rmdirSync('./build', { recursive: true })
      console.clear()
      if (resp.subscription !== 'mysubscription') return

      const child = spawn('yarn', ['build', '--color=always'])
      child.stdout.on('data', function (data) {
        process.stdout.write(data.toString())
      })
      child.stderr.on('data', function (data) {
        process.stdout.write(data.toString())
      })
    } catch (error) {
      console.error(error)
    }
  })
}

client.capabilityCheck({ optional: [], required: ['relative_root'] }, function (error, resp) {
  if (error) {
    console.log(error)
    client.end()
    return
  }

  client.command(['watch-project', dirOfInterest], function (error, resp) {
    if (error) {
      console.error('Error initiating watch:', error)
      return
    }

    if ('warning' in resp) {
      console.log('warning: ', resp.warning)
    }

    console.log('watch established on ', resp.watch, ' relative_path', resp.relative_path)

    makeSubscription(client, resp.watch, resp.relative_path)
  })
})
