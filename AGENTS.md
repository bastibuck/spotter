# Agent Instructions

## Project Overview

This is a **Spotter** - a Next.js 16 application for wind alerts/surf spot notifications. It uses:

- Next.js 16 with App Router
- TypeScript with strict mode
- React 19
- tRPC for type-safe APIs
- Drizzle ORM with PostgreSQL
- NextAuth.js for authentication
- Resend + React Email for emails
- Tailwind CSS v4
- Zod v4 for validation

## Build/Lint/Test Commands

```bash
# Development
npm run dev                    # Start dev server with Turbopack
npm run build                  # Production build
npm run start                  # Start production server

# Linting & Type Checking
npm run lint                   # Run ESLint
npm run tsc:check             # TypeScript check (no emit)

# Formatting
npm run format:check          # Check formatting
npm run format:fix            # Fix formatting with Prettier

# Database
npm run db:generate           # Generate Drizzle migrations
npm run db:migrate            # Run migrations
npm run db:push               # Push schema changes
npm run db:studio             # Open Drizzle Studio

# Email Development
npm run email:dev             # Start React Email dev server
```

## Code Style Guidelines

### Imports

- **Order**: React/Next → External libs → Internal (`~/` alias) → Relative
- Use `import type { ... }` for type-only imports
- Path alias: `~/` maps to `./src/`
- Group imports by source with blank lines between

### Formatting

- Use **Prettier** with Tailwind plugin (automatic class sorting)
- 2-space indentation
- Single quotes
- Semicolons required
- Trailing commas: always

### Types

- Strict TypeScript mode enabled
- Enable `noUncheckedIndexedAccess` - always check for undefined
- Prefer explicit return types on exported functions
- Use `const` assertions for literal types

### Naming Conventions

- **Components**: PascalCase (e.g., `SubscribeForm.tsx`)
- **Files**: camelCase or kebab-case
- **Database tables**: camelCase in code, snake_case in DB via `createTable`
- **Environment variables**: SCREAMING_SNAKE_CASE
- **Zod schemas**: camelCase with Schema suffix (optional)

### Error Handling

- Use TRPCError in tRPC routers with appropriate codes:
  - `NOT_FOUND` - Resources not found
  - `INTERNAL_SERVER_ERROR` - Unexpected errors
  - `CONFLICT` - Duplicate resources
  - `SERVICE_UNAVAILABLE` - External service failures
  - `TOO_MANY_REQUESTS` - Rate limiting
- Always check for `undefined` before using optional values
- Use `.catch()` with specific error handling in async operations

### Database (Drizzle)

- Use `createTable` helper for table names (adds `spotter_` prefix)
- Define relations for all tables with foreign keys
- Use indexes on frequently queried columns
- Timestamps: `createdAt` (default now), `updatedAt` ($onUpdate)
- Column types: prefer `varchar({ length: n })` over `text()` for short strings

### API (tRPC)

- Use `publicProcedure` for unauthenticated endpoints
- Use `protectedProcedure` for authenticated endpoints (requires session)
- Validate all inputs with Zod v4 schemas
- Use `z.email()`, `z.uuid()` instead of `z.string().email()` etc.
- Chain `.toLowerCase()` for email normalization

### Environment Variables

- Define in `src/env.js` with Zod validation
- Server-only vars: no `NEXT_PUBLIC_` prefix
- Client vars: must use `NEXT_PUBLIC_` prefix
- Add to both `server:` or `client:` AND `runtimeEnv:`

### Components

- Use functional components with explicit props interfaces
- Prefer early returns over nested conditionals
- Extract complex JSX into separate components
- Server Components by default, add `'use client'` when needed

### Email Templates

- Located in `/emails/` directory
- Use React Email components from `@react-email/components`
- Always include `<Html>`, `<Head>`, `<Preview>`, `<Body>`
- Use inline styles (Tailwind classes don't work reliably in emails)

**Shared Components** (`src/components/emails/`):

- `Header` - Logo + app name header
- `Footer` / `FooterBase` - Footer with unsubscribe links
- `ContentSection` - Padded container wrapper
- `HeroSection` - Prominent header with label/title/subtitle
- `PrimaryButton` - Gradient CTA button
- `Table` - Key-value data display
- `styles.ts` - Centralized colors and shared style objects

**Usage pattern:**

```tsx
import {
  ContentSection,
  Footer,
  Header,
  colors,
  main,
  heading,
} from "~/components/emails";
```

**Icon assets:**

- Use `icon-32.png` for email images (located in `/public/`)
- Reference via `${baseUrl}/icon-32.png` where `baseUrl = getBaseUrl()`

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (spots)/           # Route groups
│   └── layout.tsx         # Root layout
├── server/                # Server-only code
│   ├── api/              # tRPC routers
│   ├── auth.ts           # NextAuth config
│   └── db/               # Drizzle schema & client
├── trpc/                 # tRPC client setup
├── lib/                  # Utility functions
└── styles/               # Global CSS

emails/                   # React Email templates
```

## Key Dependencies

- **Next.js 16** - React framework
- **Drizzle ORM 0.45** - Database ORM
- **tRPC 11** - Type-safe API
- **Zod 4** - Schema validation
- **React Email 5** - Email templates
- **Resend 6** - Email delivery
- **Tailwind CSS 4** - Styling

## Pre-commit Checklist

1. Run `npm run tsc:check` - TypeScript must pass
2. Run `npm run lint` - ESLint must pass
3. Run `npm run format:check` - Prettier must pass
4. Build succeeds: `npm run build`

## Security

- Never commit `.env` files
- Use `server-only` import for server-only modules
- Validate all user inputs with Zod
- Use parameterized queries (Drizzle handles this)
- Check authentication in protected procedures

## Updating This File

**IMPORTANT:** This AGENTS.md file is a living document. As an agent working on this codebase:

1. **Update when you learn something new** - If you discover new patterns, configuration details, or important project-specific information, add it here
2. **Update when major changes occur** - If you upgrade dependencies, change tooling, or refactor architecture, reflect those changes here
3. **Update when you fix gotchas** - If you encounter and resolve tricky issues (circular dependencies, special config requirements, etc.), document them
4. **Keep conventions current** - If code style or patterns evolve, update the relevant sections

**How to update:**

- Add new sections for major new topics
- Append to or update existing sections for related learnings
- Use clear, concise language
- Include code examples where helpful

This ensures future agents (and future you) have the most accurate and helpful context.
