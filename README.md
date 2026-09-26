# CodeCollab ⌘

> Real-time collaborative code editor with code execution, chat, and presence.
> Built for pair programming, mentoring, and technical interviews.

**Live Demo:** [https://code-collab-eta-henna.vercel.app](https://code-collab-eta-henna.vercel.app)

---

## ✨ Features

- **Real-time code sync** — Multiple users edit the same file simultaneously with <100ms latency
- **Multi-language execution** — Run JavaScript, Python, C++, and Java directly in the browser
- **Live chat** — Message your collaborators with typing indicators
- **Cursor tracking** — See exactly where each user is typing
- **User presence** — Real-time list of online users
- **Room system** — Create rooms with unique 6-character codes
- **Secure auth** — JWT-based authentication with bcrypt password hashing
- **Rate limiting** — Protection against abuse (200 req/15min general, 20 req/15min auth, 50 req/15min execute)
- **XSS protection** — Input sanitization across all user inputs
- **Mobile responsive** — Works on desktop, tablet, and mobile
- **Unique design system** — "The Blueprint" — engineering-inspired UI with monospace typography and amber accents

---

## 🏗️ Architecture

CodeCollab uses a modern client-server architecture with dual communication channels: **REST API** for stateless transactional actions (authentication, room management, isolated code execution) and **WebSockets (Socket.io)** for real-time bi-directional synchronization (code changes, cursor positions, chat messages, and user presence).

```
                      ┌────────────────────────────────────────┐
                      │          Browser Clients (Web)         │
                      │  React 18 + Vite + Monaco Editor       │
                      │  Socket.io-Client + Axios + Tailwind   │
                      └──────────────┬──────────────────┬──────┘
                                     │                  │
                REST HTTP / JSON     │                  │  WebSockets (WSS)
              (Auth, Rooms, Run)     │                  │  (Sync, Chat, Cursor)
                                     ▼                  ▼
                      ┌────────────────────────────────────────┐
                      │          Node.js / Express Server      │
                      │                                        │
                      │  ├── Helmet + Rate Limiters            │
                      │  ├── JWT Auth & Validation Middleware  │
                      │  ├── REST API Controllers              │
                      │  └── Socket.io Real-time Hub           │
                      └──────────────┬──────────────────┬──────┘
                                     │                  │
               SQL Pool Queries      │                  │  Sandboxed Compile API
            (SSL Connection Pool)    │                  │  (Node 20, Python 3.12,
                                     ▼                  │   GCC 13, OpenJDK 22)
                      ┌────────────────────────┐        ▼
                      │  PostgreSQL (Neon)     │ ┌────────────────────────┐
                      │  - users table         │ │  Wandbox API Engine    │
                      │  - rooms table         │ │  Isolated Code Runner  │
                      └────────────────────────┘ └────────────────────────┘
```

### Real-Time Synchronization Protocol

1. **Room Handshake**: When a user enters a room, the client emits `join-room`. The server registers the socket, adds the user to the active room set, and responds with:
   - `code-snapshot`: Current buffer content and active programming language.
   - `chat-history`: The last 100 room messages.
   - `room-users`: Broadcast of all currently connected peers in the room.
2. **Operational Sync**:
   - `code-change` events are forwarded to all peers in the room as `code-update`.
   - `cursor-move` broadcasts cursor line and column coordinates to render peer cursor indicators in Monaco Editor.
   - `typing-start` and `typing-stop` events provide real-time chat typing state.
3. **Execution Relay**:
   - When a peer triggers code execution, the output and execution status can be synced via `output-update`.
4. **Presence Lifecycle**:
   - Disconnections or explicit `leave-room` triggers an automated cleanup that reconciles the room's active users list and broadcasts updated presence to remaining members.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Editor**: [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react) (VS Code's editor engine)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) customized with "The Blueprint" engineering design system
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Real-Time**: [Socket.io-client](https://socket.io/)
- **HTTP Client**: [Axios](https://axios-http.com/) with request/response interceptors & global error handling
- **Notifications**: [react-hot-toast](https://react-hot-toast.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (v18+)
- **Framework**: [Express 4](https://expressjs.com/)
- **WebSockets**: [Socket.io](https://socket.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Serverless instance on [Neon](https://neon.tech/)) with `pg` connection pool
- **Security**: [Helmet](https://helmetjs.github.io/), [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit), [bcryptjs](https://github.com/dcodeIO/bcrypt.js), [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- **Async Handling**: `express-async-errors`

### Code Execution Engine
- **Engine**: [Wandbox REST API](https://wandbox.org/)
- **Supported Languages & Compilers**:
  - **JavaScript**: Node.js `20.17.0`
  - **Python**: CPython `3.12.7`
  - **C++**: GCC `13.2.0` (with `warning,gnu++2b` options)
  - **Java**: OpenJDK `22+36` (with automatic `public class` re-scoping)

### Deployment & Hosting
- **Frontend**: [Vercel](https://vercel.com/)
- **Backend**: [Render](https://render.com/)
- **Database**: [Neon Database](https://neon.tech/)

---

## 📂 Project Structure

```text
CodeCollab/
├── README.md                           # Master Project Documentation
├── backend/                            # Express & Socket.io Backend
│   ├── server.js                       # Express HTTP & WebSocket entrypoint
│   ├── package.json
│   ├── .env.example                    # Sample environment configurations
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                   # PostgreSQL Neon pool connection
│   │   ├── controllers/
│   │   │   ├── authController.js       # Register, login, getMe handlers
│   │   │   ├── executeController.js    # Wandbox code execution & sanitizer
│   │   │   └── roomController.js       # Room CRUD & code generators
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js       # JWT bearer token verification
│   │   │   ├── errorMiddleware.js      # 404 & centralized error handler
│   │   │   └── validateInput.js        # Input validation sanitization
│   │   ├── models/
│   │   │   ├── roomModel.js            # SQL queries for rooms
│   │   │   └── userModel.js            # SQL queries for users
│   │   ├── routes/
│   │   │   ├── authRoutes.js           # /api/auth routes
│   │   │   ├── executeRoutes.js        # /api/execute route
│   │   │   └── roomRoutes.js           # /api/rooms routes
│   │   ├── socket/
│   │   │   └── index.js                # Socket.io room & event handlers
│   │   └── utils/
│   │       ├── generateRoomCode.js     # 6-character nanoid generator
│   │       └── generateToken.js        # JWT signer utility
│   └── test-*.js                       # Automated verification test suites
│
└── frontend/                           # React + Vite Client Application
    ├── index.html                      # HTML template with JetBrains Mono & Inter
    ├── vite.config.js
    ├── tailwind.config.js              # "The Blueprint" color tokens & font configs
    ├── package.json
    ├── .env.example
    └── src/
        ├── main.jsx                    # React DOM entry point
        ├── App.jsx                     # Route definitions & AuthProvider
        ├── index.css                   # Global styles & grid backgrounds
        ├── components/
        │   ├── Button.jsx              # Blueprint styled button with brackets
        │   ├── Card.jsx                # Engineering card container
        │   ├── ChatPanel.jsx           # Real-time room chat with typing indicator
        │   ├── CodeEditor.jsx          # Monaco editor integration with language sync
        │   ├── CreateRoomModal.jsx     # Modal for creating collaborative rooms
        │   ├── ErrorBoundary.jsx       # Global React error boundary
        │   ├── Input.jsx               # Monospace input element with labels
        │   ├── JoinRoomCard.jsx        # Direct room join card
        │   ├── LoadingSpinner.jsx      # Technical loading indicator
        │   ├── Navbar.jsx              # App header with session controls
        │   ├── OutputPanel.jsx         # Execution output console & terminal feed
        │   ├── RoomCard.jsx            # Dashboard room listing card
        │   ├── RoomCardSkeleton.jsx    # Skeleton loader for dashboard
        │   ├── RunButton.jsx           # Compile & execute trigger button
        │   ├── SectionLabel.jsx        # Code-comment styled section headers
        │   └── UserList.jsx            # Active peers presence list
        ├── context/
        │   └── AuthContext.jsx         # Authentication state & persistent session
        ├── hooks/
        │   └── useSocket.js            # Custom React hook for room socket events
        ├── pages/
        │   ├── Home.jsx                # Landing page showcasing features & demo
        │   ├── Login.jsx               # User authentication login view
        │   ├── Register.jsx            # User sign-up view
        │   ├── Dashboard.jsx           # Room creation, joining, & management
        │   └── Room.jsx                # Real-time collaborative IDE workspace
        ├── routes/
        │   └── ProtectedRoute.jsx      # Route guard requiring authenticated user
        ├── services/
        │   ├── api.js                  # Axios client with interceptors
        │   └── socket.js               # Socket.io client instance
        └── utils/
            └── formatDate.js          # Relative time formatting helper
```

---

## 🔌 WebSocket Events Reference

| Event Name | Direction | Payload Example | Description |
| :--- | :--- | :--- | :--- |
| `join-room` | Client ➔ Server | `{ roomCode: "A1B2C3", user: { id, name } }` | Join room socket channel and register presence |
| `code-snapshot` | Server ➔ Client | `{ code: "console.log('hi');", language: "javascript" }` | Emitted to newcomer with current editor state |
| `chat-history` | Server ➔ Client | `[ { id, userId, name, text, timestamp } ]` | Sends last 100 messages to joined client |
| `room-users` | Server ➔ Broadcast | `[ { id, userId, name, joinedAt } ]` | Broadcasts current active online room members |
| `code-init` | Client ➔ Server | `{ roomCode, code, language }` | Sets initial room code if not yet initialized |
| `code-change` | Client ➔ Server | `{ roomCode, code, language }` | Dispatched by user as they type in Monaco editor |
| `code-update` | Server ➔ Broadcast | `{ code, language }` | Broadcast to all room peers excluding the sender |
| `cursor-move` | Client ➔ Server | `{ roomCode, position: { lineNumber, column } }` | Transmits current cursor position |
| `cursor-update` | Server ➔ Broadcast | `{ userId, name, position }` | Updates peer cursor marker position in editor |
| `typing-start` | Client ➔ Server | `{ roomCode }` | Indicates user started typing in chat |
| `user-typing` | Server ➔ Broadcast | `{ userId, name }` | Displays peer typing indicator banner |
| `typing-stop` | Client ➔ Server | `{ roomCode }` | Indicates user stopped typing or cleared input |
| `user-stop-typing` | Server ➔ Broadcast | `{ userId }` | Clears peer typing indicator |
| `chat-message` | Bi-directional | `{ roomCode, text }` / `{ id, userId, name, text, timestamp }` | Sanitized chat messaging within the room |
| `output-update` | Bi-directional | `{ roomCode, output }` / `{ output, by, at }` | Synchronizes code execution output among peers |
| `leave-room` | Client ➔ Server | `void` | Gracefully removes user from room presence |

---

## 📡 REST API Reference

Base URL: `http://localhost:5000` (or `https://codecollab-backend-50x2.onrender.com`)

### 1. Authentication (`/api/auth`)

#### Register User
- **Method**: `POST /api/auth/register`
- **Rate Limit**: 20 requests / 15 minutes
- **Request Body**:
```json
{
  "name": "Linus Torvalds",
  "email": "linus@example.com",
  "password": "password123"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "1",
      "name": "Linus Torvalds",
      "email": "linus@example.com",
      "created_at": "2026-09-26T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User
- **Method**: `POST /api/auth/login`
- **Rate Limit**: 20 requests / 15 minutes
- **Request Body**:
```json
{
  "email": "linus@example.com",
  "password": "password123"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "1",
      "name": "Linus Torvalds",
      "email": "linus@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Current User
- **Method**: `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "name": "Linus Torvalds",
      "email": "linus@example.com",
      "created_at": "2026-09-26T10:00:00.000Z"
    }
  }
}
```

---

### 2. Room Management (`/api/rooms`)
*All room routes require `Authorization: Bearer <TOKEN>` header.*

#### Create Room
- **Method**: `POST /api/rooms`
- **Request Body**:
```json
{
  "name": "Frontend Pair Session",
  "language": "javascript"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Room created successfully",
  "data": {
    "id": 4,
    "code": "A9X2M1",
    "name": "Frontend Pair Session",
    "language": "javascript",
    "owner_id": 1,
    "created_at": "2026-09-26T10:00:00.000Z"
  }
}
```

#### Get My Rooms
- **Method**: `GET /api/rooms/my`
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 4,
      "code": "A9X2M1",
      "name": "Frontend Pair Session",
      "language": "javascript",
      "owner_id": 1,
      "created_at": "2026-09-26T10:00:00.000Z"
    }
  ]
}
```

#### Get Room by Code
- **Method**: `GET /api/rooms/:code`
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": 4,
    "code": "A9X2M1",
    "name": "Frontend Pair Session",
    "language": "javascript",
    "owner_id": 1,
    "owner_name": "Linus Torvalds",
    "owner_email": "linus@example.com",
    "created_at": "2026-09-26T10:00:00.000Z"
  }
}
```

#### Delete Room
- **Method**: `DELETE /api/rooms/:id`
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Room deleted successfully"
}
```

---

### 3. Code Execution (`/api/execute`)
*Requires `Authorization: Bearer <TOKEN>` header.*

#### Execute Code
- **Method**: `POST /api/execute`
- **Rate Limit**: 50 executions / 15 minutes
- **Request Body**:
```json
{
  "code": "console.log('Hello, CodeCollab!');",
  "language": "javascript",
  "stdin": ""
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "stdout": "Hello, CodeCollab!\n",
    "stderr": "",
    "exitCode": 0,
    "signal": null,
    "duration": 348,
    "hasError": false,
    "language": "javascript"
  }
}
```

---

## 🗄️ Database Schema

PostgreSQL tables hosted on Neon Serverless Postgres:

```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Rooms Table
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    language VARCHAR(50) DEFAULT 'javascript',
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for high-frequency queries
CREATE INDEX idx_rooms_code ON rooms(code);
CREATE INDEX idx_rooms_owner_id ON rooms(owner_id);
```

---

## 🎨 Design System — "The Blueprint"

CodeCollab is styled with **The Blueprint**, a custom engineering design aesthetic inspired by architectural drawings, technical terminals, and developer tooling:

- **Palette**:
  - `midnight navy` (`#0a0e1a`) — Deep primary canvas background
  - `surface navy` (`#111827` / `#161e2e`) — Component surfaces and panels
  - `blueprint line` (`#1e293b`) — Architectural borders and grid guides
  - `amber accent` (`#f59e0b`) — Primary highlights, focus rings, and action states
  - `cream text` (`#f5f0e8`) — High-contrast, legible typography
  - `muted slate` (`#64748b`) — Secondary metadata and commentary
- **Typography**:
  - `JetBrains Mono` — Monospace typography for headlines, room codes, buttons, logs, and code labels
  - `Inter` — Crisp, legible grotesque sans-serif for UI body text
- **Component Affordances**:
  - Bracket-style buttons: `[ ▶ run_code ]`, `[ ＋ create_room ]`, `[ ✕ leave_room ]`
  - Code-comment section headers: `// 01. real-time sync`, `// active_peers`
  - Architectural blueprint grid background pattern

---

## 🛡️ Security Hardening

CodeCollab applies defense-in-depth principles across the entire stack:

1. **Tiered Rate Limiting**:
   - `generalLimiter`: 200 requests per 15 minutes per IP.
   - `authLimiter`: 20 attempts per 15 minutes per IP (guards against brute-force login and registration spam).
   - `executeLimiter`: 50 executions per 15 minutes per IP (protects remote compiler throughput).
2. **HTTP Security Headers**:
   - Helmet protection enforcing hardened HTTP response headers and cross-origin resource policy.
3. **XSS & Input Sanitization**:
   - Socket chat messages are stripped of HTML tags, trimmed, and length-restricted to 500 characters.
   - Text inputs across client and server are sanitized.
4. **Code Execution Guardrails**:
   - Rejection of payloads exceeding 50,000 characters.
   - Regex blocklist for obvious infinite loop vectors (e.g. `while(true)`, `for(;;)`).
   - Strict 30-second execution timeout with `ECONNABORTED` handling.
5. **Authentication & Password Protection**:
   - Password salting and hashing with bcrypt (10 rounds).
   - Cryptographically signed JWT tokens with 7-day expiration.

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- [npm](https://www.npmjs.com/) v9 or later
- A [Neon PostgreSQL](https://neon.tech/) database (or local PostgreSQL instance)

### 1. Clone the Repository
```bash
git clone https://github.com/Buddhadeb-Pan/CodeCollab.git
cd CodeCollab
```

### 2. Configure & Start Backend
```bash
cd backend

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env
```

Edit `backend/.env` with your credentials:
```env
PORT=5000
DATABASE_URL=postgresql://neondb_owner:password@ep-sample.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Start the backend server:
```bash
# Development mode with nodemon
npm run dev

# Or production start
npm start
```
*Backend runs at `http://localhost:5000`.*

### 3. Configure & Start Frontend
In a new terminal window:
```bash
cd frontend

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

Start Vite development server:
```bash
npm run dev
```
*Frontend runs at `http://localhost:5173`.*

---

## 🧪 Testing

The repository contains automated test scripts to verify backend endpoints:

```bash
cd backend

# Ensure backend server is running in another terminal, then run:
npm run test:auth      # Verifies registration, login, and auth token validation
node test-rooms.js     # Verifies room creation, retrieval, and code generation
node test-execute.js   # Verifies multi-language Wandbox code execution
```

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
