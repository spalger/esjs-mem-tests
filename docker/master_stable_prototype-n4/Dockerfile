FROM node:4

ENV VERSION="master_stable_prototype-n4"

COPY $VERSION/package.json /$VERSION/package.json
WORKDIR /$VERSION
RUN npm install

COPY base /base
COPY $VERSION /$VERSION

ENTRYPOINT ["node", "run.js"]