# Genius Online Navigator Backend

## Endpoints
- `/teams/` (CRUD, multi-tenancy, admin actions)
- `/organizations/` (CRUD)
- `/notifications/` (CRUD)
- `/auth/` (register, login, password reset)

## Setup
- Environment variables: SUPABASE_URL, SUPABASE_KEY, etc.
- Run: `uvicorn backend.main:app --reload`
- Test: `pytest`

## Edge Functions
- Deploy with Supabase CLI
- Ensure DB triggers are set up

## Security
- Use Bearer tokens for all endpoints
- Admin role required for sensitive actions
