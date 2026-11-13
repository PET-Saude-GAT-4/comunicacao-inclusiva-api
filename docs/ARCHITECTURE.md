# Architecture

The API is an Express 5 application written in TypeScript (ES modules), backed by PostgreSQL through Prisma 7. It serves two clients: the **dashboard**, where staff curate content, and the **app**, which reads published content without logging in.

This document explains how a request travels through the code and where the cross-cutting pieces live. For the data model see [DATABASE.md](DATABASE.md); for login, roles and invitations see [AUTH.md](AUTH.md); for the domain vocabulary see [GLOSSARY.md](GLOSSARY.md).

## Entry points

- `src/app.ts` builds the Express app (CORS, JSON body parsing, routers, 404 and error handlers) and exports it without listening, so tests can mount it with supertest.
- `src/server.ts` imports the app and calls `listen` on `PORT`. It is what `yarn dev` (through `tsx watch`) and `yarn start` (as `dist/server.js`) run.
- `src/config/env.ts` validates the environment with zod when it is first imported and exits the process if a variable is missing or malformed. It loads `.env` and then `.env.<NODE_ENV>` on top of it, so `.env.test` only needs the values that differ.

## Request flow

```
HTTP request
  → src/routers/          path + AuthMiddleware.auth(roles) + FileMiddleware
  → src/controllers/      read params/body/query, call a service, shape the response
  → src/services/         business rules, permissions between users, orchestration
  → src/repositories/     Prisma queries, mapping rows to the types in src/models/types
  → Prisma → PostgreSQL
```

Each layer is a class behind an interface (`IAuthService`, `IUserRepository`…). Constructors take an optional `props` object with their dependencies and fall back to the real implementations:

```ts
constructor(props?: Props) {
  this._userRepository = props?.userRepository ?? new UserRepository();
}
```

There is no container: routers instantiate controllers, controllers instantiate services, and so on. Tests replace a dependency by passing it in `props` (see `tests/unit/services`).

### Routers

`src/routers/index.ts` mounts one router per resource. Two families exist:

- **Authenticated routes** (`/boards`, `/phrases`, `/terms`, `/users`…) used by the dashboard. Each route declares who may call it with `authMiddleware.auth([...roles])`.
- **Public routes** under `/public` (`src/routers/public/`) used by the app. They need no token and only return content that is published.

`/auth` and `/invitations` are mostly public, since they are how a user gets a token in the first place. [AUTH.md](AUTH.md) has the full table of routes and roles.

### Controllers

Controllers read the request, call one service method and choose the status code and response shape. Response mappers that rename or hide fields live next to them (`BoardResponse.ts`, `TermResponse.ts`…). List endpoints parse `page`, `pageSize` and `q` with `parseListQuery` and answer with `buildListMeta` (`src/utils/pagination.ts`); every list is paginated, and a request without `page` gets the first page.

### Services

Services hold the rules: who may manage which role (`canManageRole` in `src/utils/permissions.ts`), what may change on a published board, the token lifecycle of invitations and password resets. They throw the typed errors below instead of touching the response.

### Repositories

Repositories are the only layer that imports `prisma` (`src/prisma.ts`). They return plain objects typed in `src/models/types`, not Prisma models, so services do not depend on Prisma's generated types. Text search (`src/repositories/search.ts`) runs in SQL with the `unaccent` extension, so searches ignore accents.

The Prisma client is generated into `src/generated/prisma` (ignored by git) by `prisma generate`, which `yarn dev` and `yarn build` run first.

## Validation

- **Environment:** zod, in `src/config/env.ts`.
- **List queries:** zod, in `parseListQuery`; failures become a `BadRequestError` whose message is built by `formatZodError` (`src/utils/zod.ts`).
- **Bodies:** controllers check required fields by hand and services validate the rest (password length in `PasswordService`, role permissions, uniqueness). There is no request-schema layer.

## Errors

Every expected failure is an error class in `src/errors` that extends `ErrorBase` with an HTTP status:

| Class | Status |
|---|---|
| `BadRequestError` | 400 |
| `UnauthorizedError` | 401 |
| `ForbiddenError` | 403 |
| `AccountNotConfirmedError` | 403 |
| `NotFoundError` | 404 |
| `ConflictError` | 409 |
| `InternalServerError` | 500 |

Express 5 forwards errors thrown in async handlers, so controllers and services just `throw`. `ErrorHandlerMiddleware` logs the error and, for an `ErrorBase`, answers `{ status, message }` with its status; anything else becomes a generic 500. Unknown paths reach `RouterNotFoundMiddleware` first.

## Files

Pictograms and SignWriting images are uploaded as `multipart/form-data`.

1. `FileMiddleware.validateSingleFile` (`src/middlewares/FileMiddleware.ts`) reads the file into memory with multer, enforces a size limit (2 MB by default), detects the real type from the bytes with `file-type` (the client's MIME type is not trusted) and checks it against the allowed types.
2. `FileService` (`src/services/file/FileService.ts`) writes the bytes under `FILE_STORAGE_DIR` and records a `StoredFile` row with its location, MIME type and a UUID. If the database write fails, the file is removed again.
3. The file is served by `GET /files/:uuid` and `GET /public/files/:uuid` (`FileController.stream`), which stream it with an `ETag` and a one-day immutable cache header. URLs returned to clients are built from `API_BASE_URL` (`src/utils/url.ts`).

## Email

`MailService` (`src/services/mail/MailService.ts`) sends HTML email through nodemailer over SMTP (`SMTP_*` variables). In development, `docker-compose.yml` runs Mailpit, which catches every message (web UI on port 8025). The tests replace nodemailer entirely; see [Testing](#testing).

## Testing

Jest runs two suites, both in ESM mode (`NODE_OPTIONS=--experimental-vm-modules`) through ts-jest:

| Command | Suite | Needs |
|---|---|---|
| `yarn test` | `tests/unit` — services with their dependencies passed in as doubles | nothing |
| `yarn test:integration` | `tests/integration` — HTTP requests with supertest against `src/app.ts` | Postgres and a `.env.test` |
| `yarn test:all` | both | as above |

- `jest.base.config.js` holds what both suites share; `jest.unit.config.js` and `jest.integration.config.js` add their own setup.
- **No email leaves the tests.** Both suites map `nodemailer` to `tests/support/nodemailer.ts`, which pushes every message into an in-memory `outbox` that tests read to get invitation and reset links.
- **Integration database.** Copy `.env.test.example` to `.env.test`. Before the suite, `tests/support/global-setup.ts` runs `prisma migrate deploy` against its `DATABASE_URL`, creating the database if needed. Before each test every table is truncated (`tests/support/db.ts`), so tests create what they need with the factories there. The database name must end in `_test`; the suite refuses to run otherwise, so it can never truncate the dev database.
