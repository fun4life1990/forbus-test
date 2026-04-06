# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**All commands must be run inside the Docker container via `docker compose exec` or `docker compose run --rm`, never directly on the host.**

```bash
docker compose exec api npm run start:dev        # dev server with watch
docker compose exec api npm run build            # production build
docker compose exec api npm run lint:check       # ESLint (no auto-fix, max-warnings=0)
docker compose exec api npm run lint             # ESLint with auto-fix
docker compose exec api npm run format:check     # Prettier check
docker compose exec api npm run format           # Prettier auto-fix
docker compose exec api npm run test             # Jest unit tests
docker compose exec api npm run test:watch       # Jest watch mode
docker compose exec api npm run test:cov         # Jest with coverage
docker compose exec api npm run test:e2e         # E2E tests (test/jest-e2e.json)
```

TypeScript type-check without building: `docker compose exec api npx tsc --noEmit`

Swagger UI is available at `/api/docs` only when `NODE_ENV` is `local` or `dev`.

## Module Architecture

There are three kinds of modules. Mixing concerns between types is not allowed.

### Entity modules
Own a Mongoose schema, a basic CRUD service, and DTOs describing the shape of operations on that entity (create, update, filter). No controllers, gateways, or any other external-interface code. Exported so feature modules can consume them.

Examples: `user`, `client-user`, `admin-user`, `symbol`

### Feature modules
Contain business logic. May have controllers, gateways, job handlers, etc. Services in feature modules orchestrate calls to entity modules and service modules. A feature module **must never import another module that contains a controller** (the only exception is `AppModule`).

Feature modules without controllers are allowed when they serve as shared logic consumed by other feature modules.

Examples: `auth`, `user-management`, `symbol-management`

### Service modules
Proxies to external dependencies: third-party APIs, email delivery, sockets, file storage, etc. No business logic; no direct MongoDB access.

Examples: `auth-token`, `hash`

## DTO Conventions

**Entity modules** — DTOs live flat in `dto/` and describe the entity's operations:
- `create-<entity>.dto.ts`
- `update-<entity>.dto.ts` — typically `PartialType(Create…Dto)` from `@nestjs/swagger`
- `filter-<entity>.dto.ts` — query/filter shape

**Feature modules** — DTOs are split into:
- `dto/requests/` — incoming payloads
- `dto/responses/` — outgoing shapes (fields decorated with `@Expose()`)

**Reuse via inheritance**: prefer `PickType` over `OmitType`. Use `OmitType` only when you need to explicitly exclude a specific field (e.g. stripping `password` from a user DTO). Avoid bare spread or duplication.

## Response Serialization

Use the `@Serialize(DtoClass)` decorator from `src/utils/serialize.interceptor.ts` on controller methods. Only fields decorated with `@Expose()` in the DTO are returned. Relies on `class-transformer`'s `plainToInstance` with `excludeExtraneousValues: true`.

```typescript
@Get()
@Serialize(UserResponseDto)
getAll() { … }
```

## Error Handling

Services must **never** throw NestJS HTTP exceptions (`NotFoundException`, `ConflictException`, etc.). Throw custom plain errors from `src/error/`:

| File | Default status |
|------|---------------|
| `not-found.error.ts` | 404 |
| `conflict.error.ts` | 409 |
| `forbidden.error.ts` | 403 |

All extend `Error` with a `status: number` field. `BaseAppExceptionFilter` (registered globally in `main.ts`) reads `exception.status` and maps it to the HTTP response. Add new error classes here following the same pattern when new status codes are needed.

## Authentication & Guards

JWT tokens are stored in **HTTP-only cookies** (`access_token`, `refresh_token`), not `Authorization` headers.

Available guards (all from `auth-token`):
- `JwtAuthGuard` — validates access token cookie; use on any authenticated route
- `JwtRefreshAuthGuard` — validates refresh token cookie; only for `/auth/refresh`
- `PasswordAuthGuard` — local strategy (email + password); only for `/auth/login`

Admin-only enforcement: combine `JwtAuthGuard` + `AdminGuard`:
```typescript
@UseGuards(JwtAuthGuard, AdminGuard)
```

Get the current user inside a controller with `@CurrentUser(): JwtUserPayloadDto` (from `src/modules/auth/decorators/current-user.decorator.ts`).

## TTL / Cookie Expiry

JWT `expiresIn` values follow `SignOptions['expiresIn']` format — plain seconds (`"3600"`) **or** shorthand strings (`"60m"`, `"24h"`, `"7d"`). Convert to milliseconds for `cookie.maxAge` using `parseTtlToMs()` from `src/utils/parse-ttl.ts`. Never use `parseInt` directly on a TTL config value.

## User / Role Model

`User` is a Mongoose base schema with `discriminatorKey: 'role'`. `ClientUser` and `AdminUser` are discriminator sub-schemas registered inside `UserModule`. Always use the specific discriminator model (`ClientUser`, `AdminUser`) when creating users, and the base `User` model for cross-role queries (e.g. lookup by email in `UserService`).

## Seeder

A standalone NestJS CLI app (`src/seeder.ts`) using `nest-commander`. Run with:
```bash
docker compose exec api npx ts-node -r tsconfig-paths/register src/seeder.ts seed:users
```
Seeds the default admin user (`admin@admin.com`). Add new seed commands in `src/modules/user-seed/`.

## Environment Variables

Required:
```
DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
JWT_SECRET_KEY, JWT_REFRESH_SECRET_KEY
JWT_TTL, JWT_REFRESH_TTL   # e.g. "15m", "7d"
```
