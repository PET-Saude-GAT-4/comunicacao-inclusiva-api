# ---- Base ----
FROM node:22-alpine@sha256:1314fb30ec37592d5845e5a160d522c0e680972aa534549940b8d73bde88481a AS base
WORKDIR /app

# Habilita corepack para usar yarn 4
RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# ---- Development ----
FROM base AS development

ENV CHOKIDAR_USEPOLLING=true

RUN yarn install

COPY . .

EXPOSE 8080
CMD ["yarn", "dev"]

# ---- Builder ----
FROM base AS builder

RUN yarn install --immutable

COPY . .

RUN yarn build

# ---- Production ----
FROM node:22-alpine@sha256:1314fb30ec37592d5845e5a160d522c0e680972aa534549940b8d73bde88481a AS production
WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

RUN yarn workspaces focus --production 2>/dev/null || yarn install --immutable

COPY --from=builder /app/dist ./dist

EXPOSE 8080
CMD ["yarn", "start"]