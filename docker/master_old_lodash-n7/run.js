const es = require('elasticsearch')
const version = require('path').basename(__dirname)
require('../base/test')(es, version)
