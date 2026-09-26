# CodeCollab Backend ⌘

Real-time collaborative code editor — Backend API and WebSocket Engine.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express 4
- **Real-Time Communication**: Socket.io 4
- **Database**: PostgreSQL (Neon Serverless) via `pg` connection pooling
- **Authentication**: JWT (`jsonwebtoken`) with `bcryptjs` password hashing (10 salt rounds)
- **Security & Protection**:
  - `helmet` — HTTP header hardening
  - `express-rate-limit` — Tiered abuse prevention (General, Auth, Execute)
  - `cors` — Cross-origin resource sharing
- **Code Execution**: Wandbox REST API integration via `axios`
- **Error Handling**: `express-async-errors` with centralized error handling middleware

---

## 🚀 Setup Instructions

### 1. Prerequisites
- Node.js v18+ installed
- PostgreSQL database (Recommended: [Neon](https://neon.tech/))

### 2. Installation
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure your `.env` variables:
```env
PORT=5000
DATABASE_URL=postgresql://neondb_owner:your_password@ep-sample.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 4. Database Setup
Execute the following SQL schema in your PostgreSQL console (e.g. Neon SQL Editor) to create the necessary tables and indexes:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    language VARCHAR(50) DEFAULT 'javascript',
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_rooms_code ON rooms(code);
CREATE INDEX IF NOT EXISTS idx_rooms_owner_id ON rooms(owner_id);
```

### 5. Run Server

**Development Mode** (with nodemon auto-reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

The API will be accessible at `http://localhost:5000`.

---

## 🗄️ Database Schema

### Users Table (`users`)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | Unique user identifier |
| `name` | `VARCHAR(255)` | `NOT NULL` | Display name |
| `email` | `VARCHAR(255)` | `UNIQUE, NOT NULL` | Login email address |
| `password` | `VARCHAR(255)` | `NOT NULL` | Bcrypt hashed password |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Account creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Record update timestamp |

### Rooms Table (`rooms`)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | Unique room identifier |
| `code` | `VARCHAR(10)` | `UNIQUE, NOT NULL` | Unique 6-character room code |
| `name` | `VARCHAR(255)` | `NOT NULL` | Room title/purpose |
| `language` | `VARCHAR(50)` | `DEFAULT 'javascript'` | Active programming language |
| `owner_id` | `INTEGER` | `REFERENCES users(id) ON DELETE CASCADE` | Creator user ID |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Room creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Record update timestamp |

---

## 📜 Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `nodemon server.js` | Starts server with automatic file reload on changes |
| `npm start` | `node server.js` | Starts server in production mode |
| `npm run test:auth` | `node test-auth.js` | Runs automated register, login, and `/me` tests |
| `npm run test:rooms` | `node test-rooms.js` | Tests room creation, code generation, and query logic |
| `npm run test:execute` | `node test-execute.js` | Tests code execution across JavaScript, Python, C++, and Java |
| `npm run test:all` | `node test-all.js` | Runs all 3 test suites sequentially |

*(Make sure your backend server is running in a separate terminal before executing test scripts).*

---

## 📖 API Documentation

For the complete REST endpoint reference, request/response examples, rate limits, and WebSocket event specifications, see:

👉 **[API Documentation](../docs/API.md)**
