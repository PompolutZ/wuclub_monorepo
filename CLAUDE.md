## Project Overview

This is a pnpm monorepo for Wunderworlds Club, a web application for the Warhammer Underworlds community. The project consists of:
- A React frontend (Vite + React 18)
- A Hono-based API backend deployed to AWS Lambda
- Shared schema definitions and utilities
- A parser tool for processing game data

## Repository Structure

The monorepo is organized into:
- `apps/` - Main applications
  - `frontend_v2/` - React frontend with Vite
  - `apiv2/` - Hono API backend with AWS CDK infrastructure
  - `parser/` - TSV parser for game data
- `packages/` - Shared packages
  - `schema/` - Zod schemas shared between frontend and backend
  - `eslint-config/` - Shared ESLint configuration
  - `prettier-config/` - Shared Prettier configuration
- `shared/` - Shared utilities and constants

## Development Commands

### Root Level
```bash
pnpm install                    # Install all dependencies
```

### Frontend (apps/frontend_v2)
```bash
cd apps/frontend_v2
pnpm dev                        # Start Vite dev server
pnpm build                      # Build for production
pnpm serve                      # Preview production build
pnpm lint                       # Run ESLint (quiet mode)
pnpm lint:fix                   # Run ESLint with auto-fix
```

### API (apps/apiv2)
```bash
cd apps/apiv2
pnpm dev                        # Start local dev server with tsx watch (uses .env file)
pnpm tsc                        # Type check
pnpm lint                       # Run ESLint on src/ and infra/
pnpm lint:fix                   # Run ESLint with auto-fix
pnpm build:client               # Build API client types and copy to frontend
pnpm cdk:deploy                 # Deploy to AWS (requires AWS credentials)
```

### Parser (apps/parser)
```bash
cd apps/parser
pnpm wudb                       # Parse UnderworldsDB.tsv and generate TypeScript files
```

## Architecture & Key Patterns

### Type-Safe API Communication

The backend uses Hono with RPC-style type sharing:
- API routes are defined in `apps/apiv2/src/app/routes/`
- The main app exports `AppRoutes` type from `apps/apiv2/src/app/index.ts`
- Run `pnpm build:client` in apiv2 to generate TypeScript definitions
- The generated types are copied to `apps/frontend_v2/src/services/app.ts`
- Frontend uses Hono client with full type safety for API calls

### Schema Sharing

The `@fxdxpz/schema` package contains Zod schemas used by both frontend and backend:
- Located in `packages/schema/src/`
- Exports schemas for factions, decks, plots, and formats
- Ensures consistent validation across the stack

### Frontend Architecture

The React app uses:
- React Router v5 for routing (see `apps/frontend_v2/src/main.jsx`)
- React Query (TanStack Query) for server state with persistence
- Firebase for authentication
- Dexie for IndexedDB storage
- Tailwind CSS for styling
- Path aliases configured in `vite.config.ts`:
  - `@/` → `src/`
  - `@icons/` → `src/svgs/`
  - `@components/` → `src/shared/components/`
  - `@wudb/` → `src/data/wudb/`
  - `@services/` → `src/services/`

### Backend Architecture

The API uses:
- Hono web framework with middleware (CORS, logger)
- MongoDB for persistence
- Firebase Admin SDK for authentication
- Data Access Layer (DAL) in `apps/apiv2/src/dal/`
- Route handlers in `apps/apiv2/src/app/routes/`
- AWS Lambda deployment via CDK (infrastructure in `apps/apiv2/infra/`)

### Data Flow: Parser → Frontend

The parser tool:
1. Reads TSV files from `apps/parser/sheets/`
2. Parses and transforms game data
3. Generates TypeScript constant files in `apps/parser/dist/`
4. Files should be manually copied to `apps/frontend_v2/src/db/` (via `pnpm db:copy` - note: path may need updating)

## AWS Deployment

The API is deployed to AWS Lambda using CDK:
- Infrastructure code in `apps/apiv2/infra/index.ts`
- Required environment variables (set in `.env` for local, Lambda env for production):
  - `DATABASE_NAME`
  - `DB_PASSWORD`
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY`
  - `FIREBASE_DATABASE_URL`
- Deploy with `pnpm cdk:deploy` from the apiv2 directory

## Important Workflows

### Verifying Refactoring and New Implementations
When implementing new features or refactoring based on a plan, ALWAYS verify changes with:
```bash
# run prettier and check eslint with one command
pnpm lint:fix

# Build the project
pnpm build                      # Ensure production build succeeds
```

All three steps must succeed before considering the work complete. If any step fails, fix the issues before proceeding.

## Firebase Integration

Both frontend and backend use Firebase:
- Frontend: Firebase JS SDK for client authentication (`apps/frontend_v2/src/firebase/`)
- Backend: Firebase Admin SDK for token verification
- Auth context provider in `apps/frontend_v2/src/hooks/useAuthUser`

## Using Typescript
Always prefer types over interfaces, unless required functionality requires interface specific implementation. In that case always confirm and explain why interface is better or only possible option.
