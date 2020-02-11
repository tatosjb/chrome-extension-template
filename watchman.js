const watchman = require('fb-watchman')
const path = require('path')
const execSync = require("child_process").execSync
const client = new watchman.Client()

const dir_of_interest = path.join(__dirname, 'src')

function make_subscription(client, watch, relative_path) {
  sub = {
    expression: ["allof", ["match", "*.js"]],
    fields: ["name", "size", "mtime_ms", "exists", "type"]
  }

  if (relative_path) {
    sub.relative_root = relative_path;
  }

  client.command(['subscribe', watch, 'mysubscription', sub],
    function (error, resp) {
      if (error) {
        console.error('failed to subscribe: ', error);
        return;
      }
      console.log('subscription ' + resp.subscribe + ' established');
    });

  client.on('subscription', function (resp) {
    if (resp.subscription !== 'mysubscription') return;

    resp.files.forEach(function (file) {
      const mtime_ms = +file.mtime_ms;

      console.log('file changed: ' + file.name, mtime_ms)
      const response = execSync('yarn build', {
        cwd: process.cwd()
      })
      console.log(String(response))
    });
  });
}

client.capabilityCheck({optional:[], required:['relative_root']},
  function (error, resp) {
    if (error) {
      console.log(error);
      client.end();
      return;
    }

    client.command(['watch-project', dir_of_interest],
    function (error, resp) {
        if (error) {
          console.error('Error initiating watch:', error)
          return
        }

        if ('warning' in resp) {
          console.log('warning: ', resp.warning);
        }

        console.log('watch established on ', resp.watch,
                    ' relative_path', resp.relative_path);

        make_subscription(client, resp.watch, resp.relative_path)
    })
  })
