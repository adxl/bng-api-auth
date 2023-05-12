### development stage ###

FROM node:18-alpine as development

USER node
WORKDIR /home/node

### build stage ###

FROM node:18.0.0-alpine as build

USER node
WORKDIR /home/node

COPY --chown=node:node . .

RUN npm install && npm run build

### production stage ###

FROM node:18.0.0-alpine as production

USER node

WORKDIR /home/node

COPY --from=build --chown=node:node /home/node/dist ./dist
COPY --from=build --chown=node:node /home/node/node_modules ./node_modules
COPY --from=build --chown=node:node /home/node/package.json ./package.json

CMD npm run start:prod
