# ---- Base ----
FROM node:22-alpine AS base
WORKDIR /app

# Habilita corepack para usar yarn 4
RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# ---- Development ----
FROM base AS development

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
FROM node:22-alpine AS production
WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

RUN yarn workspaces focus --production 2>/dev/null || yarn install --immutable

COPY --from=builder /app/dist ./dist

EXPOSE 8080
CMD ["yarn", "start"]