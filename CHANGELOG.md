# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). The API, the dashboard and the app share version numbers.

## [Unreleased]

## [0.1.0]

The first tagged release, summarising what the API offers today.

### Added

- **Accounts and access:** JWT login, three roles (`super_admin`, `admin`, `viewer`) with per-route checks and rules on who may manage whom, accounts created by admins and confirmed through an emailed invitation (accept and resend), and password reset by email with single-use, short-lived tokens.
- **Content library:** upload and serve pictograms and SignWriting images, with file types detected from the bytes; terms pairing one pictogram with one SignWriting.
- **Boards:** create, edit, order terms, publish and unpublish boards of type common or emergency, each with a representative pictogram and an author.
- **Phrases:** ready-made phrases built from ordered terms, publishable and optionally hidden from the app's library.
- **Interaction chains:** ranked board recommendations triggered by a board or a phrase.
- **Triage steps:** the five Quick Emergency levels, each holding one emergency board.
- **Professions and specialities** for the app's consultation flow.
- **Public routes** under `/public` for the app to read published content without logging in.
- **Lists:** every list endpoint is paginated (`page`, `pageSize`) and searchable (`q`), ignoring accents.
- **Seeds** for roles, the initial super admin, terms, boards, phrases, interaction chains, triage steps and professions.
- **Tests:** a Jest unit suite and a Postgres-backed integration suite covering login, password reset and invitations.
- **Documentation** in `docs/`: architecture, database, authentication and the project glossary.

[Unreleased]: https://github.com/PET-Saude-GAT-4/comunicacao-inclusiva-api/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/PET-Saude-GAT-4/comunicacao-inclusiva-api/releases/tag/v0.1.0
