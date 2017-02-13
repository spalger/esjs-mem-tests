var es = require('elasticsearch')
var version = require('path').basename(__dirname)
require('../base/test')(es, version)
