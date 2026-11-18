# Comunicação Inclusiva API

The backend of Comunicação Inclusiva. It serves the **dashboard**, where staff curate pictograms, SignWriting images, boards and phrases, and the **app**, which reads the published content without logging in. It is an Express 5 application in TypeScript, backed by PostgreSQL through Prisma 7.

## Requirements

- **Node 22**
- **Yarn 4** — the release is committed under `.yarn/releases` and `.yarnrc.yml` points to it, so any `yarn` on your machine runs it. If you have no `yarn` at all, run `corepack enable` once.
- **Docker** with Compose — the development stack (API, PostgreSQL and Mailpit) runs in containers.

## Getting started

1. Create your environment file. The defaults work with the Docker stack; set `ADMIN_PASSWORD` to the password you want for the seeded admin.

   ```bash
   cp .env.example .env
   ```

2. Install the dependencies (for your editor, the tests and the scripts that run on your machine):

   ```bash
   yarn install
   ```

3. Start the stack — the API with hot reload on port 8080, PostgreSQL on `DB_PORT` (5434) and Mailpit:

   ```bash
   yarn docker:dev
   ```

4. Create the tables and load the starter data:

   ```bash
   yarn prisma:migrate:dev
   yarn prisma:seed
   ```

The API answers on <http://localhost:8080>. Log in with `POST /auth/login` as `admin@admin.admin` and the `ADMIN_PASSWORD` from your `.env`. Every email the API sends (invitations, password resets) lands in Mailpit at <http://localhost:8025>.

## Commands

| Command                    | What it does                                                                                          |
| -------------------------- | ----------------------------------------------------------------------------------------------------- |
| `yarn docker:dev`          | Starts the dev stack (API, PostgreSQL, Mailpit) in the background.                                    |
| `yarn docker:dev-stop`     | Stops the dev stack, keeping its containers and data.                                                 |
| `yarn docker:dev-build`    | Rebuilds the dev API image (after changing dependencies).                                             |
| `yarn docker:dev-down`     | Removes the dev stack **and its database volume**.                                                    |
| `yarn docker:prod`         | Builds and starts the production image, reading `.env.prod`.                                          |
| `yarn prisma:migrate:dev`  | Creates and applies migrations inside the `api_dev` container.                                        |
| `yarn prisma:migrate:prod` | Applies pending migrations to the database in `.env.prod`.                                            |
| `yarn prisma:seed`         | Loads the starter data inside the `api_dev` container.                                                |
| `yarn dev`                 | Generates the Prisma client, type-checks and runs the API with hot reload. The dev container runs it. |
| `yarn build`               | Generates the Prisma client and compiles to `dist/`.                                                  |
| `yarn start`               | Runs the compiled API from `dist/`.                                                                   |
| `yarn lint`                | Runs ESLint on `src/`, `tests/`, `prisma/` and the root config files; warnings fail it too.           |
| `yarn format`              | Formats every file with Prettier.                                                                     |
| `yarn format:check`        | Lists the files Prettier would change, without changing them.                                         |
| `yarn typecheck`           | Type-checks `src/`, `tests/` and `prisma/` without emitting.                                          |
| `yarn test`                | Runs the unit tests.                                                                                  |
| `yarn test:integration`    | Runs the integration tests against the database in `.env.test`.                                       |
| `yarn test:all`            | Runs both test suites.                                                                                |

The integration tests need the dev PostgreSQL running and a `.env.test`: copy `.env.test.example` to `.env.test`. See [Testing](docs/ARCHITECTURE.md#testing).

## Layout

```
src/
├── app.ts, server.ts   the Express app and the process that listens
├── config/             environment validation
├── routers/            one router per resource; public/ holds the app's routes
├── controllers/        request in, response out
├── services/           business rules
├── repositories/       Prisma queries
├── models/             domain types
├── middlewares/        auth, file upload, 404 and error handling
├── errors/             typed HTTP errors
├── utils/              pagination, permissions, URLs, zod helpers
└── generated/          the Prisma client (generated, not committed)
prisma/
├── schema.prisma       the data model
├── migrations/         SQL migrations
├── seed.ts, seeds/     starter data
└── assets/             images the seeds load
tests/                  integration tests and test support
docs/                   architecture, auth, database, glossary
```

## Documentation

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — how a request flows through the code, validation, errors, files, email and testing.
- [AUTH.md](docs/AUTH.md) — roles, login, invitations, password reset and who can call what.
- [DATABASE.md](docs/DATABASE.md) — the entities, migrations, seeds and the test database.
- [GLOSSARY.md](docs/GLOSSARY.md) — the domain vocabulary (boards, terms, triage…).
- [CHANGELOG.md](CHANGELOG.md) — what changed in each release.

## Contributing

- Branch from `develop` and open the pull request into `develop`; `main` receives releases.
- Write commits as [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `test:`…).
- Write code, comments and docs in English.
- Every pull request into `develop` or `main` must pass lint, format, type check, unit and integration tests and the build before it can be merged. See [the CI README](.github/workflows/README.md) to reproduce a failing check locally.
