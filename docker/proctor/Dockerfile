FROM node:7

WORKDIR /proctor
COPY package.json package.json
RUN npm install --production

COPY . .
ENTRYPOINT ["node", "proctor.js"]