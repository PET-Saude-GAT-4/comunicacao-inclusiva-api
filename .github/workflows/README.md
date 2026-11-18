# CI

Read it when a check failed on your pull request, or before changing what CI runs.

[`ci.yml`](ci.yml) runs on every pull request into `main` or `develop`, and again on every push to them, on the commit that landed. A new push to the same pull request cancels the run still in flight; a run on `main` or `develop` is never cancelled, so every merge keeps its own result. The workflow only reads the repository (`contents: read`).

The push run exists because branch protection does not require a pull request to be up to date with its base: two pull requests that each passed against an older `develop` can merge and break it together. When that happens, the merge commit turns red and GitHub notifies whoever merged; there is no other alert.

## Jobs

Each check is its own job, so a red check names what broke:

| Job           | Command                 | Catches                                                 |
| ------------- | ----------------------- | ------------------------------------------------------- |
| `lint`        | `yarn lint`             | Any ESLint error or warning, root config files included |
| `format`      | `yarn format:check`     | A file Prettier would change                            |
| `types`       | `yarn typecheck`        | Type errors in `src/`, `tests/` and `prisma/`           |
| `unit`        | `yarn test`             | A failing unit test                                     |
| `integration` | `yarn test:integration` | A failing integration test, against PostgreSQL 16       |
| `build`       | `yarn build`            | A compile or path-alias error in the production build   |

Every job starts with [`.github/actions/setup`](../actions/setup/action.yml): Node from [`.nvmrc`](../../.nvmrc), the Yarn 4 release committed under `.yarn/releases` (which `yarnPath` in `.yarnrc.yml` points to, so no Corepack download is needed), `yarn install --immutable`, which fails when `yarn.lock` is out of date instead of rewriting it, and `prisma generate`, since the client in `src/generated` is not committed.

The six jobs are **required status checks** on `main` and `develop`: a pull request cannot be merged until all of them pass. The protection matches them by job name, so renaming a job means updating the branch protection in the same change.

## Pinned actions and images

Every external action is referenced by a full commit SHA, with its version as a comment: `uses: actions/checkout@<40-character sha> # v4.4.0`. A tag such as `@v4` can be moved to another commit by whoever controls the action's repository, which would change the code every required check runs without a change here. Local actions (`uses: ./.github/actions/setup`) need no pin.

[Dependabot](../dependabot.yml) keeps the pins current: once a week it opens a `ci:` pull request into `develop` for each action with a new release, bumping the SHA and the comment together, and that pull request goes through the same checks as any other. It reads `.github/workflows` and the composite action in `.github/actions/setup`; a new composite action needs its folder added to `directories` there.

The repository requires pinning (Settings → Actions → General → _Require actions to be pinned to a full-length commit SHA_), so a run that uses an action by tag fails. To add an action, look up the commit of its latest release and write it the same way, with the comment.

The container images follow the same rule, pinned by digest with the tag kept for readability: `postgres:16@sha256:<64 hex chars>` for the `integration` service, and `node:22-alpine@sha256:<64 hex chars>` in every `FROM` of the [`Dockerfile`](../../Dockerfile). The digest is the multi-arch index, so the same pin works on any platform. Who bumps each one:

- **`Dockerfile`**: Dependabot's `docker` entry opens a weekly `ci:` pull request when `node:22-alpine` gets a new build. It never proposes another Node major, which has to change together with `.nvmrc`, by hand.
- **The `postgres` service in `ci.yml`**: by hand. Dependabot does not read container images in workflow files, so the digest only changes when PostgreSQL is upgraded here (and in `docker-compose.yml`, which stays on tags because it only runs the local stack).

To look up a digest, run `docker buildx imagetools inspect postgres:16` and copy the `Digest:` at the top.

## Details that look like mistakes

- **Lint warnings fail the `lint` job.** The rules are `warn` so editors do not paint unfinished code red, but `--max-warnings 0` keeps them out of `develop`. `npx eslint --fix` fixes import order.
- **The `integration` service publishes PostgreSQL on port 5434.** The suite loads `.env.test` with override on, so the job copies `.env.test.example` as it is and the database has to be where that file says: `localhost:5434/comunicacao_test`.

## Reproducing a failure locally

Each job is one command:

```bash
yarn lint             # npx eslint --fix fixes most of it
yarn format:check     # yarn format fixes it
yarn typecheck
yarn test
yarn test:integration # needs the dev PostgreSQL (yarn docker:dev) and a .env.test
yarn build
```
