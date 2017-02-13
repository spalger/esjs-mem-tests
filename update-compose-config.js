const { readdirSync, writeFileSync } = require('fs')
const { resolve } = require('path')
const jsYaml = require('js-yaml')

const versions = readdirSync(resolve(__dirname, 'docker'))

const compose = {
  version: '2',
  services: {}
}

versions.forEach(v => {
  const match = v.match(/^v?(.+?)-n(.+?)$/)
  if (!match) {
    console.log(' - skipping version %j, it does not match expected regex', v)
    return
  }

  const [, esjsv, nodev] = match
  console.log('writing esjs(%s) node(%s)', esjsv, nodev)

  compose.services[v] = {
    container_name: v,

    build: {
      context: '.',
      dockerfile: `${v}/Dockerfile`
    },

    labels: {
      'com.esjs.nodev': nodev,
      'com.esjs.esjsv': esjsv
    },

    env_file: 'docker/.env',
    network_mode: 'host',
    privileged: true,
    read_only: true,
    restart: 'always',
    mem_limit: '512M',
    memswap_limit: '512M'
  }
})

writeFileSync(resolve(__dirname, 'docker-compose.yml'), jsYaml.safeDump(compose), 'utf8')
