# Database

PostgreSQL 16, accessed through Prisma 7 with the `pg` driver adapter (`src/prisma.ts`). The schema is `prisma/schema.prisma`; migrations are in `prisma/migrations`; the seed is `prisma/seed.ts`.

## Entities

`prisma/schema.prisma` is the source of truth for entities, fields and relations; what each one means is in [GLOSSARY.md](GLOSSARY.md). This section covers only what the schema does not show at a glance.

- **IDs** — every content table has an integer `id` for joins and a `uuid` exposed to clients; the API addresses content by UUID.
- **Board terms are a linked list** — `Board.first` points at the first `BoardTerm` and each `BoardTerm.next` at the following one. Composite foreign keys on `(boardId, id)` keep every pointer inside the same board, and a term appears at most once per board.
- **Phrase terms** are ordered by `PhraseTerm.order` instead.
- **Publishing** — boards and phrases reach the app only while `publishedAt` is set. A phrase's `listedInLibrary` decides separately whether it shows in the app's library, so an unlisted phrase can still trigger board recommendations.
- **Tokens** — `UserToken` holds invitation and password reset tokens, deleted with their user. How they are stored and checked is in [AUTH.md](AUTH.md).

### Rules written in SQL

Prisma cannot express these, so they live in hand-edited migrations. The comments on the models in `schema.prisma` point to them; read them before changing those tables.

- **InteractionChain** — a trigger is exactly one of a board or a phrase (CHECK constraint in `migrations/20260918120000_add_phrase_trigger_and_listed_in_library`).
- **TriageStep** — the level is 1 to 5, the board must be `emergency`, and the uniqueness of `level` is deferrable so two boards can swap levels in one transaction (`migrations/20261004120000_add_triage_step`). A board cannot be deleted or retyped while it is a step.

## Migrations

Create a migration after editing `schema.prisma`, with the dev stack running (`yarn docker:dev`):

```bash
yarn prisma:migrate:dev        # prisma migrate dev inside the api_dev container
```

Name it after the change; when Prisma cannot express a rule, edit the generated SQL before applying it and point to it from a comment on the model.

Apply pending migrations in production (reads `.env.prod`):

```bash
yarn prisma:migrate:prod       # prisma migrate deploy
```

The `unaccent` extension, used by text search, is created by `migrations/20261013120000_add_unaccent_extension`.

## Seeds

```bash
yarn prisma:seed               # prisma db seed inside the api_dev container
```

`prisma/seed.ts` runs the files in `prisma/seeds` in order. Each seed upserts by a natural key (a role name, a board title, a level), so running it again converges instead of duplicating:

| File                       | Loads                                                                                                            |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `01-roles-users.ts`        | The three roles and the `admin@admin.admin` super admin, with the password from `ADMIN_PASSWORD`.                |
| `02-terms.ts`              | Pictograms, SignWriting images and terms from `prisma/assets/boards`, copying the files into `FILE_STORAGE_DIR`. |
| `03-boards.ts`             | The starter boards and their terms.                                                                              |
| `04-phrases.ts`            | Ready-made phrases.                                                                                              |
| `05-interaction-chains.ts` | Board and phrase recommendations between the seeded boards.                                                      |
| `06-triage-steps.ts`       | The Quick Emergency levels that have boards (levels 4 and 5 stay empty).                                         |
| `07-professions.ts`        | The professions and specialities the app needs to start a consultation.                                          |

## Test database

The integration tests use their own database, named in `.env.test` (see `.env.test.example`; by default `comunicacao_test` on the dev Postgres container). `yarn test:integration` migrates it with `prisma migrate deploy` and truncates every table before each test. The name must end in `_test`, or the suite refuses to run. Seeds are not loaded there: each test creates its own data.
