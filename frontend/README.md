# CodeCollab Frontend

Real-time collaborative code editor — React frontend.

## Tech Stack
- React + Vite
- TailwindCSS (custom "Blueprint" design system)
- React Router v6 (BrowserRouter)
- Axios
- react-hot-toast

## Setup

1. cd frontend
2. npm install
3. Create ".env" (copy from .env.example)
4. npm run dev

App runs at http://localhost:5173

## Build

npm run build

Output goes to "dist/"

## Design System — "The Blueprint"

- Colors: midnight navy (#0a0e1a), amber accent (#f59e0b), cream text (#f5f0e8)
- Fonts: JetBrains Mono (headers), Inter (body)
- Style: blueprint grid background, bracket-style buttons, code-comment section labels
- Components: Button, Input, Card, Navbar, SectionLabel

## Deployment

Deployed on Vercel.

- Framework Preset: Vite
- Root Directory: frontend
- Build Command: npm run build
- Output Directory: dist
- Environment Variable: VITE_API_URL=https://codecollab-backend-50x2.onrender.com

## Pages
- / — Landing
- /login — Login
- /register — Register
- /dashboard — Dashboard (protected)

## Status
🚧 Day 2 complete — Auth UI working
