const watchman = require('fb-watchman')
const path = require('path')
const execSync = require('child_process').execSync
const client = new watchman.Client()

const dirOfInterest = path.join(__dirname, 'src')

function makeSubscription (client, watch, relativePath) {
  const sub = {
    expression: ['allof', ['match', '*.*']],
    fields: ['name', 'size', 'mtime_ms', 'exists', 'type']
  }

  if (relativePath) {
    sub.relative_root = relativePath
  }

  client.command(['subscribe', watch, 'mysubscription', sub],
    function (error, resp) {
      if (error) {
        console.error('failed to subscribe: ', error)
        return
      }
      console.log('subscription ' + resp.subscribe + ' established')
    })

  client.on('subscription', function (resp) {
    if (resp.subscription !== 'mysubscription') return

    const response = execSync('yarn build', {
      cwd: process.cwd()
    })
    console.log(String(response))
  })
}

client.capabilityCheck({ optional: [], required: ['relative_root'] },
  function (error, resp) {
    if (error) {
      console.log(error)
      client.end()
      return
    }

    client.command(['watch-project', dirOfInterest],
      function (error, resp) {
        if (error) {
          console.error('Error initiating watch:', error)
          return
        }

        if ('warning' in resp) {
          console.log('warning: ', resp.warning)
        }

        console.log('watch established on ', resp.watch,
          ' relative_path', resp.relative_path)

        makeSubscription(client, resp.watch, resp.relative_path)
      })
  })
