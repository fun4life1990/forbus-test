FROM node:24-alpine

RUN apk add --no-cache bash # python3 make g++

RUN npm i -g @nestjs/cli@^11

RUN mkdir /app

RUN mkdir /var/log/app

RUN chown -R node:node /var/log/app

WORKDIR /app
