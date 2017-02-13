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

  writeFileSync(
    resolve(__dirname, 'docker', v, 'Dockerfile'),
`FROM node:${nodev}

ENV VERSION="${v}"

COPY $VERSION/package.json /$VERSION/package.json
WORKDIR /$VERSION
RUN npm install

COPY base /base
COPY $VERSION /$VERSION

ENTRYPOINT ["node", "run.js"]`,
    'utf8'
  )

  compose.services[v] = {
    container_name: v,

    build: {
      context: 'docker',
      dockerfile: `${v}/Dockerfile`
    },

    labels: {
      'com.esjs.nodev': nodev,
      'com.esjs.esjsv': esjsv,
      'com.esjs.memlimit': '1G'
    },

    env_file: 'docker/.env',
    network_mode: 'host',
    privileged: true,
    read_only: true,
    restart: 'always',
    mem_limit: '1G',
    memswap_limit: '1G'
  }
})

writeFileSync(resolve(__dirname, 'docker-compose.yml'), jsYaml.safeDump(compose), 'utf8')
