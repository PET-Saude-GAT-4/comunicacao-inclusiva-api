# Authentication and access

Users are staff who curate content in the dashboard. Nobody signs up: an admin creates the account, the person receives an invitation by email and sets their password. The app does not log in; it reads the public routes.

## Roles

| Role | Can |
|---|---|
| `viewer` | Read pictograms, SignWriting and terms. |
| `admin` | Everything a viewer can, plus manage content (boards, phrases, terms, files, interaction chains, professions), read triage steps and roles, and manage `admin` and `viewer` users. |
| `super_admin` | Everything, including managing other super admins, roles and triage steps. |

Two layers enforce this:

1. **Per route**, `AuthMiddleware.auth([...])` lets through only the listed roles (table below).
2. **Between users**, `canManageRole` (`src/utils/permissions.ts`) decides whether the caller may create, update or delete a user of a given role: a super admin may manage anyone, an admin may manage admins and viewers, a viewer may manage nobody. Nobody can change their own role.

## Login

`POST /auth/login` with `{ email, password }`:

- **200** `{ token, user }` for valid credentials.
- **401** `Invalid credentials` for an unknown email, a wrong password, or an account without a password, with the same body for all three.
- **403** for an account that exists but has not accepted its invitation (`AccountNotConfirmedError`), whatever the password sent.

Login does not fully hide which emails have accounts: the 403 marks pending accounts without a password, and an unknown email is answered faster because it skips the bcrypt comparison.

The token is a JWT signed with `JWT_SECRET` (HS256), valid for `JWT_EXPIRES_IN` (default `1d`), carrying `{ id, uuid, email, role, confirmed }`. Clients send it as `Authorization: Bearer <token>`. There is no refresh token or server-side revocation: a token stays valid until it expires, even if the user's role changes.

`GET /auth/check-token` returns the current user for any valid token, which the dashboard uses to restore a session.

`AuthMiddleware` answers 401 when the header is missing, malformed, or the token is invalid or expired; 403 when the account is not confirmed or the role is not allowed.

## Invitations and account confirmation

1. An admin creates a user (`POST /users`) with an email and a role. The account has no password and `confirmedAt` is null.
2. `InvitationService.sendInvitation` retires any earlier invitation for that user, stores a new random token valid for `INVITATION_EXPIRES_HOURS` (default 168, one week) and emails a link to `FRONTEND_BASE_URL/invitation/accept?token=…`.
3. `POST /invitations/accept` with `{ token, password }` checks the token (it must exist, be an invitation, be unused and unexpired), validates the password (at least `MIN_PASSWORD_LENGTH` characters, default 8), and in one transaction marks the token used, stores the bcrypt hash and sets `confirmedAt`. Any failure answers 400; a refused password leaves the invitation usable.
4. `POST /invitations/resend` with `{ email }` sends a fresh invitation, retiring the previous one, when the email belongs to an unconfirmed account. It answers the same 200 for confirmed and unknown emails. It has no cooldown: each call sends another email.

## Password reset

1. `POST /auth/password-reset` with `{ email }` always answers the same 200 message. Behind it:
   - unknown email → nothing happens;
   - a reset was requested less than 2 minutes ago → nothing happens (cooldown against repeated reset emails);
   - unconfirmed account → the invitation is re-sent instead, since there is no password to reset. The cooldown only counts reset tokens, so this path re-sends on every request;
   - otherwise → earlier reset tokens are retired and a new one, valid for **15 minutes**, is emailed as a link to `FRONTEND_BASE_URL/reset-password?token=…`.
2. `POST /auth/password-reset/confirm` with `{ token, password }` sets the new password and marks the token used. A wrong, expired, already used or non-reset token, or a token whose account is unconfirmed, answers 400 `Invalid or expired password reset token`.

Reset tokens are stored as a SHA-256 hash, so a database leak does not expose working links. Invitation tokens are stored as they are sent.

## Who can call what

`public` needs no token; `all` needs any valid token of a confirmed account.

| Route | Access |
|---|---|
| `POST /auth/login`, `POST /auth/password-reset`, `POST /auth/password-reset/confirm` | public |
| `POST /invitations/accept`, `POST /invitations/resend` | public |
| `GET /auth/check-token` | all |
| `GET /files/:uuid` and everything under `/public` | public |
| `GET /pictograms`, `/sign-writings`, `/terms` (list and `/:uuid`) | viewer, admin, super_admin |
| `POST`, `DELETE` on `/pictograms`, `/sign-writings`, `/terms` | admin, super_admin |
| All of `/boards`, `/phrases`, `/interaction-chains`, `/professions`, `/specialities` | admin, super_admin |
| All of `/users` (further limited by `canManageRole`) | admin, super_admin |
| `GET /roles`, `GET /roles/:id`, `GET /triage-steps`, `GET /triage-steps/:uuid` | admin, super_admin |
| `POST`, `PATCH`, `DELETE` on `/roles` and `/triage-steps` | super_admin |

The routers in `src/routers` are the source of truth; update this table when a route's roles change.
