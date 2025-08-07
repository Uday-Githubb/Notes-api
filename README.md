# Notes API (Express + MongoDB)

Production-ready backend for a Notes App showcasing JWT auth, user data isolation, pagination, Swagger docs, rate limiting, Docker, and CI.

## Tech Stack
- Node.js (Express)
- MongoDB / Mongoose
- JWT auth (bcryptjs)
- Jest + Supertest (>=90% coverage target)
- Swagger (OpenAPI) at /api-docs
- Rate limiting (100 reqs / 15 mins)
- Dockerfile
- GitHub Actions CI
- Optional Redis caching for GET /notes (if REDIS_URL provided)

## Project Structure
```
backend/
  src/
    controllers/   # Route handlers
    models/        # Mongoose schemas
    routes/        # Express routers
    middleware/    # Auth & error middleware
    config/        # DB connection & env vars
    utils/         # Helpers & caching
    docs/          # OpenAPI spec
    app.js         # App setup
    server.js      # Bootstrap server
  tests/           # Jest + Supertest
  Dockerfile
  package.json
```

## Getting Started (Local)
1) Install deps
```
cd backend
npm ci
```
2) Create .env
```
cp .env.example .env
# set MONGO_URI and JWT_SECRET
```
3) Run dev server
```
npm run dev
```
4) Swagger docs
- http://localhost:3000/api-docs

## Testing
```
cd backend
npm test
# or with coverage
npm run coverage
```
Tests run against an in-memory MongoDB (mongodb-memory-server).

## Docker
```
cd backend
docker build -t notes-api .
docker run -p 3000:3000 --env-file .env notes-api
```

## API Quickstart
- POST /api/auth/signup { email, password }
- POST /api/auth/login { email, password }
- Auth header: Authorization: Bearer <token>
- Notes:
  - POST /api/notes { title, content }
  - GET /api/notes?page=1&limit=10
  - GET /api/notes/:id
  - PUT /api/notes/:id { title?, content? }
  - DELETE /api/notes/:id

## CI
GitHub Actions runs on push/PR and uploads coverage artifacts.

## Bonus: Redis Caching
If REDIS_URL is set, GET /notes will cache per-user/page/limit for 60s and auto-invalidate on write operations.
