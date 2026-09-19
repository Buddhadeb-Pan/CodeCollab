# CodeCollab Backend

Real-time collaborative code editor — Backend API.

## Tech Stack
- Node.js + Express
- PostgreSQL (Neon)
- JWT Authentication
- bcrypt for password hashing

## Setup

### Prerequisites
- Node.js v18+
- PostgreSQL database (Neon recommended)

### Installation

1. Clone the repository
2. Navigate to backend folder:
   cd backend
3. Install dependencies:
   npm install
4. Create ".env" file (copy from .env.example) and fill:
   - DATABASE_URL (from Neon)
   - JWT_SECRET (any random string)
5. Run development server:
   npm run dev

Server runs at http://localhost:5000

## API Endpoints

### Auth
- POST /api/auth/register — Register new user
- POST /api/auth/login    — Login user
- GET  /api/auth/me       — Get current user (protected)

### Request Example

POST /api/auth/register
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

Response (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "id": "...", "name": "John Doe", "email": "john@example.com" },
    "token": "eyJhbGciOi..."
  }
}
```

## Testing

Run automated auth tests:
```bash
npm run test:auth
```

(Make sure server is running in another terminal first)

## Scripts
- npm run dev       — Run with nodemon
- npm start         — Production start
- npm run test:auth — Test all auth endpoints
