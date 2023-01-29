FROM neko3tech/bun:0.1.11-debian-bullseye

WORKDIR /app

COPY ./shared ./shared
COPY ./server ./server

ENTRYPOINT [ "bun", "server/src/server.ts" ]


# FROM node:12.18.1
#
# WORKDIR /app
#
# RUN curl -fsSL https://bun.sh/install | bash
#
# COPY ./shared ./shared
# COPY ./server ./server
#
# ENTRYPOINT [ "/root/.bun/bin/bun", "server/src/server.ts" ]
