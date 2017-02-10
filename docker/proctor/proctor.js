const { Writable } = require('stream')

const stats = require('docker-stats')
const elasticsearch = require('elasticsearch')

const clientOpts = {
  host: [
    process.env.ES_URL_0,
    process.env.ES_URL_1,
    process.env.ES_URL_2,
    process.env.ES_URL_3
  ]
}
console.log('client opts', clientOpts)
const client = new elasticsearch.Client(clientOpts)

const reduceStatToBulk = (body, stat) =>
  body.concat({ index: {} }, stat)

const onStats = (stats, callback) => {
  client.bulk({
    index: 'docker-stats',
    type: 'stat',
    body: stats.reduce(reduceStatToBulk, [])
  }, callback)
}

const onError = err => {
  console.log('PROCTOR ERROR', err.stack)
}

stats({
  docker: {
    socketPath: '/var/run/docker.sock'
  }
  // matchByName: /^(v\d|master)/
})
.on('error', onError)
.pipe(new Writable({
  objectMode: true,
  write (chunk, enc, callback) {
    onStats([chunk], callback)
  },
  writev (multi, callback) {
    onStats(multi.map(m => m.chunk), callback)
  }
}))
.on('error', onError)
