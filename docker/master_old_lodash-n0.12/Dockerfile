FROM node:0.12

ENV VERSION="master_old_lodash-n0.12"

COPY $VERSION/package.json /$VERSION/package.json
WORKDIR /$VERSION
RUN npm install

COPY base /base
COPY $VERSION /$VERSION

ENTRYPOINT ["node", "run.js"]