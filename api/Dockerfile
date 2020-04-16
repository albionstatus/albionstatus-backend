FROM node:12-alpine

WORKDIR /app

COPY ./src/package.json .

COPY ./src/yarn.lock .

RUN yarn install --frozen-lockfile

COPY ./src .

CMD yarn start


