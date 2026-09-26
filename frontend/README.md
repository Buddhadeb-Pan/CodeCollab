# CodeCollab Frontend ⌘

Real-time collaborative code editor — React client application powered by Vite and Monaco Editor.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Editor**: [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react) (VS Code's editor core)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom "Blueprint" design tokens
- **Routing**: [React Router v6](https://reactrouter.com/) (BrowserRouter with ProtectedRoute guards)
- **Real-Time Client**: [Socket.io-client](https://socket.io/)
- **HTTP Client**: [Axios](https://axios-http.com/) with request token interceptors and response error alerts
- **Notifications**: [react-hot-toast](https://react-hot-toast.com/)
- **Linter**: [Oxlint](https://oxc-project.github.io/)

---

## 🚀 Setup Instructions

### 1. Prerequisites
- Node.js v18+ installed
- CodeCollab backend running (or access to deployed backend)

### 2. Installation
Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

### 3. Environment Configuration
Create a `.env` file (or copy from `.env.example`):
```bash
cp .env.example .env
```

Set the backend API URL:
```env
# For local backend:
VITE_API_URL=http://localhost:5000

# Or for deployed backend:
# VITE_API_URL=https://codecollab-backend-50x2.onrender.com
```

### 4. Run Development Server
```bash
npm run dev
```
The application will be running at `http://localhost:5173`.

### 5. Production Build
```bash
# Build production bundle
npm run build

# Preview build locally
npm run preview
```
Production assets are output to `dist/`.

---

## 🎨 Design System — "The Blueprint"

CodeCollab avoids standard generic UI components in favor of **The Blueprint**, an engineering-inspired design system tailored for developers and technical pair programming.

### 1. Color Palette
- **Midnight Navy (`#0a0e1a`)**: Deep, low-fatigue workspace canvas background.
- **Surface Navy (`#111827` / `#161e2e`)**: Component cards, sidebars, and editor panels.
- **Blueprint Line (`#1e293b`)**: Subtle grid lines and structural architectural borders.
- **Amber Accent (`#f59e0b`)**: High-visibility terminal-inspired highlights, active states, and call-to-actions.
- **Cream Text (`#f5f0e8`)**: Crisp, readable typography without harsh stark white contrast.
- **Muted Slate (`#64748b`)**: Secondary annotations, timestamps, and commentary.

### 2. Typography
- **Headings & Accents**: `JetBrains Mono` — monospace aesthetic for button labels, room codes, telemetry data, and section comments.
- **Body & Forms**: `Inter` — high-legibility grotesque sans-serif for UI labels, explanations, and messages.

### 3. Component Affordances
- **Blueprint Grid Canvas**: Custom repeating grid overlay (`bg-grid`) evocative of technical drafting paper.
- **Bracket-Style Buttons**: Developer-centric button styling:
  - `[ ▶ run_code ]` — Run trigger
  - `[ ＋ create_room ]` — Room creator
  - `[ ✕ leave_room ]` — Exit workspace
  - `[ 📋 copy_code ]` — Clipboard helper
- **Code-Comment Headers**: Technical section labels styled like code comments:
  - `// 01. real-time sync`
  - `// active_peers`
  - `// output_console`

---

## 📄 Application Pages

| Path | Page Component | Access | Description |
| :--- | :--- | :--- | :--- |
| `/` | `Home.jsx` | Public | Landing page showcasing live demo, features, tech stack, and quick start calls to action. |
| `/login` | `Login.jsx` | Public | Authentication view with remember-me state, validation, and demo credentials. |
| `/register` | `Register.jsx` | Public | New user sign-up with password validation and instant session initialization. |
| `/dashboard` | `Dashboard.jsx` | Protected | User dashboard displaying personal room cards, skeleton loaders, quick room join, and create room modal. |
| `/room/:code` | `Room.jsx` | Protected | Collaborative workspace featuring Monaco editor, language selector, execution panel, peer cursor tracking, presence list, and live room chat. |

---

## 🌐 Deployment

The frontend is deployed as a Single Page Application (SPA) on **Vercel**.

- **Live URL**: [https://code-collab-eta-henna.vercel.app](https://code-collab-eta-henna.vercel.app)
- **Framework Preset**: `Vite`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variable**: `VITE_API_URL=https://codecollab-backend-50x2.onrender.com`

### SPA Routing Configuration (`vercel.json`)
To handle client-side routing with React Router without 404 errors on direct navigation:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 📖 API Documentation

For the complete REST API specification, WebSocket event dictionary, request/response examples, and error codes, refer to:

👉 **[API Documentation](../docs/API.md)**
