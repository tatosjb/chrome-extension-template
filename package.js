const execSync = require("child_process").execSync
const response = execSync('yarn build', {
  cwd: process.cwd()
})
console.log(response)


