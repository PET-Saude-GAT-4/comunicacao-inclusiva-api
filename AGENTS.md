# AGENTS.md

The backend of Comunicação Inclusiva: Express 5, TypeScript (ES modules), PostgreSQL through Prisma 7. [README.md](README.md) covers what it is and how a person sets it up; this file holds what you need to change it without breaking its conventions.

## Setup and commands

```bash
cp .env.example .env             # then set ADMIN_PASSWORD
yarn install
yarn docker:dev                  # API (port 8080), PostgreSQL (DB_PORT, 5434), Mailpit (8025)
yarn prisma:migrate:dev          # runs inside the api_dev container
yarn prisma:seed                 # runs inside the api_dev container
```

| Command                                                                        | Use it to                                                                               |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `yarn lint`                                                                    | Run ESLint (fails on warnings)                                                          |
| `yarn format` / `yarn format:check`                                            | Format with Prettier / check without writing                                            |
| `yarn typecheck`                                                               | Type-check `src/`, `tests/` and `prisma/`                                               |
| `yarn test`                                                                    | Run the unit tests (no database needed)                                                 |
| `yarn test:integration`                                                        | Run the integration tests (dev PostgreSQL and `.env.test`)                              |
| `yarn test:all`                                                                | Run both suites                                                                         |
| `yarn build`                                                                   | Generate the Prisma client and compile to `dist/`                                       |
| `yarn dev` / `yarn start`                                                      | Run the API with hot reload / from `dist/`                                              |
| `yarn prisma:migrate:dev` / `yarn prisma:seed`                                 | Migrate / seed the dev database inside `api_dev`                                        |
| `yarn prisma:migrate:prod`                                                     | Apply migrations to the database in `.env.prod`                                         |
| `yarn docker:dev` / `docker:dev-stop` / `docker:dev-build` / `docker:dev-down` | Start / stop / rebuild / remove the dev stack (`down` also deletes the database volume) |
| `yarn docker:prod`                                                             | Build and start the production image                                                    |

## How a request flows

Router → controller → service → repository → Prisma. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) explains each layer, validation, errors, files, email and testing; read it before adding an endpoint instead of inferring the pattern from one file.

## Rules that are easy to get wrong

- **Imports end in `.js`.** The project compiles as NodeNext ESM, so a relative or `@/` import of `src/foo/Bar.ts` is written `@/foo/Bar.js`. Use `@/` for anything under `src/`, `@test/` for support code under `tests/`, and `import type` for type-only imports (`verbatimModuleSyntax` is on).
- **Each layer is a class behind an interface** (`IUserService`, `IUserRepository`…), and its constructor takes an optional `props` object with its dependencies, falling back to the real ones. There is no DI container. Keep that shape: it is how unit tests pass doubles in.
- **Only repositories import `prisma`**, and they return the plain types in `src/models/types`, never Prisma's generated types.
- **The Prisma client is generated, not committed.** It lives in `src/generated/prisma`; after changing `prisma/schema.prisma` or on a fresh clone, run `npx prisma generate` (`yarn dev` and `yarn build` do it for you). Never edit files there.
- **Schema changes need a migration** made with `yarn prisma:migrate:dev` — never edit an applied migration. When Prisma cannot express a rule, edit the generated SQL before applying it and point to it from a comment on the model (see [docs/DATABASE.md](docs/DATABASE.md)).
- **Expected failures are thrown, not answered.** Throw a class from `src/errors` (`NotFoundError`, `ForbiddenError`…); `ErrorHandlerMiddleware` turns it into `{ status, message }`. Do not call `res.status(4xx)` from a service.
- **Every list endpoint is paginated** through `parseListQuery` and `buildListMeta` (`src/utils/pagination.ts`).
- **Public routes** (`src/routers/public/`) need no token and must only return published content.
- **A new environment variable** goes in the zod schema of `src/config/env.ts` (which exits the process when one is missing), in `.env.example`, and, when tests need it, in `.env.test.example` and `tests/unit/env.ts`.
- **Where a test goes.** A rule inside a service, middleware or util is a unit test in a `__tests__` folder beside the file, named after it. Behaviour that crosses HTTP or the database is an integration test in `tests/integration`, one file per resource. Integration tests truncate every table before each test, so each creates its own data with the factories in `tests/integration/helpers`, and finds records by id, never by position in a list.
- **The integration database name must end in `_test`**; the suite refuses to run otherwise. Never point `.env.test` at the dev database.
- **English only** — code, comments, docs, commit messages.

## Formatting and lint

Every TypeScript file must pass ESLint and follow the Prettier style in `.prettierrc`. After changing files:

1. Run `npx eslint --fix` on the changed files.
2. Run `npx prettier --write` on the changed files.
3. Do not leave code that ESLint still reports, including the TypeScript-specific rules and the import order (`simple-import-sort`): CI fails on warnings too.

Before opening a pull request, run what CI runs: `yarn lint`, `yarn format:check`, `yarn typecheck`, `yarn test`, `yarn test:integration` and `yarn build`. [.github/workflows/README.md](.github/workflows/README.md) explains each check.

## Where to look next

- [docs/AUTH.md](docs/AUTH.md) — roles, login, invitations, password reset, and which role may call each route.
- [docs/DATABASE.md](docs/DATABASE.md) — entities, rules enforced in SQL, migrations, seeds, the test database.
- [docs/GLOSSARY.md](docs/GLOSSARY.md) — the domain vocabulary; use these names in code.
- [CHANGELOG.md](CHANGELOG.md) — add a line under `[Unreleased]` when a change is visible to the dashboard or the app.
