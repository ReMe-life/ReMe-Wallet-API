FROM node:10 AS test-build
WORKDIR /home/api-build
COPY . /home/api-build
RUN npm install && npm run build
RUN npm install -g pkg && pkg dist/server.js
RUN mv server-linux api-pkg

FROM ubuntu:18.04

#Service variables
ARG PORT=80
ARG NODE_ENV=TEST
ARG RRP_ENDPOINT=https://ws-remelife.s6.staging-host.com
ARG REME_CORE_ENDPOINT=https://reme.onlinedemo.space:8492

#ENV set
ENV PORT=$PORT
ENV NODE_ENV=$NODE_ENV
ENV RRP_ENDPOINT=$RRP_ENDPOINT
ENV REME_CORE_ENDPOINT=$REME_CORE_ENDPOINT

WORKDIR /home/app
COPY --from=test-build /home/api-build/api-pkg /home/app
EXPOSE $PORT

CMD ["./api-pkg"]
