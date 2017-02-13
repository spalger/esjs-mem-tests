module.exports = function (es, version, defer) {
  var TEST_CONCURRENCY = parseInt(process.env.TEST_CONCURRENCY, 10)
  var TEST_DELAY = parseInt(process.env.TEST_DELAY, 10)
  var TEST_CONSTANT_GC = process.env.TEST_CONSTANT_GC === 'true'

  console.log('starting', version)
  console.log('TEST_CONCURRENCY', TEST_CONCURRENCY)
  console.log('TEST_DELAY', TEST_DELAY)
  console.log('TEST_CONSTANT_GC', TEST_CONSTANT_GC)

  var active = 0

  var clientOpts = {
    host: [
      process.env.ES_URL_0,
      process.env.ES_URL_1,
      process.env.ES_URL_2,
      process.env.ES_URL_3
    ]
  }
  if (defer) clientOpts.defer = defer
  console.log('client opts', clientOpts)
  var client = es.Client(clientOpts)

  function tick (cb) {
    client.transport.request({
      path: '/',
      method: 'HEAD'
    }, cb)
  }

  function tock () {
    for (; active < TEST_CONCURRENCY; active++) {
      tick(function (err) {
        if (err) {
          console.log('Error in %s', version, err.message)
          return
        }

        active -= 1
        if (TEST_CONSTANT_GC) global.gc()
        setTimeout(tock, TEST_DELAY)
      })
    }
  }

  tock()
}
