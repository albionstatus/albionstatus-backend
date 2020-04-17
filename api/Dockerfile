FROM node:12-alpine

WORKDIR /app

COPY ./src/package.json .

COPY ./src/yarn.lock .

RUN yarn install --frozen-lockfile

COPY ./src/shared ./shared
COPY ./src/api ./api

CMD yarn start


