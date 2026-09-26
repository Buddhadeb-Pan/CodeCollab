# CodeCollab API Documentation ⌘

Comprehensive reference manual for the CodeCollab REST APIs, WebSocket protocol, authentication mechanisms, and code execution runtime.

---

## 🌐 Base URLs

| Environment | Type | URL |
| :--- | :--- | :--- |
| **Local Development** | HTTP REST | `http://localhost:5000` |
| **Local Development** | WebSocket (WS) | `ws://localhost:5000` |
| **Production** | HTTP REST | `https://codecollab-backend-50x2.onrender.com` |
| **Production** | WebSocket (WSS) | `wss://codecollab-backend-50x2.onrender.com` |
| **Client Web App** | Production UI | `https://code-collab-eta-henna.vercel.app` |

---

## 📋 Response Format Conventions

All HTTP endpoints communicate using standard JSON (`application/json`). Responses follow consistent formatting schemas:

### Standard Success Response
```json
{
  "success": true,
  "message": "Optional human-readable confirmation message",
  "data": {
    /* payload data (object or array) */
  }
}
```

### Standard Error Response
```json
{
  "success": false,
  "message": "Specific error description"
}
```

---

## 🔐 Authentication

CodeCollab utilizes **JSON Web Tokens (JWT)** for securing protected routes.

- **Header Format**:
  ```http
  Authorization: Bearer <your_jwt_token>
  ```
- **Token Algorithm**: HMAC SHA-256 (`HS256`)
- **Payload Contents**: `{ "id": user_id, "iat": ..., "exp": ... }`
- **Token Validity / Expiration**: **7 days** (`expiresIn: "7d"`)
- **Password Security**: Passwords are pre-hashed and salted using `bcryptjs` (salt rounds: 10) before storage.

---

## 🚦 Rate Limits

To prevent denial of service and abuse of external execution services, CodeCollab applies IP-based rate limiting via `express-rate-limit`:

| Tier | Path Scope | Limit | Window | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **General API** | `/api` | **200 requests** | 15 minutes | General endpoint and room navigation protection |
| **Authentication** | `/api/auth` | **20 requests** | 15 minutes | Guards against brute-force login and registration spam |
| **Code Execution** | `/api/execute` | **50 executions** | 15 minutes | Throttles compute calls to remote Wandbox compiler |

When a rate limit threshold is exceeded, the server responds with HTTP status `429 Too Many Requests`:
```json
{
  "success": false,
  "message": "Too many requests. Please try again later."
}
```

---

## 📡 REST Endpoints

### 1. Health & Status

#### `GET /`
Verifies backend connectivity and online status.

- **Authentication**: None
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "CodeCollab API running"
}
```

---

### 2. Authentication (`/api/auth`)

#### `POST /api/auth/register`
Creates a new user account, stores hashed credentials, and returns a JWT.

- **Authentication**: None
- **Rate Limit**: 20 requests / 15 minutes
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "securePassword123"
}
```
- **Validation Rules**:
  - `name`: String, required, 2-50 characters.
  - `email`: Valid email format, required, unique in database.
  - `password`: String, required, minimum 6 characters.
- **Success Response `201 Created`**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "Ada Lovelace",
      "email": "ada@example.com",
      "created_at": "2026-09-26T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg5..."
  }
}
```
- **Error Responses**:
  - `400 Bad Request`: Missing fields or invalid format.
  - `400 Bad Request`: Email already registered.

---

#### `POST /api/auth/login`
Authenticates user credentials and returns an active JWT.

- **Authentication**: None
- **Rate Limit**: 20 requests / 15 minutes
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "email": "ada@example.com",
  "password": "securePassword123"
}
```
- **Success Response `200 OK`**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Ada Lovelace",
      "email": "ada@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg5..."
  }
}
```
- **Error Responses**:
  - `401 Unauthorized`: Invalid email or password.

---

#### `GET /api/auth/me`
Fetches authenticated user profile data using current session token.

- **Authentication**: **Required** (`Bearer <token>`)
- **Request Headers**:
  ```http
  Authorization: Bearer <token>
  ```
- **Success Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Ada Lovelace",
      "email": "ada@example.com",
      "created_at": "2026-09-26T10:00:00.000Z"
    }
  }
}
```
- **Error Responses**:
  - `401 Unauthorized`: Not authorized, no token or token expired.

---

### 3. Room Management (`/api/rooms`)

#### `POST /api/rooms`
Generates a collaborative workspace with a unique 6-character room code.

- **Authentication**: **Required** (`Bearer <token>`)
- **Request Body**:
```json
{
  "name": "Algorithms & Data Structures",
  "language": "javascript"
}
```
- **Supported Languages**: `javascript`, `python`, `cpp`, `java` (defaults to `javascript`)
- **Success Response `201 Created`**:
```json
{
  "success": true,
  "message": "Room created successfully",
  "data": {
    "id": 12,
    "code": "A9B2K7",
    "name": "Algorithms & Data Structures",
    "language": "javascript",
    "owner_id": 1,
    "created_at": "2026-09-26T10:15:00.000Z"
  }
}
```

---

#### `GET /api/rooms/my`
Returns all rooms created by the currently authenticated user, sorted latest first.

- **Authentication**: **Required** (`Bearer <token>`)
- **Success Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": 12,
      "code": "A9B2K7",
      "name": "Algorithms & Data Structures",
      "language": "javascript",
      "owner_id": 1,
      "created_at": "2026-09-26T10:15:00.000Z",
      "updated_at": "2026-09-26T10:15:00.000Z"
    }
  ]
}
```

---

#### `GET /api/rooms/:code`
Fetches room details and owner metadata by unique room code.

- **Authentication**: **Required** (`Bearer <token>`)
- **Parameters**: `code` (e.g. `A9B2K7`)
- **Success Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "id": 12,
    "code": "A9B2K7",
    "name": "Algorithms & Data Structures",
    "language": "javascript",
    "owner_id": 1,
    "owner_name": "Ada Lovelace",
    "owner_email": "ada@example.com",
    "created_at": "2026-09-26T10:15:00.000Z",
    "updated_at": "2026-09-26T10:15:00.000Z"
  }
}
```
- **Error Responses**:
  - `404 Not Found`: Room not found with the provided code.

---

#### `DELETE /api/rooms/:id`
Deletes a room owned by the authenticated user.

- **Authentication**: **Required** (`Bearer <token>`)
- **Parameters**: `id` (integer room ID)
- **Success Response `200 OK`**:
```json
{
  "success": true,
  "message": "Room deleted successfully"
}
```
- **Error Responses**:
  - `404 Not Found`: Room not found or caller is not the owner.

---

### 4. Code Execution (`/api/execute`)

#### `POST /api/execute`
Compiles and runs code inside an isolated remote sandbox environment via Wandbox.

- **Authentication**: **Required** (`Bearer <token>`)
- **Rate Limit**: 50 executions / 15 minutes
- **Request Body**:
```json
{
  "code": "console.log('Hello from CodeCollab sandbox');",
  "language": "javascript",
  "stdin": ""
}
```
- **Payload Constraints**:
  - Maximum code size: **50,000 characters**
  - Execution timeout: **30 seconds**
  - Pattern filter: Blocks overt infinite loops (`while(true)`, `for(;;)`) and fork bombs
- **Success Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "stdout": "Hello from CodeCollab sandbox\n",
    "stderr": "",
    "exitCode": 0,
    "signal": null,
    "duration": 412,
    "hasError": false,
    "language": "javascript"
  }
}
```
- **Execution Error Response `200 OK` (when user code has compilation or runtime errors)**:
```json
{
  "success": true,
  "data": {
    "stdout": "",
    "stderr": "ReferenceError: foo is not defined\n    at prog.js:2:1",
    "exitCode": 1,
    "signal": null,
    "duration": 380,
    "hasError": true,
    "language": "javascript"
  }
}
```
- **Error Responses**:
  - `400 Bad Request`: Code is required or unsupported language.
  - `400 Bad Request`: Code too long (> 50,000 chars) or blocked infinite loop pattern detected.
  - `408 Request Timeout`: Remote compilation exceeded 30 seconds.
  - `500 Internal Server Error`: Execution service unavailable.

---

## ⚡ WebSocket Events Reference

CodeCollab manages live synchronization over a Socket.io persistent connection.

### Connection & Authentication
Clients connect using `io(SOCKET_URL, { transports: ["websocket", "polling"], credentials: true })`.

---

### Client ➔ Server Events

| Event Name | Payload | Description |
| :--- | :--- | :--- |
| `join-room` | `{ roomCode: string, user: { id: number, name: string } }` | Emitted when entering a room. Server binds socket to room channel and sends initial snapshots. |
| `code-init` | `{ roomCode: string, code: string, language: string }` | Dispatched by room owner if room has no initial buffer initialized. |
| `code-change` | `{ roomCode: string, code: string, language?: string }` | Dispatched on editor content change to propagate buffer updates. |
| `cursor-move` | `{ roomCode: string, position: { lineNumber: number, column: number } }` | Transmits current cursor coordinates. |
| `typing-start` | `{ roomCode: string }` | Emitted when user focuses/types in chat input. |
| `typing-stop` | `{ roomCode: string }` | Emitted when user stops typing or blurs chat input. |
| `chat-message` | `{ roomCode: string, text: string }` | Dispatched to send a room message. Text is sanitized on server (tags stripped, max 500 chars). |
| `output-update` | `{ roomCode: string, output: object }` | Shares execution results with peers in the room. |
| `leave-room` | *none* | Explicitly notifies server that user is leaving the room workspace. |

---

### Server ➔ Client Events

| Event Name | Payload | Target | Description |
| :--- | :--- | :--- | :--- |
| `code-snapshot` | `{ code: string \| null, language: string \| null }` | Joining Client | Delivers current editor code buffer and language upon joining. |
| `chat-history` | `Array<Message>` | Joining Client | Sends array of the last 100 chat messages recorded in memory. |
| `room-users` | `Array<{ id: string, userId: number, name: string, joinedAt: string }>` | All Room Members | Broadcasts current active online user list whenever members join or disconnect. |
| `code-update` | `{ code: string, language?: string }` | Room Peers (excl. sender) | Relays editor text updates in real-time. |
| `cursor-update` | `{ userId: number, name: string, position: { lineNumber: number, column: number } }` | Room Peers (excl. sender) | Positions peer cursor widgets in Monaco Editor. |
| `user-typing` | `{ userId: number, name: string }` | Room Peers (excl. sender) | Renders active typing indicator in chat window. |
| `user-stop-typing` | `{ userId: number }` | Room Peers (excl. sender) | Clears active typing indicator. |
| `chat-message` | `{ id: string, userId: number, name: string, text: string, timestamp: string }` | All Room Members | Delivers sanitized message to room chat. |
| `output-update` | `{ output: object, by: string, at: string }` | Room Peers (excl. sender) | Displays peer's execution output in the terminal panel. |

---

## 💻 Supported Execution Languages

CodeCollab supports 4 primary programming languages via isolated sandboxed containers:

| Language | Identifier | Compiler Engine | Compiler Options | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **JavaScript** | `javascript` | Node.js `20.17.0` | None | Full ES2023+ modern JavaScript support |
| **Python** | `python` | CPython `3.12.7` | None | Standard library available |
| **C++** | `cpp` | GCC `13.2.0` | `warning,gnu++2b` | C++23 draft standard enabled |
| **Java** | `java` | OpenJDK `22+36` | None | Automatic `public class` re-scoping to `class` to support single-file Wandbox compilation |

---

## ⚠️ HTTP Status Codes Reference

| Status Code | Meaning | Typical Scenario |
| :--- | :--- | :--- |
| **`200 OK`** | Request Succeeded | Successful fetch, update, deletion, or execution |
| **`201 Created`** | Resource Created | Account registered or collaborative room generated |
| **`400 Bad Request`** | Invalid Request | Missing required parameters, malformed JSON, or dangerous code loop pattern |
| **`401 Unauthorized`** | Authentication Failure | Missing token, expired JWT, or invalid login credentials |
| **`404 Not Found`** | Not Found | Room code does not exist or route undefined |
| **`408 Request Timeout`** | Execution Timeout | Wandbox compiler execution timed out (> 30 seconds) |
| **`429 Too Many Requests`** | Rate Limit Exceeded | Exceeded 200 general, 20 auth, or 50 execution requests per 15-minute window |
| **`500 Internal Server Error`** | Server Error | Unhandled server exception or database connectivity issue |
