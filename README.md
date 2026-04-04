# Backend NestJS Template

NestJS + TypeORM + PostgreSQL template.

## Local setup

### Prerequisites

- Docker & Docker Compose

### Steps

1. Copy the example env file and adjust values if needed:

```bash
cp .env.example .env
```

Default `.env` values work out of the box with `docker compose`.

2. Start the project:

```bash
docker compose up
```

This starts the API (port `3000`) and a PostgreSQL database (port `5432`). The API container runs `npm install`, cleans `dist/`, and starts in watch mode with the debugger on port `9229`.

3. Apply migrations:

```bash
docker compose exec api npm run migration:run
```

### Available commands (inside the container)

```bash
docker compose exec api <command>
```

| Command | Description |
|---|---|
| `npm run start:dev` | Start in watch mode |
| `npm run start:debug` | Start with debugger on `0.0.0.0:9229` |
| `npm run build` | Compile TypeScript |
| `npm run lint` | Lint and auto-fix |
| `npm run lint:check` | Lint without auto-fix |
| `npm run test` | Run unit tests |
| `npm run test:cov` | Run unit tests with coverage |
| `npm run test:e2e` | Run e2e tests |

---

## Migrations

Migrations are located in `src/database/migrations/`. TypeORM CLI operates on compiled files in `dist/`, so run `npm run build` before any migration command.

### Run migrations

```bash
npm run migration:run
```

### Revert the last migration

```bash
npm run migration:revert
```

### Generate a migration from entity changes

```bash
npm run migration:generate -- <MigrationName>
```

Example:

```bash
npm run migration:generate -- CreateUserTable
```

The generated file will be placed in `src/database/migrations/`.

### Create an empty migration

```bash
npm run migration:create -- <MigrationName>
```

---

## Seeds

Seeds are located in `src/database/seeds/` and use [typeorm-extension](https://github.com/tada5hi/typeorm-extension). Seeds operate on compiled files in `dist/`, so run `npm run build` first.

### Run all seeds

```bash
npm run seed:run
```

### Create a new seed file

```bash
npm run seed:create -- <SeedName>
```

Example:

```bash
npm run seed:create -- UserSeeder
```

The file will be created in `src/database/seeds/`.
