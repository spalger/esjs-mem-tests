FROM node:7

ENV VERSION="v12-n7"

COPY $VERSION/package.json /$VERSION/package.json
WORKDIR /$VERSION
RUN npm install

COPY base /base
COPY $VERSION /$VERSION

ENTRYPOINT ["node", "run.js"]