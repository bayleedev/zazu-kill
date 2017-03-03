const { exec } = require('child_process')

module.exports = () => {
  return (pid, env = {}) => {
    return new Promise((resolve, reject) => {
      exec(`kill -9 ${pid}`, (error, stdout) => {
        error ? reject(error) : resolve()
      })
    })
  }
}
