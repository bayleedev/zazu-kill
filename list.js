const { exec } = require('child_process')
const fuzzyfind = require('fuzzyfind')
const { basename } = require('path')

module.exports = () => {
  return (query, env = {}) => {
    return new Promise((resolve, reject) => {
      exec('ps -A -o pid -o %cpu -o comm | sed 1d', (error, stdout) => {
        if (error) return reject(error)
        const processes = stdout.trim().split('\n').map((line, index) => {
          const [pid, cpu, name] = line.trim().split(/\s+/)
          return {
            pid: parseInt(pid, 10),
            cpu: parseFloat(cpu, 10),
            title: basename(name),
            name,
          }
        })
        resolve(processes)
      })
    }).then((results) => {
      return query ? fuzzyfind(query, results, {
        accessor: (result) => {
          return result.pid + result.name
        },
      }) : results
    }).then((results) => {
      return results.sort((a, b) => {
        return a.cpu > b.cpu ? -1 : 1
      })
    }).then((results) => {
      return results.slice(0, 10)
    }).then((results) => {
      return results.map((result) => {
        return {
          icon: 'fa-cogs',
          title: result.title,
          subtitle: `${result.cpu}% @ ${result.name}`,
          value: result.pid,
        }
      })
    })
  }
}
