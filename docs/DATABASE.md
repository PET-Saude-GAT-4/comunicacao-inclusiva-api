# Database

PostgreSQL 16, accessed through Prisma 7 with the `pg` driver adapter (`src/prisma.ts`). The schema is `prisma/schema.prisma`; migrations are in `prisma/migrations`; the seed is `prisma/seed.ts`.

Terms used here are defined in [GLOSSARY.md](GLOSSARY.md).

## Entities

```
Role 1─* User 1─* UserToken
            │
            ├─* StoredFile 1─1 Pictogram ─┐
            │              1─1 SignWriting ┤
            │                              └─* Term (one pictogram + one SignWriting)
            │                                    │
            ├─* Board (author) ─* BoardTerm ─────┤   linked list, ordered by `next`
            │     │                              │
            │     └─0..1 TriageStep              │
            └─* Phrase (author) ─* PhraseTerm ───┘   ordered by `order`

InteractionChain: (Board | Phrase) trigger → Board response, ranked
Profession 1─* Speciality
```

Every content table has an integer `id` for joins and a `uuid` exposed to clients; the API addresses content by UUID.

### Users and access

- **Role** — `super_admin`, `admin` or `viewer` (`RoleEnum` in `src/models/types/Role.type.ts`).
- **User** — email, role, optional `passwordHash` (empty until the invitation is accepted) and `confirmedAt` (null until then).
- **UserToken** — single-use tokens for invitations and password resets, with `purpose`, `expiresAt` and `usedAt`. Deleted with their user. See [AUTH.md](AUTH.md).

### Content

- **StoredFile** — metadata of an uploaded file; the bytes live under `FILE_STORAGE_DIR`.
- **Pictogram** and **SignWriting** — an image (one `StoredFile` each) with a description.
- **Term** — the unit of communication: one pictogram plus one SignWriting. The pair is unique.
- **Board** — a titled, ordered set of terms with a representative pictogram, an optional author and a `type` (`common` or `emergency`). It reaches the app only while `publishedAt` is set.
  - Its terms are a **linked list**: `Board.first` points at the first `BoardTerm` and each `BoardTerm.next` at the following one. Composite foreign keys on `(boardId, id)` keep every pointer inside the same board, and a term appears at most once per board.
- **Phrase** — an ordered sequence of terms (`PhraseTerm.order`) with an optional author. `publishedAt` decides whether it reaches devices; `listedInLibrary` decides whether it shows in the app's library, so an unlisted phrase can still trigger board recommendations.
- **InteractionChain** — "after this, suggest that": a trigger (exactly one of a board or a phrase) and a response board, with a `rank` to order the suggestions. The "exactly one trigger" rule is a CHECK constraint written by hand in `migrations/20260918120000_add_phrase_trigger_and_listed_in_library`.
- **TriageStep** — one of the five Quick Emergency levels (1 to 5), each holding one `emergency` board. The level range, the board type and the deferrable uniqueness of `level` (so two boards can swap levels in one transaction) are enforced by SQL written by hand in `migrations/20261004120000_add_triage_step`. A board cannot be deleted or retyped while it is a step.
- **Profession** and **Speciality** — what a health professional selects in the app before a consultation. Both have a stable `code` the app refers to offline.

Some rules live only in SQL, because Prisma cannot express them; the comments on the models in `schema.prisma` point to the migration that holds each one. Read them before changing those tables.

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

| File | Loads |
|---|---|
| `01-roles-users.ts` | The three roles and the `admin@admin.admin` super admin, with the password from `ADMIN_PASSWORD`. |
| `02-terms.ts` | Pictograms, SignWriting images and terms from `prisma/assets/boards`, copying the files into `FILE_STORAGE_DIR`. |
| `03-boards.ts` | The starter boards and their terms. |
| `04-phrases.ts` | Ready-made phrases. |
| `05-interaction-chains.ts` | Board and phrase recommendations between the seeded boards. |
| `06-triage-steps.ts` | The Quick Emergency levels that have boards (levels 4 and 5 stay empty). |
| `07-professions.ts` | The professions and specialities the app needs to start a consultation. |

## Test database

The integration tests use their own database, named in `.env.test` (see `.env.test.example`; by default `comunicacao_test` on the dev Postgres container). `yarn test:integration` migrates it with `prisma migrate deploy` and truncates every table before each test. The name must end in `_test`, or the suite refuses to run. Seeds are not loaded there: each test creates its own data.
